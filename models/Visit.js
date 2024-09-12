

const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userAgent: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
    required: true,
  },
  referrer: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Visit', VisitSchema);
