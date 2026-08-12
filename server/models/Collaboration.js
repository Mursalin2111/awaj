const mongoose = require('mongoose');

const collaborationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  messages: { type: Number, default: 0 },
  participants: { type: Number, default: 0 },
  desc: { type: String, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Collaboration', collaborationSchema);
