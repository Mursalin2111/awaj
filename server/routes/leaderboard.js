const express = require('express');
const University = require('../models/University');

const router = express.Router();

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const universities = await University.find().sort({ impact: -1 }).lean();
    const result = universities.map(u => ({ ...u, id: u._id }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
