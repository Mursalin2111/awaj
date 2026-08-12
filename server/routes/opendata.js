const express = require('express');
const Concern = require('../models/Concern');
const Proposal = require('../models/Proposal');
const Research = require('../models/Research');
const User = require('../models/User');

const router = express.Router();

// GET /api/open-data/stats
router.get('/stats', async (req, res) => {
  try {
    const totalConcerns = await Concern.countDocuments();
    const totalProposals = await Proposal.countDocuments();
    const totalResearch = await Research.countDocuments();
    const totalUsers = await User.countDocuments({ verified: true });

    // Compute average votes
    const voteAgg = await Concern.aggregate([{ $group: { _id: null, avg: { $avg: '$votes' } } }]);
    const avgVotes = voteAgg.length > 0 ? voteAgg[0].avg.toFixed(1) : '0';

    const resolved = await Concern.countDocuments({ status: 'resolved' });
    const resolutionRate = totalConcerns > 0 ? Math.round((resolved / totalConcerns) * 100) + '%' : '0%';

    res.json([
      { icon: '⚠️', val: totalConcerns.toLocaleString(), label: 'Total Concerns' },
      { icon: '💬', val: totalProposals.toLocaleString(), label: 'Proposals' },
      { icon: '🔬', val: totalResearch.toLocaleString(), label: 'Research Problems' },
      { icon: '🏆', val: totalUsers.toLocaleString(), label: 'Verified Users' },
      { icon: '👍', val: avgVotes, label: 'Avg Concern Votes' },
      { icon: '✅', val: resolutionRate, label: 'Resolution Rate' },
    ]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/open-data/concerns
router.get('/concerns', async (req, res) => {
  try {
    const concerns = await Concern.find()
      .select('title category status votes createdAt')
      .sort({ votes: -1 })
      .lean();
    const result = concerns.map(c => ({
      ...c,
      id: c._id,
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : '',
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch concerns data' });
  }
});

module.exports = router;
