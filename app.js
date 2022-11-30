require("dotenv").config();

require("./db");

const express = require("express");

const hbs = require("hbs");

const app = express();
require("./config/session.config")(app);
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "redpanda-v3";

app.locals.appTitle = `${capitalize(projectName)} created with sadness`;

const indexRoutes = require("./routes/index.routes");

app.use("/", indexRoutes);

require("./error-handling")(app);

module.exports = app;
