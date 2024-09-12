Step by step guide to run the urlShortener project
-> Download the zip file of the project from git repositery
->Extract the folder
->After opening up the folder in code editor, first step is to install the node modules. To do so, in the root location, run this command in the console : npm install
-> After this , set up the dotenv file. There are three enviorement variables namely PORT, MONGO_URI and BASE_URL. As of now I have kept my values so that the project can be run immediately but some other database can also be connected by just changing the connection string in MONGO_URI variable.
-> Finally to run the project, write this command in the console in root location : npm run dev
->The project will run successfully.

Step by step guide to test the APIs
-> Open the attached postMan collection. The collection named as urlShortener. There are three types of requests, 
1) customShorten(POST)-> To shorten the original URL by a 
custom code
2) redirect(GET)-> To redirect to the location of original URL by clicking on custom URL
3)analytics(GET)-> To retrieve detailed analytics about original URL, Total number of visits , Number of unique visitors, Breakdown of visits by device type, directly accessed or reffered through some website.

******Testing the customShorten request(est URL Shortening Endpoint)********
1) In the postman , after clicking on the customShorten request enter this url : http://localhost:5000/api/shorten, Headers:Content-Type: application/json, Body: Select raw and JSON
2) Input the following JSON data:
    {
  "originalUrl": "https://www.facebook.com/", // Any url can be put, I have just taken an example
  "customCode": "myfacebook",  
  "expirationDays": 7           // Optional, number of days before the URL expires
}

3)Send the Request: Click Send. You should receive a response similar to:
{
  "originalUrl": "https://www.facebook.com/",
  "shortCode": "myfacebook",
  "shortUrl": "http://localhost:5000/api/myfacebook",
  "expirationDate": "2024-09-19T12:34:56.789Z"  // If expirationDays was set
}

****************Testing the redirect request(To test Redirect with Tracking)****************************
Open a web browser and use the shortUrl recieved from the previous response of customShorten. You will be redirected to the orignal location with custom url.

Testing Expired URLs: If an expired URL is tested, it should return:
{
  "message": "URL has expired"
}


********Testing analytics request(To test Analytics Retrieval)********************
Endpoint: GET /api/analytics/:customcode

Open the analytics request and enter this URL : ttp://localhost:5000/api/analytics/myfacebook
Send the Request: Click Send. You should receive analytics data similar to:
{
  "originalUrl": "https://example.com",
  "visitCount": 5,
  "uniqueVisitors": 3,
  "visitsByDevice": {
    "desktop": 3,
    "mobile": 2,
    "tablet": 0
  },
  "referrers": [["direct", 3], ["https://referrer.com", 2]],
  "timeSeries": [
    {
      "timestamp": "2024-09-12T12:34:56.789Z",
      "deviceType": "desktop"
    }
  ]
}


***********************Test Rate Limiting*****************************
To test the rate limiting, rapidly send multiple requests to the POST /api/shorten endpoint. After the allowed number of requests (e.g., 10 requests in 60 seconds), you should see:
{
  "message": "Too many requests. Please try again later."
}



*****************Functionalities implemented***********************
Custom Short Codes: Allows user to specify a custom short code during URL shortening (check for uniqueness and conflicts).
Shortened URL Expiration: functionality to expire shortened URLs after a specific timeframe (configurable by user or admin).
API Rate Limiting with Granularity:Rate limits for URL shortening requests, considering user, IP address, and custom short code creation to prevent abuse.


******************Technologies Used***************************8
NodeJS, MONGODB

*****************Database Schemas************************8


UrlSchema = {
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
};


VisitSchema ={
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
};








