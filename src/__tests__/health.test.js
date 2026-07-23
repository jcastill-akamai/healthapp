// src/__tests__/health.test.js
const request = require("supertest");
const app     = require("../index");

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("includes version and env", async () => {
    const res = await request(app).get("/health");
    expect(res.body.version).toBeDefined();
    expect(res.body.env).toBeDefined();
  });

  it("includes uptime as a string", async () => {
    const res = await request(app).get("/health");
    expect(typeof res.body.uptime).toBe("string");
    expect(res.body.uptime).toMatch(/\ds$/);
  });

  it("reports database and cache checks", async () => {
    const res = await request(app).get("/health");
    expect(res.body.checks.database).toBe("ok");
    expect(res.body.checks.cache).toBe("ok");
  });
});

describe("GET /api/services", () => {
  it("returns an array of services", async () => {
    const res = await request(app).get("/api/services");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("each service has name, status, and replicas", async () => {
    const res = await request(app).get("/api/services");
    res.body.forEach(svc => {
      expect(svc.name).toBeDefined();
      expect(["healthy", "degraded", "down"]).toContain(svc.status);
      expect(svc.replicas).toBeDefined();
    });
  });
});

describe("GET /api/config", () => {
  it("returns non-sensitive config keys", async () => {
    const res = await request(app).get("/api/config");
    expect(res.statusCode).toBe(200);
    expect(res.body.APP_ENV).toBeDefined();
    expect(res.body.VERSION).toBeDefined();
  });

  it("does not expose secrets", async () => {
    const res = await request(app).get("/api/config");
    expect(res.body.DB_PASSWORD).toBeUndefined();
    expect(res.body.JWT_SECRET).toBeUndefined();
  });
});
