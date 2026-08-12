const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  desc: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  authorName: { type: String, default: 'Anonymous' },
  votes: { type: Number, default: 0 },
  votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: { type: Number, default: 0 },
  tags: [String],
}, { timestamps: true });

proposalSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Proposal', proposalSchema);
