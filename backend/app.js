require("dotenv").config();
const config = require("./utils/config");
const logger = require("./utils/logger");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose").set("strictQuery", true);
const middleware = require("./utils/middleware");
const authMiddleware = require('./utils/authMiddleware'); // JWT middleware
const usersRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
const locationRouter = require("./controllers/location");
const weatherRouter = require("./controllers/weather");
const imageRouter = require("./controllers/image");
const caseRouter = require('./controllers/caseController');

app.use(express.static('dist'))

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info("connected to MongoDB");
    })
    .catch((error) => {
        logger.error("error connecting to MongoDB:", error.message);
    });

app.use(cors());
app.use(express.json());  // `express.json()` already handles body parsing, so no need for `bodyParser`

// Logger middleware
app.use(middleware.requestLogger);

// Unprotected routes (no JWT required)
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use('/api/location', locationRouter); // No JWT required
app.use('/api/weather', weatherRouter);   // No JWT required


// Protected routes (JWT authentication required)
app.use('/api/image', authMiddleware, imageRouter); // Apply authMiddleware for /api/image
app.use('/api/cases', authMiddleware, caseRouter);

// Handle unknown endpoints and errors
app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;
