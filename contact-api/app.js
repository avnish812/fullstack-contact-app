// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const contactsRoutes = require('./routes/routes');
const app = express();
const port = 3000;
const path = require('path');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/error_logs', express.static(path.join(__dirname, 'error_logs')));
app.use(cors());

// Routes
app.use('/api', contactsRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
