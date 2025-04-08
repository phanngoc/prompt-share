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
        Category(name="Creative Writing", description="Fiction, stories, and creative content", slug="creative-writing"),
        Category(name="Marketing", description="Marketing, advertising, and sales prompts", slug="marketing"),
        Category(name="Personal Growth", description="Self-improvement and development prompts", slug="personal-growth"),
        Category(name="Technology", description="Tech-related prompts for various applications", slug="technology"),
        Category(name="Art", description="Digital art and artistic content creation", slug="art"),
        Category(name="Science", description="Scientific explanations and research", slug="science"),
        Category(name="Health", description="Health, wellness, and medical content", slug="health"),
        Category(name="Lifestyle", description="Daily life and lifestyle content", slug="lifestyle"),
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
    
    # Extended list of seller users
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
        User(
            email="promptmaster@example.com",
            username="promptmaster",
            hashed_password=get_password_hash("password123"),
            full_name="Alex Turner",
            role=UserRole.SELLER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="aiexpert@example.com",
            username="aiexpert",
            hashed_password=get_password_hash("password123"),
            full_name="Sarah Lee",
            role=UserRole.SELLER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="wordsmith@example.com",
            username="wordsmith",
            hashed_password=get_password_hash("password123"),
            full_name="David Chen",
            role=UserRole.SELLER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="creativegenius@example.com",
            username="creativegenius",
            hashed_password=get_password_hash("password123"),
            full_name="Emily Rodriguez",
            role=UserRole.SELLER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="techguru@example.com",
            username="techguru",
            hashed_password=get_password_hash("password123"),
            full_name="James Wilson",
            role=UserRole.SELLER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="contentcreator@example.com",
            username="contentcreator",
            hashed_password=get_password_hash("password123"),
            full_name="Sophia Patel",
            role=UserRole.SELLER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="businesspro@example.com",
            username="businesspro",
            hashed_password=get_password_hash("password123"),
            full_name="Michael Brown",
            role=UserRole.SELLER,
            is_active=True,
            is_verified=True
        ),
    ]
    
    for seller in sellers:
        if not db.query(User).filter(User.email == seller.email).first():
            db.add(seller)
    
    # Extended list of regular users
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
        User(
            email="maria@example.com",
            username="maria",
            hashed_password=get_password_hash("password123"),
            full_name="Maria Garcia",
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="steven@example.com",
            username="steven",
            hashed_password=get_password_hash("password123"),
            full_name="Steven Taylor",
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="lisa@example.com",
            username="lisa",
            hashed_password=get_password_hash("password123"),
            full_name="Lisa Wong",
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="thomas@example.com",
            username="thomas",
            hashed_password=get_password_hash("password123"),
            full_name="Thomas Martinez",
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="jennifer@example.com",
            username="jennifer",
            hashed_password=get_password_hash("password123"),
            full_name="Jennifer Moore",
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="daniel@example.com",
            username="daniel",
            hashed_password=get_password_hash("password123"),
            full_name="Daniel Lewis",
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="rebecca@example.com",
            username="rebecca",
            hashed_password=get_password_hash("password123"),
            full_name="Rebecca Jackson",
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="kevin@example.com",
            username="kevin",
            hashed_password=get_password_hash("password123"),
            full_name="Kevin White",
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="nicole@example.com",
            username="nicole",
            hashed_password=get_password_hash("password123"),
            full_name="Nicole Clark",
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="ryan@example.com",
            username="ryan",
            hashed_password=get_password_hash("password123"),
            full_name="Ryan Scott",
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="amanda@example.com",
            username="amanda",
            hashed_password=get_password_hash("password123"),
            full_name="Amanda Lee",
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        ),
        User(
            email="gregory@example.com",
            username="gregory",
            hashed_password=get_password_hash("password123"),
            full_name="Gregory Adams",
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
        },
        {
            "title": "Ultimate {topic} {type} Generator",
            "description": "The most comprehensive prompt for {topic} {type} generation. Creates outstanding results for {use_case}.",
            "content": "Generate an exceptional {type} for {topic}. Pay special attention to {focus_points} and include detailed {elements}.",
            "price_range": (24.99, 59.99)
        },
        {
            "title": "Quick {topic} {type} Creator",
            "description": "Fast and efficient prompt for creating high-quality {topic} {type} content in minutes. Great for busy {use_case}.",
            "content": "Create a concise but powerful {type} about {topic}. Optimize for {focus_points} and include essential {elements}.",
            "price_range": (7.99, 19.99)
        },
        {
            "title": "{topic} {type} Framework",
            "description": "A structured framework for consistent {topic} {type} creation. Essential for {use_case} who need reliable results.",
            "content": "Follow this systematic approach to create {type} content about {topic}: 1. Start with {focus_points}. 2. Build with {elements}.",
            "price_range": (12.99, 34.99)
        }
    ]
    
    # Enhanced topics dictionary with more categories
    topics = {
        "Content Writing": ["Blog Posts", "Articles", "Social Media", "Email Marketing", "Product Descriptions", "Website Copy", "Case Studies", "White Papers", "Newsletters"],
        "Coding": ["Python Scripts", "Web Applications", "API Integration", "Database Queries", "Testing", "JavaScript Functions", "Machine Learning Models", "Mobile Apps", "Data Analysis"],
        "Design": ["UI/UX", "Brand Identity", "Social Media Graphics", "Website Layout", "Mobile Apps", "Logos", "Icon Sets", "Illustrations", "Animations"],
        "Business": ["Business Plans", "Marketing Strategies", "Sales Pitches", "Customer Service", "Analytics", "SWOT Analysis", "Project Management", "Competitor Research", "Growth Strategy"],
        "Education": ["Lesson Plans", "Study Guides", "Quiz Questions", "Course Content", "Learning Materials", "Student Assessments", "Interactive Activities", "Educational Games", "Lecture Notes"],
        "Creative Writing": ["Short Stories", "Poetry", "Character Development", "Plot Outlines", "Dialogue Scripts", "World Building", "Fantasy Settings", "Science Fiction Concepts", "Narrative Arcs"],
        "Marketing": ["Ad Copy", "Landing Pages", "Email Campaigns", "Social Media Strategy", "Content Calendars", "SEO Content", "Analytics Reports", "Brand Voice Guides", "Customer Personas"],
        "Personal Growth": ["Goal Setting", "Habit Formation", "Productivity Systems", "Mindfulness Exercises", "Self-Reflection Questions", "Career Development", "Personal Finance", "Decision Making", "Time Management"],
        "Technology": ["Tech Tutorials", "Product Reviews", "Troubleshooting Guides", "Setup Instructions", "Comparison Charts", "Tech News", "Digital Trends", "Security Best Practices", "Smart Home Automation"],
        "Art": ["Digital Painting", "Character Design", "Landscape Compositions", "Abstract Concepts", "Color Palettes", "Digital Effects", "Mixed Media", "Stylized Portraits", "Artistic Themes"],
        "Science": ["Scientific Explanations", "Research Summaries", "Lab Reports", "Data Visualization", "Literature Reviews", "Methodology Descriptions", "Experimental Designs", "Scientific Presentations", "Research Questions"],
        "Health": ["Wellness Plans", "Nutrition Guides", "Fitness Routines", "Mental Health Resources", "Medical Explanations", "Healthcare Analyses", "Symptom Descriptions", "Treatment Options", "Health Recommendations"],
        "Lifestyle": ["Travel Guides", "Recipe Collections", "Home Decoration", "Fashion Advice", "Event Planning", "Daily Routines", "Product Reviews", "Seasonal Activities", "Hobby Instructions"]
    }
    
    # Enhanced use cases
    use_cases = {
        "Content Writing": ["content creators", "marketers", "business owners", "bloggers", "copywriters", "journalists", "editors", "publishers", "content strategists"],
        "Coding": ["developers", "programmers", "software engineers", "web developers", "data scientists", "QA testers", "DevOps engineers", "system architects", "CTOs"],
        "Design": ["designers", "artists", "brand managers", "marketers", "UI/UX professionals", "creative directors", "art directors", "product managers", "web developers"],
        "Business": ["entrepreneurs", "business owners", "marketers", "sales professionals", "consultants", "project managers", "executives", "team leaders", "business analysts"],
        "Education": ["teachers", "educators", "tutors", "students", "course creators", "academic administrators", "curriculum developers", "trainers", "education technologists"],
        "Creative Writing": ["authors", "screenwriters", "content creators", "game developers", "creative directors", "novelists", "poets", "playwrights", "narrative designers"],
        "Marketing": ["marketers", "digital strategists", "brand managers", "copywriters", "social media managers", "SEO specialists", "PPC experts", "market researchers", "CMOs"],
        "Personal Growth": ["coaches", "mentors", "self-improvement enthusiasts", "therapists", "HR professionals", "team leaders", "students", "professionals", "individuals"],
        "Technology": ["tech enthusiasts", "IT professionals", "product managers", "tech writers", "digital consultants", "tech support", "system administrators", "end users", "researchers"],
        "Art": ["digital artists", "illustrators", "designers", "art directors", "creative professionals", "game artists", "art enthusiasts", "media creators", "students"],
        "Science": ["scientists", "researchers", "educators", "students", "journalists", "science communicators", "analysts", "medical professionals", "engineers"],
        "Health": ["healthcare providers", "wellness coaches", "nutritionists", "fitness trainers", "health writers", "patients", "healthcare administrators", "medical educators", "researchers"],
        "Lifestyle": ["bloggers", "influencers", "content creators", "magazine writers", "social media managers", "lifestyle coaches", "travel writers", "chefs", "home designers"]
    }
    
    # Enhanced focus points
    focus_points = {
        "Content Writing": ["clarity", "engagement", "SEO optimization", "brand voice", "call-to-action", "readability", "audience targeting", "value proposition", "storytelling"],
        "Coding": ["efficiency", "best practices", "security", "scalability", "maintainability", "performance optimization", "clean code", "documentation", "error handling"],
        "Design": ["user experience", "visual appeal", "brand consistency", "accessibility", "modern trends", "color psychology", "information hierarchy", "responsive design", "interactive elements"],
        "Business": ["market analysis", "customer needs", "competitive advantage", "growth strategy", "ROI", "operational efficiency", "financial projections", "risk management", "sustainability"],
        "Education": ["learning objectives", "student engagement", "assessment methods", "differentiation", "progress tracking", "knowledge retention", "critical thinking", "practical application", "feedback systems"],
        "Creative Writing": ["character development", "plot structure", "pacing", "dialogue", "world-building", "narrative voice", "themes", "emotional impact", "reader engagement"],
        "Marketing": ["customer psychology", "conversion optimization", "brand positioning", "value proposition", "A/B testing", "campaign integration", "user journey", "ROI tracking", "audience segmentation"],
        "Personal Growth": ["behavioral psychology", "goal setting", "habit formation", "accountability", "reflection", "motivation techniques", "mindfulness", "resilience building", "skill development"],
        "Technology": ["user needs", "technical accuracy", "simplicity", "problem-solving", "innovation", "compatibility", "future-proofing", "security", "optimization"],
        "Art": ["composition", "color theory", "lighting", "texture", "perspective", "mood", "symbolism", "technique", "style consistency"],
        "Science": ["factual accuracy", "methodology", "data interpretation", "critical analysis", "latest research", "scientific principles", "clarity", "sourcing", "implications"],
        "Health": ["evidence-based information", "actionable advice", "holistic approach", "safety considerations", "individual differences", "sustainable habits", "preventive measures", "expert insights", "accessibility"],
        "Lifestyle": ["practicality", "aesthetics", "audience relevance", "seasonal factors", "budget considerations", "inspiration", "step-by-step guidance", "visual appeal", "personal touch"]
    }
    
    # Enhanced elements
    elements = {
        "Content Writing": ["headlines", "subheadings", "bullet points", "examples", "conclusions", "statistics", "testimonials", "stories", "visuals"],
        "Coding": ["error handling", "documentation", "comments", "tests", "optimization", "modularity", "version control", "dependencies", "user interface"],
        "Design": ["color schemes", "typography", "layout", "icons", "animations", "white space", "contrast", "imagery", "navigation"],
        "Business": ["metrics", "strategies", "timelines", "resources", "risks", "competitor analysis", "market trends", "user personas", "cost-benefit analysis"],
        "Education": ["objectives", "activities", "materials", "assessment", "feedback", "differentiation strategies", "multimedia resources", "group work", "reflective questions"],
        "Creative Writing": ["character arcs", "settings", "plot twists", "sensory details", "metaphors", "narrative structure", "conflict", "resolution", "themes"],
        "Marketing": ["headlines", "value propositions", "social proof", "CTAs", "customer journey", "metrics", "audience targeting", "brand voice", "visual assets"],
        "Personal Growth": ["actionable steps", "reflection prompts", "tracking methods", "success metrics", "habit triggers", "accountability systems", "rewards", "challenges", "visualization exercises"],
        "Technology": ["step-by-step instructions", "troubleshooting tips", "visuals", "specifications", "alternatives", "use cases", "limitations", "integrations", "best practices"],
        "Art": ["primary elements", "secondary elements", "focal points", "background details", "style references", "color palettes", "texture variations", "lighting effects", "compositional balance"],
        "Science": ["methodology", "data visualization", "literature citations", "key findings", "limitations", "future research", "practical applications", "definitions", "historical context"],
        "Health": ["evidence-based recommendations", "safety precautions", "modifications", "progression steps", "tracking methods", "nutritional information", "expected outcomes", "contraindications", "supporting research"],
        "Lifestyle": ["supplies needed", "step-by-step instructions", "time requirements", "cost estimates", "alternatives", "seasonal variations", "personalization options", "maintenance tips", "visual examples"]
    }

    # Real-world prompt examples with specific titles
    specific_prompts = [
        {
            "title": "SEO-Optimized Blog Content Generator",
            "description": "Create engaging blog posts that rank well on search engines with this comprehensive prompt. This tool guides you through creating SEO-friendly content that attracts readers and satisfies search algorithms.",
            "content": "Generate a comprehensive, SEO-optimized blog post about [TOPIC]. Include an attention-grabbing headline, 5-7 subheadings covering key aspects of the topic, meta description of 150-160 characters, and 3-5 relevant keywords throughout the text. Write in a conversational but authoritative tone, include statistical data where relevant, and end with a compelling call-to-action. The content should be 1500-2000 words long and formatted for easy scanning with bullet points and short paragraphs.",
            "category": "Content Writing",
            "price": 29.99,
            "is_featured": True,
            "views_count": random.randint(500, 2000),
            "sales_count": random.randint(50, 300),
            "rating": 4.9
        },
        {
            "title": "Python Data Analysis Framework",
            "description": "Generate customized Python scripts for data analysis and visualization with this powerful prompt. Perfect for data scientists, analysts, and researchers who need to process and interpret complex datasets.",
            "content": "Create a Python script for data analysis that takes [DATA_SOURCE] as input and performs the following operations: 1) Data cleaning and preprocessing, 2) Exploratory data analysis with descriptive statistics, 3) Feature engineering if applicable, 4) Analysis using [SPECIFY_METHOD: regression/classification/clustering], 5) Visualization of key findings using matplotlib and seaborn, 6) Results interpretation. Include proper error handling, comments explaining the code, and optimization for performance. The script should handle missing values, outliers, and data normalization as needed.",
            "category": "Coding",
            "price": 39.99,
            "is_featured": True,
            "views_count": random.randint(400, 1500),
            "sales_count": random.randint(40, 200),
            "rating": 4.8
        },
        {
            "title": "Creative Short Story Generator",
            "description": "Transform basic ideas into captivating short stories with this creative writing prompt. This tool helps fiction writers develop engaging plots, memorable characters, and immersive settings.",
            "content": "Generate a creative short story based on the following elements: Main character: [CHARACTER_TYPE], Setting: [LOCATION/TIME_PERIOD], Central conflict: [CONFLICT], Theme: [THEME]. Develop the story with a clear beginning that introduces the character and setting, a middle section that builds tension through the conflict, and a satisfying resolution that addresses the theme. Include vivid sensory details, meaningful dialogue, and character development. The story should be 1500-2500 words and written in [VIEWPOINT: first/third] person [TENSE: past/present].",
            "category": "Creative Writing",
            "price": 19.99,
            "is_featured": True,
            "views_count": random.randint(600, 2200),
            "sales_count": random.randint(80, 350),
            "rating": 4.9
        },
        {
            "title": "UI/UX Design Brief Generator",
            "description": "Create comprehensive design briefs for UI/UX projects with this structured prompt. Perfect for designers, product managers, and design teams starting new digital product development.",
            "content": "Generate a detailed UI/UX design brief for a [PRODUCT_TYPE] with the following specifications: Target audience: [TARGET_USERS], Primary user goals: [USER_GOALS], Brand guidelines: [BRAND_ELEMENTS], Technical constraints: [CONSTRAINTS]. The brief should include: 1) Project overview and objectives, 2) User personas with demographics and behaviors, 3) User journey maps for key scenarios, 4) Information architecture requirements, 5) Visual design direction with mood board suggestions, 6) Interactive elements and behavior specifications, 7) Success metrics for the design. Include accessibility requirements (WCAG compliance level) and responsive design considerations for multiple devices.",
            "category": "Design",
            "price": 34.99,
            "is_featured": True,
            "views_count": random.randint(350, 1800),
            "sales_count": random.randint(30, 180),
            "rating": 4.7
        },
        {
            "title": "Comprehensive Marketing Strategy Template",
            "description": "Develop complete marketing strategies for any product or service with this structured prompt. This tool helps marketers create data-driven plans with clear objectives, tactics, and measurement frameworks.",
            "content": "Create a comprehensive marketing strategy for [PRODUCT/SERVICE] targeting [TARGET_AUDIENCE]. Include: 1) Executive summary with key objectives, 2) Market analysis with competitor SWOT, 3) Customer personas with demographics, psychographics, and pain points, 4) Value proposition and positioning statement, 5) Channel strategy for at least 5 relevant platforms, 6) Content strategy with themes and formats, 7) Budget allocation across channels, 8) Implementation timeline for 3, 6, and 12 months, 9) KPIs and measurement framework. The strategy should align with business goals of [BUSINESS_GOALS] and include specific tactics for customer acquisition, engagement, and retention.",
            "category": "Marketing",
            "price": 49.99,
            "is_featured": True,
            "views_count": random.randint(450, 1700),
            "sales_count": random.randint(60, 250),
            "rating": 4.8
        },
        {
            "title": "Personal Productivity System Creator",
            "description": "Design a customized productivity system based on your work style, goals, and challenges. This prompt helps professionals and students create sustainable systems for managing time, tasks, and goals effectively.",
            "content": "Design a personalized productivity system for a person with: Work style: [WORK_STYLE], Primary goals: [GOALS], Key challenges: [CHALLENGES], Available time: [TIME_AVAILABLE]. The system should include: 1) Morning and evening routines, 2) Task prioritization framework, 3) Time blocking templates, 4) Digital and/or analog tool recommendations, 5) Habit formation strategies, 6) Focus techniques for deep work, 7) Progress tracking methods, 8) Rest and recovery protocols. Make the system practical, sustainable for long-term use, and adaptable to changing circumstances. Include implementation steps and troubleshooting for common obstacles.",
            "category": "Personal Growth",
            "price": 24.99,
            "is_featured": True,
            "views_count": random.randint(700, 2500),
            "sales_count": random.randint(100, 400),
            "rating": 4.9
        },
        {
            "title": "Comprehensive Lesson Plan Creator",
            "description": "Create detailed, standards-aligned lesson plans for any subject and grade level. Perfect for teachers, tutors, and educational content creators who need well-structured learning experiences.",
            "content": "Create a comprehensive lesson plan for [SUBJECT] at [GRADE_LEVEL] covering the topic of [TOPIC]. The lesson plan should include: 1) Learning objectives aligned with [STANDARDS], 2) Essential questions and big ideas, 3) Hook/attention grabber to start the lesson, 4) Direct instruction component with key content, 5) Guided practice activities, 6) Independent practice options, 7) Differentiation strategies for advanced and struggling learners, 8) Formative and summative assessment methods, 9) Closure activity, 10) Materials list and preparation steps. Design the lesson for a [TIMEFRAME] class period with opportunities for both individual and collaborative learning. Include technology integration where appropriate.",
            "category": "Education",
            "price": 27.99,
            "is_featured": False,
            "views_count": random.randint(300, 1600),
            "sales_count": random.randint(40, 220),
            "rating": 4.7
        },
        {
            "title": "Digital Art Concept Generator",
            "description": "Generate unique digital art concepts with detailed specifications for style, composition, and execution. Ideal for digital artists, concept artists, and creative professionals looking for fresh ideas.",
            "content": "Create a detailed concept for a digital artwork with the following specifications: Subject: [SUBJECT], Style: [ARTISTIC_STYLE], Mood/atmosphere: [MOOD], Color palette: [COLOR_SCHEME]. The concept should include: 1) Detailed description of the central subject and any secondary elements, 2) Composition layout with focal point and visual flow, 3) Lighting direction and quality, 4) Texture and material suggestions, 5) Background/environment details, 6) Symbolic elements or themes to incorporate, 7) Technical approach for creation including suggested software and techniques. The concept should balance technical feasibility with creative innovation and visual impact.",
            "category": "Art",
            "price": 19.99,
            "is_featured": False,
            "views_count": random.randint(400, 1900),
            "sales_count": random.randint(50, 270),
            "rating": 4.6
        },
        {
            "title": "Technical Documentation Generator",
            "description": "Create clear, comprehensive technical documentation for software, APIs, or systems. This prompt helps developers and technical writers produce user-friendly documentation that meets industry standards.",
            "content": "Generate complete technical documentation for [SOFTWARE/API/SYSTEM] with the following sections: 1) Introduction with purpose and intended audience, 2) System architecture overview with diagrams, 3) Installation and setup guide with prerequisites and step-by-step instructions, 4) Configuration options and environment variables, 5) Core features and functionality explained with code examples, 6) API endpoints with request/response formats if applicable, 7) Common use cases with examples, 8) Troubleshooting guide for common issues, 9) Security considerations, 10) Performance optimization tips, 11) Changelog and version history. Use clear, concise language appropriate for [AUDIENCE_EXPERTISE_LEVEL] and include relevant code snippets in [PROGRAMMING_LANGUAGE].",
            "category": "Technology",
            "price": 42.99,
            "is_featured": False,
            "views_count": random.randint(250, 1400),
            "sales_count": random.randint(30, 190),
            "rating": 4.8
        },
        {
            "title": "Scientific Literature Review Framework",
            "description": "Create structured literature reviews on scientific topics following academic standards. Ideal for researchers, graduate students, and academics preparing publications or study materials.",
            "content": "Generate a framework for a scientific literature review on [TOPIC] in the field of [FIELD]. The review should include: 1) Introduction with scope, significance, and research questions, 2) Methodology for literature selection including databases, search terms, inclusion/exclusion criteria, and PRISMA flow diagram, 3) Theoretical framework section, 4) Chronological development of the topic, 5) Current state of knowledge organized by [ORGANIZATION_METHOD: themes/methodologies/findings], 6) Controversial aspects and debates in the field, 7) Research gaps and future directions, 8) Implications for theory and practice, 9) Conclusion synthesizing key findings. Follow [CITATION_STYLE] formatting for references and adhere to scientific writing conventions including precision, objectivity, and evidence-based argumentation.",
            "category": "Science",
            "price": 36.99,
            "is_featured": False,
            "views_count": random.randint(200, 1200),
            "sales_count": random.randint(20, 150),
            "rating": 4.7
        },
        {
            "title": "Personalized Wellness Plan Creator",
            "description": "Create comprehensive wellness plans tailored to individual health goals, preferences, and constraints. Perfect for health coaches, nutritionists, and individuals seeking holistic well-being strategies.",
            "content": "Design a personalized wellness plan for someone with: Health goals: [HEALTH_GOALS], Current lifestyle: [LIFESTYLE_FACTORS], Dietary preferences: [DIETARY_PREFERENCES], Physical considerations: [PHYSICAL_CONSIDERATIONS], Time availability: [TIME_AVAILABLE]. The plan should include: 1) Nutritional guidelines with meal planning templates and recipes, 2) Physical activity program with specific exercises, sets, reps, and progression, 3) Stress management techniques, 4) Sleep optimization strategies, 5) Habit formation approaches for sustainable changes, 6) Progress tracking methods, 7) Potential obstacles and solutions, 8) Weekly schedule template, 9) Resources and references. Ensure all recommendations are evidence-based and include modifications for different ability levels. The plan should balance effectiveness with sustainability for long-term adherence.",
            "category": "Health",
            "price": 32.99,
            "is_featured": False,
            "views_count": random.randint(500, 2000),
            "sales_count": random.randint(70, 320),
            "rating": 4.8
        },
        {
            "title": "Business Plan Generator",
            "description": "Create comprehensive business plans for startups or new business initiatives. This tool helps entrepreneurs develop professional, investor-ready business plans with all essential components.",
            "content": "Generate a detailed business plan for a [BUSINESS_TYPE] with the following sections: 1) Executive Summary with business concept, mission, and vision, 2) Company Description including legal structure and location, 3) Market Analysis with industry trends, target market, and competition, 4) Organization and Management structure with key roles, 5) Service or Product Line with unique value proposition, 6) Marketing and Sales Strategy with customer acquisition approaches, 7) Funding Request if applicable, 8) Financial Projections for 3-5 years including income statements, cash flow, and break-even analysis, 9) Appendix for supporting documents. Include SWOT analysis, risk assessment, and mitigation strategies. The plan should be realistic, data-driven, and aligned with the business goals of [BUSINESS_GOALS].",
            "category": "Business",
            "price": 54.99,
            "is_featured": False,
            "views_count": random.randint(300, 1700),
            "sales_count": random.randint(40, 230),
            "rating": 4.9
        },
        {
            "title": "Homemaking & Lifestyle Guide Creator",
            "description": "Create comprehensive guides for home management, decor, entertaining, and lifestyle topics. Perfect for content creators, bloggers, and individuals looking to enhance their living spaces and experiences.",
            "content": "Create a detailed lifestyle guide for [LIFESTYLE_TOPIC] with the following elements: 1) Introduction with philosophy and principles, 2) Essential supplies, tools, and resources, 3) Step-by-step processes with timeframes, 4) Visual inspiration and ideas, 5) Customization options for different preferences and budgets, 6) Common challenges and solutions, 7) Seasonal variations if applicable, 8) Maintenance and sustainability considerations, 9) Expert tips for elevating results. The guide should be practical, aspirational but achievable, and incorporate current trends while emphasizing timeless principles. Include suggestions for personalizing the approach based on different living situations, family sizes, and aesthetic preferences.",
            "category": "Lifestyle",
            "price": 22.99,
            "is_featured": False,
            "views_count": random.randint(400, 1800),
            "sales_count": random.randint(60, 280),
            "rating": 4.6
        }
    ]
    
    # Add specific prompts first
    for prompt_data in specific_prompts:
        # Find the category
        category = next((c for c in categories if c.name == prompt_data["category"]), None)
        if not category:
            continue
            
        # Assign to a random seller
        seller = random.choice(sellers)
        
        # Random creation date within last 60 days
        created_at = datetime.utcnow() - timedelta(days=random.randint(0, 60))
        
        prompt = Prompt(
            title=prompt_data["title"],
            description=prompt_data["description"],
            content=prompt_data["content"],
            price=prompt_data["price"],
            is_active=True,
            is_featured=prompt_data["is_featured"],
            views_count=prompt_data["views_count"],
            sales_count=prompt_data["sales_count"],
            rating=prompt_data["rating"],
            seller_id=seller.id,
            category_id=category.id,
            created_at=created_at
        )
        
        db.add(prompt)
    
    # Generate additional prompts using templates
    for i in range(50):  # Increased from 30 to 50 prompts
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
            "Education": "material",
            "Creative Writing": "story",
            "Marketing": "strategy",
            "Personal Growth": "system",
            "Technology": "guide",
            "Art": "artwork",
            "Science": "analysis",
            "Health": "program",
            "Lifestyle": "guide"
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
        
        # Random creation date within last 90 days for more variety
        created_at = datetime.utcnow() - timedelta(days=random.randint(0, 90))
        
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