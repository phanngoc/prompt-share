import sys
from pathlib import Path
import subprocess

# Add the backend directory to the Python path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

def run_migrations():
    """Run database migrations using Alembic."""
    try:
        # Create initial migration
        subprocess.run(["alembic", "revision", "--autogenerate", "-m", "initial migration"], check=True)
        print("Created initial migration")
        
        # Apply migrations
        subprocess.run(["alembic", "upgrade", "head"], check=True)
        print("Applied migrations successfully")
        
    except subprocess.CalledProcessError as e:
        print(f"Error running migrations: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_migrations() 