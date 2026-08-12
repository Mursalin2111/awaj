const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  date: { type: String, required: true },
  note: { type: String, required: true },
  status: { type: String, required: true },
}, { _id: false });

const concernSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'resolved', 'rejected'],
    default: 'submitted',
  },
  votes: {
    type: Number,
    default: 0,
  },
  votedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  location: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  authorName: {
    type: String,
    default: 'Anonymous',
  },
  photos: [String],
  updates: [updateSchema],
}, { timestamps: true });

// Virtual field to get createdAt as date string
concernSchema.virtual('createdAtDate').get(function () {
  return this.createdAt.toISOString().split('T')[0];
});

concernSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Concern', concernSchema);
