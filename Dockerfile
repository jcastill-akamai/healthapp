# ── Stage 1: Build ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copy manifests first to leverage layer cache
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# ── Stage 2: Production Image ──────────────────────────────────
FROM node:20-alpine AS runtime

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app
COPY --from=builder --chown=appuser /app/node_modules ./node_modules
COPY --from=builder --chown=appuser /app/src ./src
COPY --from=builder --chown=appuser /app/public       ./public
COPY --from=builder --chown=appuser /app/package.json .

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/index.js"]
