const Event = require('../models/Event');

exports.trackEvent = async (req, res) => {
  try {
    const { session_id, event_type, url, timestamp, click_data } = req.body;
    
    const newEvent = new Event({
      session_id,
      event_type,
      url,
      timestamp: timestamp || new Date(),
      click_data
    });

    await newEvent.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: "$session_id",
          total_events: { $sum: 1 },
          last_activity: { $max: "$timestamp" }
        }
      },
      { $sort: { last_activity: -1 } }
    ]);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSessionDetails = async (req, res) => {
  try {
    const events = await Event.find({ session_id: req.params.sessionId }).sort({ timestamp: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHeatmapData = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ message: 'URL required' });
    }
    const clicks = await Event.find({ url, event_type: 'click' }).select('click_data timestamp');
    res.status(200).json(clicks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};