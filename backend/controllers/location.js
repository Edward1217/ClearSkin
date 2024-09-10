const express = require('express');
const axios = require('axios');
require('dotenv').config();

const locationRouter = express.Router();

locationRouter.get('/', async (req, res) => {
    const { latitude, longitude } = req.query;

    try {
        const apiKey = process.env.ABSTRACT_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key is missing from server configuration.' });
        }

        const response = await axios.get('https://ipgeolocation.abstractapi.com/v1/', {
            params: {
                api_key: apiKey,
                latitude: latitude,
                longitude: longitude
            }
        });

        res.json({ city: response.data.city });  // Only return the city name
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch geolocation data.' });
    }
});

module.exports = locationRouter;
