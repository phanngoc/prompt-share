# Prompt Share Backend

FastAPI backend for the Prompt Share marketplace.

## Project Structure

```
backend/
├── app/
│   ├── api/        # API routes
│   ├── core/       # Core configurations
│   ├── db/         # Database models and migrations
│   ├── models/     # SQLAlchemy models
│   ├── schemas/    # Pydantic schemas
│   ├── services/   # Business logic
│   └── utils/      # Utility functions
├── requirements.txt
└── README.md
```

## Setup

1. Create a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/prompt_share
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

4. Run the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000
API documentation will be available at http://localhost:8000/docs

## Development

- Use `black` for code formatting
- Use `isort` for import sorting
- Use `flake8` for linting
- Use `pytest` for testing

## API Endpoints

- `GET /`: Welcome message
- `GET /health`: Health check endpoint
- More endpoints coming soon...
