const express = require('express');
require('dotenv').config();

const locationRouter = express.Router();

locationRouter.get('/', (req, res) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Google Maps API key is missing.' });
        }

        // 获取客户端的经纬度（如果前端发送了数据）
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and Longitude are required.' });
        }

        // 构建Google静态地图的URL
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=600x400&key=${apiKey}`;

        res.json({ mapUrl });
    } catch (error) {
        console.error('Error generating map URL:', error.message);
        res.status(500).json({ error: 'Failed to generate map URL.' });
    }
});

module.exports = locationRouter;
