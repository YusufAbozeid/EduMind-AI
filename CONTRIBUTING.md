# Contributing to SHAGHOOF AI

First off, thank you for considering contributing to SHAGHOOF AI! 🎉

Every contribution helps make AI-powered education more accessible. This document provides guidelines to make the contribution process smooth for everyone.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)

---

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Python | 3.12+ |
| Node.js | 18+ |
| npm | 9+ |
| Git | 2.40+ |

### Fork & Clone

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/SHAGHOOF-AI.git
   cd SHAGHOOF-AI
   ```
3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/YusufAbozeid/SHAGHOOF-AI.git
   ```

---

## Development Setup

### Backend (FastAPI)

```bash
# Create a virtual environment
python -m venv .venv

# Activate it
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
cd backend
pip install -r requirements.txt
pip install sentence-transformers faiss-cpu langchain langchain-community langchain-groq

# Set up environment
cd ..
cp .env.example .env
# Edit .env with your API keys

# Run the server
cd backend
python server.py
```

The API server will start at `http://localhost:8000` with docs at `/docs`.

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The dev server will start at `http://localhost:5173` with hot reload.

### Running Tests

```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend type checking
cd frontend
npm run build
```

---

## Making Changes

### Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/description` | `feature/google-classroom-integration` |
| Bug Fix | `fix/description` | `fix/moodle-connection-timeout` |
| Docs | `docs/description` | `docs/api-endpoint-examples` |
| Refactor | `refactor/description` | `refactor/rag-pipeline-optimization` |

### Workflow

1. **Sync** with upstream:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make** your changes with clear, focused commits
4. **Test** your changes thoroughly
5. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open** a Pull Request

---

## Pull Request Process

1. **Fill out** the PR template completely
2. **Ensure** the build passes (`npm run build` for frontend, `pytest` for backend)
3. **Update** documentation if you're changing APIs or adding features
4. **Link** any related issues using `Closes #123` or `Fixes #123`
5. **Request** review from a maintainer

### PR Checklist

- [ ] Code follows the style guide
- [ ] Self-review completed
- [ ] Tests added/updated as needed
- [ ] Documentation updated
- [ ] No new warnings introduced
- [ ] Build passes successfully

---

## Style Guide

### Python (Backend)

- Follow **PEP 8** conventions
- Use **type hints** for function signatures
- Use **Pydantic models** for request/response schemas
- Write **docstrings** for public functions and classes

### TypeScript (Frontend)

- Use **functional components** with hooks
- Use **TypeScript interfaces** for component props
- Follow **consistent naming**: `PascalCase` for components, `camelCase` for functions
- Use **Zustand** for shared state (avoid prop drilling)

### Commits

Write clear, conventional commit messages:

```
feat: add Google Classroom integration
fix: resolve Moodle token refresh timeout
docs: update API endpoint documentation
refactor: optimize RAG chunking algorithm
test: add unit tests for PDF extraction
```

---

## 💡 Ideas for Contributions

- 🌍 **Internationalization** — Add multi-language support
- 📱 **Mobile UX** — Improve responsive design
- 🧪 **Testing** — Expand test coverage
- 📖 **Documentation** — Improve API docs and guides
- ♿ **Accessibility** — Enhance screen reader support
- 🎨 **Design** — UI/UX improvements and animations

---

Thank you for helping make education more accessible! 🚀
