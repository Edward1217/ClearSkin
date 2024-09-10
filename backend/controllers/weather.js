const axios = require("axios");
const weatherRouter = require("express").Router();
const jwt = require("jsonwebtoken");

weatherRouter.get("/", async (req, res) => {
    const authorization = req.get("authorization");
    let token = null;
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        token = authorization.substring(7);
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET);
    } catch (error) {
        return res.status(401).json({ error: "invalid token" });
    }

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: "token missing or invalid" });
    }

    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Missing latitude or longitude" });
    }

    try {
        const weatherApiKey = process.env.WEATHER_API_KEY;
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`;

        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;

        res.status(200).json({
            location: weatherData.name,
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            uvIndex: weatherData.current ? weatherData.current.uvi : "No UV data",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

module.exports = weatherRouter;
