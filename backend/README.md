# Disaster Management System - Backend API

## Features

- Magic Link Authentication: Passwordless login via email
- JWT Session Management: Secure 7-day sessions
- Organization Management: CRUD operations for entities Employee Management:
Role-based access (ADMIN/USER)
- PostgreSQL Database: Production-ready data storage

## Setup

### 1. Prerequisites

- Python 3.11+
- PostgreSQL 14+

### 3. Environment Configuration

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Install Dependencies

```bash
python3 -m venv venv
source venv/bin/activate
pip install -e .
```

### 5. Run Application

```bash
source venv/bin/activate

# Development mode (with auto-reload)
fastapi dev main.py

# Production mode (with 4 workers, no reload)
fastapi run main.py
```

## API Documentation

Once running, access:

- Swagger UI: <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>
- Health Check: <http://localhost:8000/health>
