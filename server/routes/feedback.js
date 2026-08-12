const express = require('express');
const router = express.Router();

// Temporary in-memory or log store for citizen feedback messages
const feedbackList = [];

// POST /api/feedback — Submit questions or feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!message || !email) {
      return res.status(400).json({ error: 'Email and message are required' });
    }

    const newFeedback = {
      id: Date.now().toString(),
      name: name || 'Anonymous Citizen',
      email,
      message,
      createdAt: new Date().toISOString()
    };

    feedbackList.push(newFeedback);
    console.log(`📩 New Citizen Feedback Received from ${email}:`, message);

    res.json({
      success: true,
      message: 'Feedback received successfully. Thank you for helping improve Awaz!',
      feedback: newFeedback
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ error: 'Failed to record feedback' });
  }
});

module.exports = router;
