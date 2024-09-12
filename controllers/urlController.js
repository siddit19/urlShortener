

const Url = require('../models/Url');
const Visit = require('../models/Visit');
const shortid = require('shortid');
const useragent = require('useragent');

// Controller to shorten a URL
const shortenUrl = async (req, res) => {
    try {
      const { originalUrl, customCode, expirationDays } = req.body;
  
      // Generate or use the custom short code
      let shortCode = customCode || shortid.generate();
  
      // Checking if the custom short code already exists
      const existingUrl = await Url.findOne({ shortCode });
      if (existingUrl) {
        return res.status(400).json({ message: 'Custom short code already in use' });
      }
  
      // Calculating expiration date if provided
      let expirationDate = null;
      if (expirationDays && !isNaN(expirationDays)) {
        expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + parseInt(expirationDays, 10));
      }
  
      // Creating new URL document
      const url = new Url({
        originalUrl,
        shortCode,
        expirationDate,
      });
  
      await url.save();
  
      res.status(201).json({
        originalUrl,
        shortCode,
        shortUrl: `${process.env.BASE_URL}/api/${shortCode}`,
        expirationDate,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };


// Controller to handle redirection and tracking
const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    // Check if URL exists or is expired
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    if (url.expirationDate && url.expirationDate < new Date()) {
      return res.status(410).json({ message: 'URL has expired' });
    }

    // Parse user agent to determine device type
    const agent = useragent.parse(req.headers['user-agent']);
    const deviceType = agent.isMobile ? 'mobile' : agent.isTablet ? 'tablet' : 'desktop';
    
    const ipAddress = req.ip;
     // Track unique visitors using IP address checks
    const uniqueVisitor = await Visit.findOne({ urlId: url._id, ipAddress });
    if (!uniqueVisitor) {
      url.uniqueVisitors += 1;
    }

    // Track the visit

    const referrer = req.headers.referer || 'direct';
    await Visit.create({
      urlId: url._id,
      userAgent: req.headers['user-agent'],
      ipAddress,
      deviceType,
      referrer,
    });

    // Increment visit counts
    url.visitCount += 1;
    url.visitsByDevice[deviceType] += 1;
    url.referrers.set(referrer, (url.referrers.get(referrer) || 0) + 1);


    await url.save();

    // Redirect the user to the original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Controller to retrieve analytics data
const getAnalytics = async (req, res) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Retrieve time-series data (hourly or daily counts)
    const visits = await Visit.find({ urlId: url._id }).sort({ timestamp: -1 });

    const analytics = {
      originalUrl: url.originalUrl,
      visitCount: url.visitCount,
      uniqueVisitors: url.uniqueVisitors,
      visitsByDevice: url.visitsByDevice,
      referrers: Array.from(url.referrers.entries()).sort((a, b) => b[1] - a[1]),
      timeSeries: visits.map(visit => ({
        timestamp: visit.timestamp,
        deviceType: visit.deviceType,
      })),
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  shortenUrl,
  redirectUrl,
  getAnalytics,
};
