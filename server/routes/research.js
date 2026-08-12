const express = require('express');
const Research = require('../models/Research');

const router = express.Router();

// GET /api/research
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { ministry: regex }];
    }
    const problems = await Research.find(filter).sort({ applicants: -1 }).lean();
    const result = problems.map(r => ({ ...r, id: r._id }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch research problems' });
  }
});

module.exports = router;
