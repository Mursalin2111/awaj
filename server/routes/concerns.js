const express = require('express');
const Concern = require('../models/Concern');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/concerns — list concerns (Privacy Filter: Citizen sees only their own, Authority sees ALL)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, status, sort } = req.query;
    let filter = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Unauthenticated visitors see empty list (prompt to log in)
    if (!req.user) {
      return res.json([]);
    }

    // Citizen users see ONLY concerns reported by themselves
    if (req.user.role !== 'authority' && req.user.role !== 'admin') {
      filter.author = req.user._id;
    }

    let sortObj = { votes: -1 };
    if (sort === 'recent') sortObj = { createdAt: -1 };

    const concerns = await Concern.find(filter).sort(sortObj).lean();

    const userId = req.user._id.toString();
    const result = concerns.map(c => ({
      ...c,
      id: c._id,
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : '',
      voted: c.votedBy?.some(v => v.toString() === userId) || false,
    }));

    res.json(result);
  } catch (error) {
    console.error('Get concerns error:', error);
    res.status(500).json({ error: 'Failed to fetch concerns' });
  }
});

// GET /api/concerns/geocode — reverse geocode lat/lon or IP location
router.get('/geocode', async (req, res) => {
  try {
    let { lat, lon } = req.query;

    if (!lat || !lon) {
      try {
        const ipRes = await fetch('http://ip-api.com/json/');
        const ipData = await ipRes.json();
        if (ipData && ipData.lat && ipData.lon) {
          lat = ipData.lat;
          lon = ipData.lon;
        }
      } catch (e) {
        console.error('IP geocode error:', e);
      }
    }

    if (!lat || !lon) {
      return res.json({ location: 'Mirpur 10, Dhaka' });
    }

    const osmRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
      headers: { 'User-Agent': 'AwajCivicApp/1.0', 'Accept-Language': 'en' }
    });

    if (osmRes.ok) {
      const data = await osmRes.json();
      const addr = data.address || {};
      const area = addr.road || addr.residential || addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || '';
      const city = addr.city || addr.town || addr.county || 'Dhaka';
      const cleanName = [area, city].filter(Boolean).join(', ');
      return res.json({
        location: cleanName ? `${cleanName} (${parseFloat(lat).toFixed(4)}, ${parseFloat(lon).toFixed(4)})` : `GPS: ${parseFloat(lat).toFixed(5)}, ${parseFloat(lon).toFixed(5)}`,
        area: area || city,
        city,
        lat,
        lon,
      });
    }

    res.json({ location: `GPS: ${parseFloat(lat).toFixed(5)}, ${parseFloat(lon).toFixed(5)}`, lat, lon });
  } catch (error) {
    console.error('Geocode error:', error);
    res.json({ location: 'Dhaka, Bangladesh' });
  }
});

// GET /api/concerns/:id — single concern (Privacy check: Only author or authority can view)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const concern = await Concern.findById(req.params.id).lean();
    if (!concern) return res.status(404).json({ error: 'Concern not found' });

    if (!req.user) {
      return res.status(401).json({ error: 'Please log in to view this concern.' });
    }

    const isAuthor = concern.author && concern.author.toString() === req.user._id.toString();
    const isAuthority = req.user.role === 'authority' || req.user.role === 'admin';

    if (!isAuthor && !isAuthority) {
      return res.status(403).json({ error: 'Access denied: You can only view concerns reported by yourself.' });
    }

    const userId = req.user._id.toString();
    res.json({
      ...concern,
      id: concern._id,
      createdAt: concern.createdAt ? new Date(concern.createdAt).toISOString().split('T')[0] : '',
      voted: concern.votedBy?.some(v => v.toString() === userId) || false,
      canUpdateStatus: isAuthority,
    });
  } catch (error) {
    console.error('Get concern error:', error);
    res.status(500).json({ error: 'Failed to fetch concern' });
  }
});

// POST /api/concerns/:id/status — Authority update concern status and note
router.post('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'authority' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only authorities can update concern status.' });
    }

    const { status, note } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const concern = await Concern.findById(req.params.id);
    if (!concern) return res.status(404).json({ error: 'Concern not found' });

    concern.status = status;
    concern.updates.unshift({
      date: new Date().toISOString().split('T')[0],
      note: note || `Status updated to ${status.replace('_', ' ')} by Authority.`,
      status,
    });

    await concern.save();
    res.json({ success: true, concern });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// POST /api/concerns — create new concern
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, location, photos } = req.body;
    if (!title || !description || !category || !location) {
      return res.status(400).json({ error: 'Title, description, category, and location are required' });
    }

    const concern = await Concern.create({
      title,
      description,
      category,
      location,
      photos: photos || [],
      status: 'submitted',
      author: req.user._id,
      authorName: req.user.name || req.user.email.split('@')[0],
      updates: [{
        date: new Date().toISOString().split('T')[0],
        note: 'Concern reported by verified citizen.',
        status: 'submitted',
      }],
    });

    res.status(201).json({ ...concern.toJSON(), id: concern._id });
  } catch (error) {
    console.error('Create concern error:', error);
    res.status(500).json({ error: 'Failed to create concern' });
  }
});

// POST /api/concerns/:id/vote — toggle vote
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const concern = await Concern.findById(req.params.id);
    if (!concern) return res.status(404).json({ error: 'Concern not found' });

    const userId = req.user._id;
    const alreadyVoted = concern.votedBy.some(v => v.toString() === userId.toString());

    if (alreadyVoted) {
      concern.votedBy = concern.votedBy.filter(v => v.toString() !== userId.toString());
      concern.votes = Math.max(0, concern.votes - 1);
    } else {
      concern.votedBy.push(userId);
      concern.votes += 1;
    }

    await concern.save();
    res.json({ votes: concern.votes, voted: !alreadyVoted });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to vote' });
  }
});

module.exports = router;
