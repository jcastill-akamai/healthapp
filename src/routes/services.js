// src/routes/services.js
const router = require("express").Router();
const { services, DEFAULTS } = require("../store");

// GET — return current service list
router.get("/api/services", (req, res) => {
  res.json(services);
});

// POST /api/services/:name/status — toggle a single service
router.post("/api/services/:name/status", (req, res) => {
  const svc = services.find(s => s.name === req.params.name);
  if (!svc) return res.status(404).json({ error: "service not found" });

  const { status } = req.body;
  if (!["healthy", "degraded", "down"].includes(status)) {
    return res.status(400).json({ error: "invalid status" });
  }

  svc.status  = status;
  svc.latency = status === "down"     ? null
              : status === "degraded" ? 300 + Math.round(Math.random() * 200)
              : Math.round(5 + Math.random() * 30);

  res.json(svc);
});

// POST /api/incident — take multiple services down at once
router.post("/api/incident", (req, res) => {
  const targets = ["api-gateway", "auth-service", "data-sync"];
  targets.forEach(name => {
    const svc = services.find(s => s.name === name);
    if (svc) { svc.status = "down"; svc.latency = null; }
  });
  res.json({ message: "incident triggered", affected: targets });
});

// POST /api/restore — bring everything back to defaults
router.post("/api/restore", (req, res) => {
  services.forEach((svc, i) => {
    svc.status  = DEFAULTS[i].status;
    svc.latency = DEFAULTS[i].latency;
  });
  res.json({ message: "all services restored" });
});

module.exports = router;
