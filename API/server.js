require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const userRoutes = require('./Routes/UserRoutes');
const postRoutes = require('./Routes/PostRoutes');

// Initialize express app
const app = express();

// Cors
app.use(cors({origin: '*', credentials:true})); 
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Define routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

// Connect to the database and start the server
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Connected to DB & Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log('Database connection error:', error);
    });
