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



app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;



