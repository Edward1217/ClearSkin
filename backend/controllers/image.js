const express = require('express');
const Image = require('../models/image');
const authMiddleware = require('../utils/authMiddleware');  // Middleware for authentication
const router = express.Router();

router.post('/',async (req, res) => {
    const { imageUrl } = req.body;  // Only get the imageUrl from the request body

    console.log('Received imageUrl:', imageUrl);
    console.log('Authenticated user:', req.user);  // Ensure req.user is populated from JWT

    if (!imageUrl) {
        return res.status(400).json({ error: 'Image URL is required' });
    }

    try {
        // Create a new Image instance using user from req.user (extracted from JWT)
        const newImage = new Image({
            imageUrl,   // The image URL as a string
            user: req.user.id,  // Use req.user.id extracted from the JWT token
        });

        await newImage.save();  // Save to database
        console.log('Image URL saved to the database');

        res.status(201).json({ message: 'Image URL saved successfully!' });
    } catch (error) {
        console.error('Error saving image URL:', error);
        res.status(500).json({ error: 'Server error while saving image URL' });
    }
});

module.exports = router;
