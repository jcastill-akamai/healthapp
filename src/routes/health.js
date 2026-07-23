// src/routes/health.js
// Now reflects actual service state — if services are down, health reports degraded.
// This is what K8s readinessProbe and livenessProbe hit.
const router  = require("express").Router();
const config  = require("../config");
const { services } = require("../store");

const startTime = Date.now();

router.get("/health", (req, res) => {
  const downCount     = services.filter(s => s.status === "down").length;
  const degradedCount = services.filter(s => s.status === "degraded").length;
  const overall       = downCount >= 2 ? "degraded" : "ok";

  // Return 503 if too many services are down — K8s will stop sending traffic
  const httpStatus = overall === "degraded" ? 503 : 200;

  res.status(httpStatus).json({
    status:   overall,
    version:  config.version,
    env:      config.appEnv,
    uptime:   `${Math.floor((Date.now() - startTime) / 1000)}s`,
    checks: {
      database: "ok",
      cache:    "ok",
      services: { healthy: services.filter(s => s.status === "healthy").length,
                  degraded: degradedCount,
                  down: downCount },
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
