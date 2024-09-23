const express = require('express');
const axios = require('axios');
require('dotenv').config();

const locationRouter = express.Router();

locationRouter.get('/', async (req, res) => {
    try {
        const apiKey = process.env.ABSTRACT_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key is missing from server configuration.' });
        }

        const response = await axios.get('https://ipgeolocation.abstractapi.com/v1/', {
            params: {
                api_key: apiKey,
            }
        });

        console.log("Geolocation API response:", response.data);  // 输出完整的 API 响应

        if (!response.data.city) {
            return res.status(500).json({ error: 'City not found in geolocation data.' });
        }

        res.json({ city: response.data.city });
    } catch (error) {
        console.error('Error fetching geolocation data:', error.message);
        res.status(500).json({ error: 'Failed to fetch geolocation data.' });
    }
});


module.exports = locationRouter;
