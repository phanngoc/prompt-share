# Prompt Share - AI Prompt Marketplace

A modern marketplace for AI prompts built with Next.js and FastAPI.

## Project Structure

```
prompt-share/
├── frontend/          # Next.js frontend application
└── backend/          # FastAPI backend application
```

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Query
- Zustand (State Management)

### Backend
- FastAPI
- Python 3.11+
- SQLAlchemy
- Pydantic
- PostgreSQL
- Alembic (Migrations)

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Development

- Frontend runs on http://localhost:3000
- Backend runs on http://localhost:8000
- API documentation available at http://localhost:8000/docs

## Features

- User authentication and authorization
- Prompt marketplace
- Search and filtering
- User profiles
- Payment integration
- AI prompt validation and testing
- Responsive design
