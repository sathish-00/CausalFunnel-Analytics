const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  session_id: { 
    type: String, 
    required: true, 
    index: true 
  },
  event_type: { 
    type: String, 
    enum: ['page_view', 'click'], 
    required: true 
  },
  url: { 
    type: String, 
    required: true,
    index: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  click_data: {
    x: { type: Number },
    y: { type: Number },
    window_width: { type: Number },
    window_height: { type: Number }
  }
});

module.exports = mongoose.model('Event', EventSchema);