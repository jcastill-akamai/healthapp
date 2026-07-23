// src/index.js
const express = require("express");
const path    = require("path");
const config  = require("./config");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use(require("./routes/health"));
app.use(require("./routes/services"));
app.use(require("./routes/config"));

// Only start the server when run directly (not during tests)
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`[${config.appEnv}] StatusBoard v${config.version} listening on :${config.port}`);
    console.log(`LOG_LEVEL=${config.logLevel}  DB=${config.dbHost}:${config.dbPort}`);
  });
}

module.exports = app; // exported for supertest
