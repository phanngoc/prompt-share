nvm use default

cd backend && uvicorn app.main:app --reload
cd frontend && npm run dev

# Run seeding script
# cd /home/phan.ngoc/Documents/projects/prompt-share/backend && python -c "from app.db.session import SessionLocal; from app.db.seed import seed_database; seed_database(SessionLocal())"