# SHAGHOOF AI - Production Enterprise Architecture Blueprint

## Executive Overview
**SHAGHOOF AI (شَغَفٌ يُثْمِرُ عِلْماً)** has been engineered from the ground up into a **production-ready, highly secure, enterprise-grade educational platform**. 

The platform leverages a **Clean Modular Architecture** separating UI concerns, API services, business logic, security middleware, and containerized deployment infrastructure.

---

## Architecture Diagram & Container Flow

```
                     ┌──────────────────────────────────────────────┐
                     │          Clients & Web Browsers              │
                     └──────────────────────┬───────────────────────┘
                                            │
                                 HTTPS (TLS Port 443/80)
                                            │
                     ┌──────────────────────▼───────────────────────┐
                     │    Nginx Reverse Proxy & Load Balancer       │
                     │  - Security Headers (CSP, HSTS, X-Frame)     │
                     │  - Gzip/Brotli Static Compression            │
                     │  - SPA Routing & Rate Limit Guard            │
                     └──────────────┬────────────────┬──────────────┘
                                    │                │
            / (Static Bundle)       │                │ /api/v1/ (API Requests)
                                    │                │
     ┌──────────────────────────────▼──┐          ┌──▼──────────────────────────────┐
     │  Frontend Container             │          │  Backend FastAPI Container      │
     │  - React 19 + TypeScript        │          │  - Python 3.11 Non-Root User   │
     │  - Zustand State Engine         │          │  - Modular Service/Router Layer │
     │  - ErrorBoundary Fault Tolerance│          │  - Slowapi Rate Limiting        │
     └─────────────────────────────────┘          └─────────────────────────────────┘
```

---

## Production Security Hardening Checklist

### 1. Backend Security Layer (`backend/app/core/`)
- **API Rate Limiting (`slowapi`)**: Enforces rate limits per client IP (e.g. `60 requests/minute`) on sensitive endpoints to prevent Denial-of-Service (DoS) attacks.
- **Security Headers Middleware**: Injects strict HTTP response headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy (CSP)`
- **Scoped CORS Security**: Strict origin validation (`settings.BACKEND_CORS_ORIGINS`) allowing only authorized domain origins.
- **Pydantic v2 Strict Validation**: Automatic request body sanitization preventing SQL/NoSQL injection and payload corruption.

### 2. Frontend Security & Fault Tolerance (`frontend/src/`)
- **Production API Client (`api.ts`)**: Decoupled HTTP service with environment fallback strategies (`VITE_API_URL`).
- **React ErrorBoundary (`ErrorBoundary.tsx`)**: High-availability UI wrapper catching unexpected runtime crashes and offering smooth user recovery without data loss.

### 3. Container & Infrastructure Security (`docker/`)
- **Non-Root Execution**: Backend Docker container runs under `appuser` (UID 1000) rather than root permissions.
- **Multi-Stage Builds**: Minimal production image footprint stripping out build tools and compiler artifacts.
- **Healthcheck Probes**: Automated Docker healthcheck probes (`/health`) monitoring container readiness and failovers.

---

## One-Command Production Deployment

To spin up the entire production stack (Nginx + Frontend + FastAPI Backend) locally or on a cloud instance (AWS EC2, DigitalOcean, Azure):

```bash
# 1. Clone & Navigate to workspace root
git clone https://github.com/YusufAbozeid/EduMind-AI.git
cd route_grad_project

# 2. Launch production stack with Docker Compose
docker-compose up -d --build

# 3. Verify status & logs
docker-compose ps
docker-compose logs -f
```

---

## API Endpoints Reference

| Method | Endpoint | Description | Auth & Security |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Application healthcheck & container probe | Public |
| `POST` | `/api/v1/chat/tutor` | AI Tutor endpoint (Feynman levels & Egyptian dialect) | Rate Limited (60/min) |
| `POST` | `/api/v1/assess/two-pass` | Two-Pass assessment grading endpoint | Rate Limited (60/min) |
