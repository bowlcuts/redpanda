require("dotenv").config();

require("./db");

const express = require("express");

const hbs = require("hbs");

const app = express();
require("./config/session.config")(app);
require("./config")(app);

const indexRoutes = require("./routes/index.routes");
const reviewRoutes = require("./routes/review");

app.use("/", indexRoutes);
app.use("/video-player", reviewRoutes);


require("./error-handling")(app);

module.exports = app;

