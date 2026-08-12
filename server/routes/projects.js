const express = require('express');
const Project = require('../models/Project');

const router = express.Router();

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const { filter } = req.query;
    let query = {};
    if (filter && filter !== 'All') {
      query.category = filter;
    }
    const projects = await Project.find(query).sort({ progress: -1 }).lean();
    const result = projects.map(p => ({ ...p, id: p._id }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

module.exports = router;
