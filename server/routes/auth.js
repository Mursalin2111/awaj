const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create reusable transporter
function createTransporter() {
  require('dotenv').config({ path: __dirname + '/../.env', override: true });
  const user = (process.env.SMTP_EMAIL || '').trim();
  const pass = (process.env.SMTP_PASSWORD || '').replace(/\s+/g, '');
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

// Generate 6-digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/send-code
router.post('/send-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const code = generateCode();
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const lowerEmail = email.toLowerCase().trim();
    const isAuthority = lowerEmail.includes('authority') || lowerEmail.includes('admin') || lowerEmail.includes('gov.bd');
    const assignedRole = isAuthority ? 'authority' : 'citizen';

    // Upsert user — create if doesn't exist
    await User.findOneAndUpdate(
      { email: lowerEmail },
      { 
        verificationCode: code, 
        codeExpiry,
        ...(isAuthority ? { role: 'authority' } : {}) 
      },
      { upsert: true, new: true }
    );

    // Send real email via SMTP
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Awaz — The Voice of People" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Your Awaz Verification Code',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f766e; margin-bottom: 8px;">🛡️ Awaz Verification</h2>
          <p style="color: #475569; font-size: 15px;">Your one-time verification code is:</p>
          <div style="background: #0f766e; color: #fff; font-size: 32px; font-weight: 800; letter-spacing: 8px; text-align: center; padding: 20px; border-radius: 8px; margin: 16px 0;">
            ${code}
          </div>
          <p style="color: #64748b; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">Awaz — The Voice of People · Dhaka, Bangladesh</p>
        </div>
      `,
    });

    console.log(`✉️ Verification email successfully sent to ${email}`);
    res.json({ success: true, message: `Verification code sent to ${email}` });
  } catch (error) {
    console.error('Send code SMTP error:', error);
    res.status(500).json({ error: `Email delivery failed: ${error.message}` });
  }
});

// POST /api/auth/verify-code
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ error: 'No verification request found for this email' });

    // Check code
    if (user.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Check expiry
    if (user.codeExpiry && new Date() > user.codeExpiry) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    // Mark verified and clear code
    user.verified = true;
    user.verificationCode = null;
    user.codeExpiry = null;
    if (!user.name) {
      user.name = email.split('@')[0]; // Default name from email
    }
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    },
  });
});

// Ensure default Authority user account exists in DB
async function seedAuthorityAccount() {
  try {
    const existing = await User.findOne({ $or: [{ authorityId: 'AUTH-101' }, { email: 'authority@awaj.gov.bd' }] });
    if (!existing) {
      await User.create({
        email: 'authority@awaj.gov.bd',
        name: 'DNCC Municipal Authority',
        authorityId: 'AUTH-101',
        password: 'admin12345',
        role: 'authority',
        verified: true,
      });
      console.log('🏛️ Default Authority account created: ID: AUTH-101 | Pass: admin12345');
    }
  } catch (err) {
    console.error('Seed authority account error:', err);
  }
}
seedAuthorityAccount();

// POST /api/auth/authority-login — Login with Authority ID & Password
router.post('/authority-login', async (req, res) => {
  try {
    const { authorityId, password } = req.body;
    if (!authorityId || !password) {
      return res.status(400).json({ error: 'Authority ID and password are required' });
    }

    const cleanId = authorityId.trim();
    const idRegex = new RegExp(`^${cleanId.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, 'i');

    // Find authority user by authorityId or email
    const user = await User.findOne({
      $or: [
        { authorityId: idRegex },
        { email: cleanId.toLowerCase() }
      ],
      role: { $in: ['authority', 'admin'] }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid Authority ID or account not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        authorityId: user.authorityId,
      },
    });
  } catch (error) {
    console.error('Authority login error:', error);
    res.status(500).json({ error: 'Authority authentication failed' });
  }
});

module.exports = router;
