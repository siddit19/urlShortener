// middlewares/rateLimiter.js

const { RateLimiterMemory } = require('rate-limiter-flexible');

// Create rate limiter options
const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // Per 60 seconds per IP
  blockDuration: 60, // Block for 60 seconds if consumed more than allowed
});

// Middleware to apply rate limiting
const rateLimiterMiddleware = async (req, res, next) => {
  try {
    // Consume 1 point per request
    await rateLimiter.consume(req.ip);
    next();
  } catch (rateLimiterRes) {
    // Handle rate limiting errors
    res.status(429).json({
      message: 'Too many requests. Please try again later.',
    });
  }
};

module.exports = rateLimiterMiddleware;
