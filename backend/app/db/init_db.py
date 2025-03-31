from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.db.seed import seed_database

def init_db() -> None:
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating initial data")
    init_db()
    print("Initial data created") 