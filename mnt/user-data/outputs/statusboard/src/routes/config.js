// src/routes/config.js
// Exposes non-sensitive config for the dashboard UI.
// Secrets (DB_PASSWORD etc.) are never returned here.

const router = require("express").Router();
const config = require("../config");

router.get("/api/config", (req, res) => {
  res.json({
    APP_ENV:   config.appEnv,
    LOG_LEVEL: config.logLevel,
    DB_HOST:   config.dbHost,
    DB_PORT:   config.dbPort,
    VERSION:   config.version,
    PORT:      String(config.port),
  });
});

module.exports = router;
