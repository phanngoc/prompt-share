import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from app.db.init_db_script import main

if __name__ == "__main__":
    main() 