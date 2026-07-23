// src/store.js
// Shared in-memory state. In a real app this would be a database.
// Lives here so both the services and health routes can read it.

const services = [
  { name: "api-gateway",   status: "healthy",  latency: 12,  replicas: "3/3" },
  { name: "auth-service",  status: "healthy",  latency: 8,   replicas: "2/2" },
  { name: "data-sync",     status: "degraded", latency: 342, replicas: "1/3" },
  { name: "redis-cache",   status: "healthy",  latency: 2,   replicas: "1/1" },
  { name: "mailer",        status: "down",     latency: null, replicas: "0/2" },
  { name: "job-scheduler", status: "healthy",  latency: 21,  replicas: "2/2" },
];

const DEFAULTS = JSON.parse(JSON.stringify(services)); // deep copy for restore

module.exports = { services, DEFAULTS };
