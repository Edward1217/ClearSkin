const weatherRouter = require('express').Router();
const axios = require('axios');
require('dotenv').config();

// Weather route to fetch weather data
weatherRouter.get('/', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required (e.g., city name, IP, etc.)' });
    }

    try {
        const apiKey = process.env.WEATHER_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key is missing from server configuration.' });
        }


        const searchUrl = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`;
        const searchResponse = await axios.get(searchUrl);

        if (searchResponse.data.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }

        // 获取第一个匹配的地点（通常是最符合条件的）
        const location = searchResponse.data[0];
        const cityName = location.name;

        // 调用 WeatherAPI 获取该城市的天气数据
        const weatherUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}&aqi=no`;
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data.current;

        // 返回天气信息，包括 condition.icon 和温度
        res.status(200).json({
            location: cityName,
            uv: weatherData.uv,
            condition: weatherData.condition.text,
            icon: weatherData.condition.icon,
            temp_c: weatherData.temp_c
        });
    } catch (error) {
        console.error('Error fetching weather data:', error.message || error.response.data);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

module.exports = weatherRouter;
