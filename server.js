const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5002;

// Routes
const userRoute = require('./route/userRoute');
const lockRoute = require('./route/lockRoute');
const roomRoute = require('./route/roomRoute');

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// URL
app.use('/api/v1/user', userRoute);
app.use('/api/v1/lock', lockRoute);
app.use('/api/v1/room', roomRoute);

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});