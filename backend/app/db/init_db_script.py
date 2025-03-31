import logging
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(backend_dir))

from sqlalchemy.orm import Session
from app.db.base import engine
from app.db.init_db import init_db
from app.db.base import Base

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init() -> None:
    logger.info("Creating initial database tables")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")

def main() -> None:
    logger.info("Creating initial data")
    db = Session(engine)
    init_db(db)
    logger.info("Initial data created")

if __name__ == "__main__":
    logger.info("Starting database initialization")
    init()
    main()
    logger.info("Database initialization completed") 