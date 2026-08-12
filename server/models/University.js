const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  impact: { type: Number, default: 0 },
  solved: { type: Number, default: 0 },
  research: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('University', universitySchema);
