const express = require('express');
const Proposal = require('../models/Proposal');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/proposals
router.get('/', optionalAuth, async (req, res) => {
  try {
    const proposals = await Proposal.find().sort({ votes: -1 }).lean();
    const userId = req.user?._id?.toString();
    const result = proposals.map(p => ({
      ...p,
      id: p._id,
      date: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '',
      voted: userId ? p.votedBy?.some(v => v.toString() === userId) : false,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// POST /api/proposals
router.post('/', auth, async (req, res) => {
  try {
    const { title, desc, tags } = req.body;
    if (!title || !desc) return res.status(400).json({ error: 'Title and description are required' });

    const proposal = await Proposal.create({
      title,
      desc,
      tags: tags || [],
      author: req.user._id,
      authorName: req.user.name || req.user.email.split('@')[0],
    });
    res.status(201).json({ ...proposal.toJSON(), id: proposal._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});

// POST /api/proposals/:id/vote
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    const userId = req.user._id;
    const alreadyVoted = proposal.votedBy.some(v => v.toString() === userId.toString());

    if (alreadyVoted) {
      proposal.votedBy = proposal.votedBy.filter(v => v.toString() !== userId.toString());
      proposal.votes = Math.max(0, proposal.votes - 1);
    } else {
      proposal.votedBy.push(userId);
      proposal.votes += 1;
    }

    await proposal.save();
    res.json({ votes: proposal.votes, voted: !alreadyVoted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to vote' });
  }
});

module.exports = router;
