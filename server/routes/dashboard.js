const express = require('express');
const Concern = require('../models/Concern');
const User = require('../models/User');

const router = express.Router();

// GET /api/dashboard/kpis
router.get('/kpis', async (req, res) => {
  try {
    const totalConcerns = await Concern.countDocuments();
    const resolved = await Concern.countDocuments({ status: 'resolved' });
    const activeUsers = await User.countDocuments({ verified: true });

    res.json([
      { icon: '⚠️', val: totalConcerns.toLocaleString(), label: 'Total Concerns', trend: 12, color: 'var(--color-primary)' },
      { icon: '✅', val: resolved.toLocaleString(), label: 'Resolved', trend: 8, color: 'var(--color-success)' },
      { icon: '🕑', val: '38h', label: 'Avg Response Time', trend: -15, color: 'var(--color-accent)' },
      { icon: '👥', val: activeUsers.toLocaleString(), label: 'Active Citizens', trend: 22, color: 'var(--color-info)' },
    ]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
});

// GET /api/dashboard/categories
router.get('/categories', async (req, res) => {
  try {
    const pipeline = [
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ];
    const result = await Concern.aggregate(pipeline);
    const max = result.length > 0 ? result[0].count : 1;
    const colors = ['#0f766e', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444', '#22c55e'];
    const categories = result.map((c, i) => ({
      name: c._id || 'Other',
      count: c.count,
      pct: Math.round((c.count / max) * 100),
      color: colors[i % colors.length],
    }));
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/dashboard/activity
router.get('/activity', async (req, res) => {
  try {
    const recent = await Concern.find().sort({ createdAt: -1 }).limit(5).lean();
    const activity = recent.map((c, i) => {
      const icons = { submitted: '📍', under_review: '🔍', resolved: '✅', rejected: '❌' };
      const timeAgo = getTimeAgo(c.createdAt);
      return {
        id: i + 1,
        icon: icons[c.status] || '📍',
        text: `Concern "${c.title}" — ${c.status.replace('_', ' ')}.`,
        time: timeAgo,
      };
    });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

function getTimeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

module.exports = router;
