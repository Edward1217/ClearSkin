require("dotenv").config();
const config = require("./utils/config");
const logger = require("./utils/logger");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose").set("strictQuery", true);
const middleware = require("./utils/middleware");
const bodyParser = require("body-parser");
const usersRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
const locationRouter = require('./controllers/location');
mongoose.set("strictQuery",false);

logger.info("connecting to", config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info("connected to MongoDB");
    })
    .catch((error) => {
        logger.error("error connecting to MongoDB:",error.message);
    });

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(middleware.requestLogger);

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use('/api/location', locationRouter);

app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;



