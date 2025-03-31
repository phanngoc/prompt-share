from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.models.category import Category
from app.models.prompt import Prompt
from app.core.security import get_password_hash
import random
from datetime import datetime, timedelta

def seed_database(db: Session):
    # Create categories if they don't exist
    categories = [
        Category(name="Content Writing", description="Writing prompts for various purposes", slug="content-writing"),
        Category(name="Coding", description="Programming and coding prompts", slug="coding"),
        Category(name="Design", description="Design and creative prompts", slug="design"),
        Category(name="Business", description="Business and marketing prompts", slug="business"),
        Category(name="Education", description="Educational and learning prompts", slug="education"),
    ]
    
    for category in categories:
        if not db.query(Category).filter(Category.name == category.name).first():
            db.add(category)
    
    db.commit()
    
    # Create admin user if doesn't exist
    admin = User(
        email="admin@example.com",
        username="admin",
        hashed_password=get_password_hash("admin123"),
        full_name="Admin User",
        role=UserRole.ADMIN,
        is_active=True,
        is_verified=True
    )
    
    if not db.query(User).filter(User.email == admin.email).first():
        db.add(admin)
    
    # Create seller users if they don't exist
    sellers = [
        User(
            email="seller1@example.com",
            username="seller1",
            hashed_password=get_password_hash("password123"),
            full_name="John Doe",
            role=UserRole.SELLER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="seller2@example.com",
            username="seller2",
            hashed_password=get_password_hash("password123"),
            full_name="Jane Smith",
            role=UserRole.SELLER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="seller3@example.com",
            username="seller3",
            hashed_password=get_password_hash("password123"),
            full_name="Mike Johnson",
            role=UserRole.SELLER,
            is_active=True,
            is_verified=True
        ),
    ]
    
    for seller in sellers:
        if not db.query(User).filter(User.email == seller.email).first():
            db.add(seller)
    
    # Create regular users if they don't exist
    regular_users = [
        User(
            email="user1@example.com",
            username="user1",
            hashed_password=get_password_hash("password123"),
            full_name="Alice Brown",
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="user2@example.com",
            username="user2",
            hashed_password=get_password_hash("password123"),
            full_name="Bob Wilson",
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="user3@example.com",
            username="user3",
            hashed_password=get_password_hash("password123"),
            full_name="Carol Davis",
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        ),
    ]
    
    for user in regular_users:
        if not db.query(User).filter(User.email == user.email).first():
            db.add(user)
    
    db.commit()
    
    # Get all categories and sellers
    categories = db.query(Category).all()
    sellers = db.query(User).filter(User.role == UserRole.SELLER).all()
    
    # Sample prompt titles and descriptions
    prompt_templates = [
        {
            "title": "Professional {type} {topic}",
            "description": "A comprehensive prompt for creating professional {type} content about {topic}. Perfect for {use_case}.",
            "content": "Create a professional {type} about {topic}. Focus on {focus_points}. Include {elements}.",
            "price_range": (9.99, 29.99)
        },
        {
            "title": "Creative {type} {topic}",
            "description": "An innovative prompt for generating creative {type} content focused on {topic}. Ideal for {use_case}.",
            "content": "Design a creative {type} about {topic}. Emphasize {focus_points}. Incorporate {elements}.",
            "price_range": (14.99, 39.99)
        },
        {
            "title": "Advanced {type} {topic}",
            "description": "An advanced-level prompt for creating sophisticated {type} content about {topic}. Best for {use_case}.",
            "content": "Develop an advanced {type} about {topic}. Highlight {focus_points}. Include {elements}.",
            "price_range": (19.99, 49.99)
        }
    ]
    
    topics = {
        "Content Writing": ["Blog Posts", "Articles", "Social Media", "Email Marketing", "Product Descriptions"],
        "Coding": ["Python Scripts", "Web Applications", "API Integration", "Database Queries", "Testing"],
        "Design": ["UI/UX", "Brand Identity", "Social Media Graphics", "Website Layout", "Mobile Apps"],
        "Business": ["Business Plans", "Marketing Strategies", "Sales Pitches", "Customer Service", "Analytics"],
        "Education": ["Lesson Plans", "Study Guides", "Quiz Questions", "Course Content", "Learning Materials"]
    }
    
    use_cases = {
        "Content Writing": ["content creators", "marketers", "business owners", "bloggers", "copywriters"],
        "Coding": ["developers", "programmers", "software engineers", "web developers", "data scientists"],
        "Design": ["designers", "artists", "brand managers", "marketers", "UI/UX professionals"],
        "Business": ["entrepreneurs", "business owners", "marketers", "sales professionals", "consultants"],
        "Education": ["teachers", "educators", "tutors", "students", "course creators"]
    }
    
    focus_points = {
        "Content Writing": ["clarity", "engagement", "SEO optimization", "brand voice", "call-to-action"],
        "Coding": ["efficiency", "best practices", "security", "scalability", "maintainability"],
        "Design": ["user experience", "visual appeal", "brand consistency", "accessibility", "modern trends"],
        "Business": ["market analysis", "customer needs", "competitive advantage", "growth strategy", "ROI"],
        "Education": ["learning objectives", "student engagement", "assessment methods", "differentiation", "progress tracking"]
    }
    
    elements = {
        "Content Writing": ["headlines", "subheadings", "bullet points", "examples", "conclusions"],
        "Coding": ["error handling", "documentation", "comments", "tests", "optimization"],
        "Design": ["color schemes", "typography", "layout", "icons", "animations"],
        "Business": ["metrics", "strategies", "timelines", "resources", "risks"],
        "Education": ["objectives", "activities", "materials", "assessment", "feedback"]
    }
    
    # Generate 30 prompts
    for i in range(30):
        category = random.choice(categories)
        seller = random.choice(sellers)
        template = random.choice(prompt_templates)
        
        # Skip if category not in our predefined dictionaries
        if category.name not in topics:
            continue
            
        topic = random.choice(topics[category.name])
        use_case = random.choice(use_cases[category.name])
        focus = random.choice(focus_points[category.name])
        element = random.choice(elements[category.name])
        
        prompt_type = {
            "Content Writing": "content",
            "Coding": "code",
            "Design": "design",
            "Business": "plan",
            "Education": "material"
        }.get(category.name, "content")  # Default to "content" if category not found
        
        title = template["title"].format(type=prompt_type, topic=topic)
        description = template["description"].format(
            type=prompt_type,
            topic=topic,
            use_case=use_case
        )
        content = template["content"].format(
            type=prompt_type,
            topic=topic,
            focus_points=focus,
            elements=element
        )
        
        price = round(random.uniform(*template["price_range"]), 2)
        is_featured = random.random() < 0.2  # 20% chance of being featured
        rating = round(random.uniform(3.5, 5.0), 1)
        views_count = random.randint(100, 1000)
        sales_count = random.randint(10, 100)
        
        # Random creation date within last 30 days
        created_at = datetime.utcnow() - timedelta(days=random.randint(0, 30))
        
        prompt = Prompt(
            title=title,
            description=description,
            content=content,
            price=price,
            is_active=True,
            is_featured=is_featured,
            views_count=views_count,
            sales_count=sales_count,
            rating=rating,
            seller_id=seller.id,
            category_id=category.id,
            created_at=created_at
        )
        
        db.add(prompt)
    
    db.commit() 