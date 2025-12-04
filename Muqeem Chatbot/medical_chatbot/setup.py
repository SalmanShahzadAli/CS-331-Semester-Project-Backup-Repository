"""
Automatic Project Setup Script
Creates entire Medical AI Chatbot project structure with all files
"""

import os
import sys
from pathlib import Path


# File contents dictionary
FILES_CONTENT = {
    "requirements.txt": """# Core AI/ML Libraries
langchain==0.1.0
langchain-community==0.0.10
llama-cpp-python==0.2.27
sentence-transformers==2.2.2
huggingface-hub==0.19.4

# Vector Database
chromadb==0.4.18

# Database
psycopg2-binary==2.9.9

# Utilities
python-dotenv==1.0.0
pandas==2.1.4
numpy==1.26.2

# Optional: Web Interface
flask==3.0.0
flask-cors==4.0.0
""",
    
    ".env.example": """# Database Configuration
DB_NAME=medical_chatbot
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432

# Model Configuration
MODEL_PATH=./models/llama-2-7b-chat.Q4_K_M.gguf
EMBEDDINGS_MODEL=sentence-transformers/all-MiniLM-L6-v2

# Application Settings
MAX_TOKENS=512
TEMPERATURE=0.7
CONTEXT_WINDOW=2048
N_THREADS=4

# Logging
LOG_LEVEL=INFO
LOG_FILE=chatbot.log
""",

    ".gitignore": """# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
*.egg-info/
dist/
build/

# Environment
.env

# Models
models/*.gguf

# Database
chroma_db/
*.db
*.sqlite

# Logs
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
""",

    "README.md": """# 🏥 Medical AI Chatbot

A comprehensive medical chatbot with symptom analysis, specialist recommendations, and appointment management.

## Features

- 🔍 **Intelligent Symptom Analysis** - Analyzes symptoms and suggests specialists
- 👨‍⚕️ **Specialist Recommendations** - Automatically routes to appropriate specialists
- ⚠️ **Urgency Assessment** - Evaluates priority level for medical attention
- 📅 **Appointment Management** - Book, view, and cancel appointments
- 💊 **Medical Information** - RAG-powered accurate medical knowledge
- 🗄️ **PostgreSQL Database** - Professional data storage

## Quick Start

### 1. Install PostgreSQL

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# Run installer and set password
```

**Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Setup Project

```bash
# Clone or download this project
cd medical_chatbot

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\\Scripts\\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL password
```

### 3. Initialize Database

```bash
python database/init_db.py
```

### 4. Download Llama Model

```bash
python scripts/download_model.py
```

### 5. Run Chatbot

```bash
python main.py
```

## Project Structure

```
medical_chatbot/
├── config/              # Configuration files
├── database/            # Database operations
├── models/              # Medical knowledge & symptom analysis
├── ai/                  # AI models (Llama, RAG, embeddings)
├── utils/               # Utilities (query processor, validators)
├── scripts/             # Setup scripts
├── main.py              # Main application
└── requirements.txt     # Dependencies
```

## Usage Examples

### Symptom Analysis
```
You: I have increased thirst and frequent urination
Bot: [Analyzes symptoms and recommends Endocrinologist]
```

### Book Appointment
```
You: Book appointment for John Doe on 2024-12-25 at 14:00
Bot: [Books appointment and confirms]
```

### Medical Questions
```
You: What is diabetes?
Bot: [Provides detailed medical information]
```

## Configuration

Edit `.env` file:
- `DB_PASSWORD`: Your PostgreSQL password
- `N_THREADS`: CPU cores to use (default: 4)
- `TEMPERATURE`: Model creativity (0.0-1.0)

## Requirements

- Python 3.9+
- PostgreSQL 12+
- 8GB RAM minimum (16GB recommended)
- 10GB disk space

## Troubleshooting

### Model Download Issues
```bash
# Manually download from HuggingFace
# Place in ./models/ directory
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
# Mac:
brew services list
# Linux:
sudo systemctl status postgresql
```

## License

MIT License - See LICENSE file

## Disclaimer

This chatbot provides general medical information only. Always consult qualified healthcare professionals for medical advice, diagnosis, or treatment.

## Support

For issues or questions, please open an issue on GitHub.
""",

    "LICENSE": """MIT License

Copyright (c) 2024 Medical AI Chatbot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""
}


def create_directory_structure():
    """Create project directory structure."""
    directories = [
        "config",
        "database",
        "models",
        "ai",
        "utils",
        "scripts",
        "models",  # For model files
    ]
    
    print("Creating directory structure...")
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"  ✅ Created: {directory}/")
    
    print()


def create_file(filepath, content):
    """Create a file with given content."""
    Path(filepath).parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  ✅ Created: {filepath}")


def create_simple_files():
    """Create simple configuration files."""
    print("Creating configuration files...")
    for filename, content in FILES_CONTENT.items():
        create_file(filename, content)
    print()


def create_init_files():
    """Create __init__.py files for packages."""
    print("Creating package __init__.py files...")
    packages = {
        "config/__init__.py": 'from .database_config import DatabaseConfig\nfrom .model_config import ModelConfig\n',
        "database/__init__.py": 'from .db_manager import DatabaseManager\nfrom .init_db import initialize_database\n',
        "models/__init__.py": 'from .medical_conditions import MEDICAL_CONDITIONS, format_medical_documents\nfrom .symptom_analyzer import SymptomAnalyzer\n',
        "ai/__init__.py": 'from .llama_loader import LlamaLoader\nfrom .rag_system import RAGSystem\nfrom .embeddings import EmbeddingsManager\n',
        "utils/__init__.py": 'from .query_processor import QueryProcessor\nfrom .validators import InputValidator\n',
        "scripts/__init__.py": '',
    }
    
    for filepath, content in packages.items():
        create_file(filepath, content)
    print()


def show_completion_message():
    """Show completion message with next steps."""
    print("="*70)
    print("✅ PROJECT SETUP COMPLETE!")
    print("="*70)
    print()
    print("📁 Project structure created successfully!")
    print()
    print("📝 NEXT STEPS:")
    print()
    print("1. Copy all code files from artifacts into their respective folders:")
    print("   - config/database_config.py")
    print("   - config/model_config.py")
    print("   - database/schema.sql")
    print("   - database/db_manager.py")
    print("   - database/init_db.py")
    print("   - models/medical_conditions.py")
    print("   - models/symptom_analyzer.py")
    print("   - ai/llama_loader.py")
    print("   - ai/embeddings.py")
    print("   - ai/rag_system.py")
    print("   - utils/query_processor.py")
    print("   - utils/validators.py")
    print("   - scripts/download_model.py")
    print("   - main.py")
    print()
    print("2. Configure environment:")
    print("   cp .env.example .env")
    print("   # Edit .env with your PostgreSQL password")
    print()
    print("3. Create virtual environment:")
    print("   python -m venv venv")
    print("   # Windows: venv\\Scripts\\activate")
    print("   # Mac/Linux: source venv/bin/activate")
    print()
    print("4. Install dependencies:")
    print("   pip install -r requirements.txt")
    print()
    print("5. Initialize database:")
    print("   python database/init_db.py")
    print()
    print("6. Download Llama model:")
    print("   python scripts/download_model.py")
    print()
    print("7. Run the chatbot:")
    print("   python main.py")
    print()
    print("="*70)


if __name__ == '__main__':
    print("="*70)
    print("MEDICAL AI CHATBOT - AUTOMATIC PROJECT SETUP")
    print("="*70)
    print()
    
    # Create directory structure
    create_directory_structure()
    
    # Create simple files
    create_simple_files()
    
    # Create __init__.py files
    create_init_files()
    
    # Show completion message
    show_completion_message()