const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  status: { type: String, required: true },
  statusClass: { type: String, default: 'badge-neutral' },
  progress: { type: Number, default: 0 },
  deadline: { type: String, required: true },
  allocated: { type: String, required: true },
  spent: { type: String, required: true },
  category: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
