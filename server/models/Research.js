const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ministry: { type: String, required: true },
  grant: { type: String, required: true },
  applicants: { type: Number, default: 0 },
  desc: { type: String, required: true },
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Research', researchSchema);
