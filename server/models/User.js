const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    default: '',
  },
  authorityId: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['citizen', 'admin', 'authority'],
    default: 'citizen',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    default: null,
  },
  codeExpiry: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
