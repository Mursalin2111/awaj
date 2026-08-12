const express = require('express');
const Collaboration = require('../models/Collaboration');

const router = express.Router();

// GET /api/collaboration/threads
router.get('/threads', async (req, res) => {
  try {
    const threads = await Collaboration.find({ active: true }).sort({ createdAt: -1 }).lean();
    const result = threads.map(t => ({
      ...t,
      id: t._id,
      date: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : '',
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
});

// GET /api/collaboration/stats
router.get('/stats', async (req, res) => {
  try {
    const total = await Collaboration.countDocuments();
    const active = await Collaboration.countDocuments({ active: true });
    res.json({
      activeThreads: active,
      totalThreads: total,
      solutionPlans: 12, // placeholder — could be derived from another collection
      approvedPlans: 5,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
