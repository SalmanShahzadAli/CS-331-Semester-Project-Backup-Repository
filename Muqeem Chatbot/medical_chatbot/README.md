# 🏥 Medical AI Chatbot

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
venv\Scripts\activate
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
