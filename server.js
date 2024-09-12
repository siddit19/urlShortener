// server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const urlRoutes = require('./routes/urlRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Basic route for testing
// app.get('/', (req, res) => {
//   res.send('URL Shortener API is running...');
// });

app.use('/api', urlRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
