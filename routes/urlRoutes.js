

const express = require('express');
const { shortenUrl, redirectUrl, getAnalytics } = require('../controllers/urlController');
const rateLimiterMiddleware = require('../middlewares/rateLimiter');

const router = express.Router();

//rate limiting to the shorten URL route
router.post('/shorten', rateLimiterMiddleware, shortenUrl);

// No rate limiting for redirection, to ensure smooth user experience

router.get('/:code', redirectUrl);

// router.get('/test',(req,res)=>{
//     res.send('Test route works')
// })

//rate limiting to analytics data retrieval
router.get('/analytics/:code', rateLimiterMiddleware, getAnalytics);

module.exports = router;
