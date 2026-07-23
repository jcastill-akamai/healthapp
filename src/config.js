// src/config.js
// All config from environment variables.
// In Kubernetes these are injected by statusboard-config (ConfigMap).

module.exports = {
  port:     parseInt(process.env.PORT     || "3000"),
  version:  process.env.VERSION  || "1.0.0",
  appEnv:   process.env.APP_ENV  || "development",
  logLevel: process.env.LOG_LEVEL || "info",
  dbHost:   process.env.DB_HOST  || "localhost",
  dbPort:   process.env.DB_PORT  || "5432",
};
