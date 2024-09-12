

const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expirationDate: {
    type: Date,
    default: null, // Optional expiration date
  },
  visitCount: {
    type: Number,
    default: 0,
  },
  uniqueVisitors: {
    type: Number,
    default: 0,
  },
  visitsByDevice: {
    desktop: {
      type: Number,
      default: 0,
    },
    mobile: {
      type: Number,
      default: 0,
    },
    tablet: {
      type: Number,
      default: 0,
    },
  },
  referrers: {
    type: Map,
    of: Number, // A map where keys are referring websites and values are visit counts
    default: {},
  },
});

module.exports = mongoose.model('Url', UrlSchema);
