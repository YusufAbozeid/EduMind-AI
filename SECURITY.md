# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.0.x   | ✅ Active development |
| 1.x.x   | ❌ Legacy Streamlit module (not maintained) |

## Reporting a Vulnerability

We take the security of SHAGHOOF AI seriously. If you discover a security vulnerability, please follow responsible disclosure:

### 🔐 How to Report

1. **DO NOT** open a public GitHub issue for security vulnerabilities
2. **Email** the maintainer directly or use GitHub's private vulnerability reporting feature
3. **Include** as much detail as possible:
   - Type of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### ⏱️ Response Timeline

| Action | Timeline |
|--------|----------|
| Acknowledgment | Within 48 hours |
| Initial Assessment | Within 1 week |
| Fix & Release | Within 2 weeks for critical issues |

## Security Measures Implemented

### 🛡️ API Security
- **Rate Limiting** — SlowAPI with configurable per-minute request limits
- **CORS** — Scoped origin allowlist; no wildcard origins in production
- **Security Headers** — Custom middleware injecting protective HTTP headers

### 🔒 Input Validation
- **SSRF Protection** — URL validation preventing internal network access
- **Path Traversal Prevention** — Filename sanitization for all file operations
- **Input Sanitization** — Pydantic models for request validation

### 🗄️ Data Isolation
- **Per-User Vector Stores** — FAISS indices are isolated per user
- **Per-User Database Records** — SQLite queries scoped to authenticated user

### 🐳 Deployment Security
- **Non-root containers** — Docker containers run as non-privileged users
- **Health checks** — Automated container health monitoring
- **Environment variables** — Secrets never hardcoded in source code

## Best Practices for Deployment

1. **Always** use a strong, unique `SECRET_KEY` in production
2. **Never** commit `.env` files to version control
3. **Restrict** CORS origins to your actual domain in production
4. **Enable** HTTPS/TLS termination via reverse proxy
5. **Regularly** update dependencies to patch known vulnerabilities

---

Thank you for helping keep SHAGHOOF AI secure! 🔐
