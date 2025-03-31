import logging
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.models.category import Category
from app.core.security import get_password_hash

logger = logging.getLogger(__name__)

def init_db(db: Session) -> None:
    try:
        # Create initial admin user
        admin = db.query(User).filter(User.email == "admin@promptshare.com").first()
        if not admin:
            admin = User(
                email="admin@promptshare.com",
                username="admin",
                hashed_password=get_password_hash("admin123"),
                full_name="System Administrator",
                role=UserRole.ADMIN,
                is_active=True,
                is_verified=True,
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            logger.info("Created admin user")

        # Create initial categories
        categories = [
            {
                "name": "Content Writing",
                "description": "Prompts for writing articles, blog posts, and content",
                "slug": "content-writing",
            },
            {
                "name": "Programming",
                "description": "Prompts for coding, debugging, and technical tasks",
                "slug": "programming",
            },
            {
                "name": "Marketing",
                "description": "Prompts for marketing, advertising, and social media",
                "slug": "marketing",
            },
            {
                "name": "Research",
                "description": "Prompts for academic research and analysis",
                "slug": "research",
            },
            {
                "name": "Business",
                "description": "Prompts for business analysis and decision making",
                "slug": "business",
            },
        ]

        for category_data in categories:
            category = db.query(Category).filter(Category.name == category_data["name"]).first()
            if not category:
                category = Category(**category_data)
                db.add(category)
                db.commit()
                db.refresh(category)
                logger.info(f"Created category: {category.name}")

    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        db.rollback()
        raise 