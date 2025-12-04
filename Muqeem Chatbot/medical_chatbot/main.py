"""Simplified Medical AI Chatbot - No LangChain, No RAG!"""

import sys
import os
from dotenv import load_dotenv

load_dotenv()

from ai.grok_client import GrokClient
from models.symptom_analyzer import SymptomAnalyzer
from database.db_manager import DatabaseManager
from database.init_db import initialize_database


# System prompt with medical knowledge built-in
SYSTEM_PROMPT = """You are a helpful medical assistant chatbot. Follow these guidelines:

MEDICAL KNOWLEDGE:
- Diabetes: Symptoms include increased thirst, frequent urination, extreme fatigue, blurred vision. See Endocrinologist.
- Hypertension: Symptoms include headaches, shortness of breath, nosebleeds, chest pain. See Cardiologist.
- Asthma: Symptoms include wheezing, shortness of breath, chest tightness, coughing. See Pulmonologist.
- Depression: Persistent sadness, loss of interest, fatigue, sleep changes. See Psychiatrist.
- Migraine: Severe headache, nausea, sensitivity to light/sound. See Neurologist.
- Arthritis: Joint pain, stiffness, swelling. See Rheumatologist.
- GERD: Heartburn, chest pain, difficulty swallowing. See Gastroenterologist.

GUIDELINES:
1. Answer medical questions clearly and concisely
2. Always add: "This is general information. Please consult a healthcare provider for personalized advice."
3. For appointment booking, collect: name, date (YYYY-MM-DD), time, reason
4. Be empathetic and professional
5. If symptoms suggest a condition, recommend the appropriate specialist
6. Never diagnose - only provide general information"""


def check_prerequisites():
    """Check if prerequisites are met."""
    print("="*70)
    print("CHECKING PREREQUISITES")
    print("="*70)
    
    # Check database
    try:
        from config.database_config import DatabaseConfig
        import psycopg2
        conn = psycopg2.connect(**DatabaseConfig.get_config_dict())
        conn.close()
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database issue: {e}")
        print("\nInitializing database...")
        try:
            initialize_database()
            print("✅ Database initialized!")
            return True
        except:
            return False


def start_chatbot():
    """Start the simplified chatbot."""
    # Check prerequisites
    if not check_prerequisites():
        print("\n❌ Setup failed. Please check database configuration.")
        sys.exit(1)
    
    # Initialize components
    print("\n" + "="*70)
    print("     🏥 MEDICAL AI CHATBOT (SIMPLIFIED VERSION) 🏥")
    print("="*70)
    print("\nInitializing Grok AI...")
    
    grok = GrokClient(verbose=False)
    symptom_analyzer = SymptomAnalyzer()
    
    print("✅ System ready!")
    print("\n" + "="*70)
    print("\n✨ FEATURES:")
    print("  1. 🔍 Symptom analysis")
    print("  2. 👨‍⚕️ Specialist recommendations")
    print("  3. 📅 Appointment booking")
    print("  4. 💊 Medical information")
    print("\n⚠️  DISCLAIMER: General information only. Always consult healthcare professionals.")
    print("\n💡 TIP: Describe your symptoms naturally!")
    print("\nCommands: 'quit' to exit | 'help' for more info | 'reset' to clear conversation")
    print("="*70)
    
    while True:
        try:
            print("\n" + "-"*70)
            user_input = input("\n🧑 You: ").strip()
            
            if not user_input:
                continue
            
            # Exit commands
            if user_input.lower() in ['quit', 'exit', 'bye']:
                print("\n🤖 Bot: Thank you! Stay healthy! 👋\n")
                break
            
            # Reset conversation
            if user_input.lower() == 'reset':
                grok.reset_conversation()
                print("\n🤖 Bot: Conversation reset. How can I help you?")
                continue
            
            # Help command
            if user_input.lower() == 'help':
                print("\n🤖 Bot: Here's what I can do:\n")
                print("📋 EXAMPLES:")
                print("   • 'I have a headache and nausea'")
                print("   • 'What is diabetes?'")
                print("   • 'Book appointment for John Doe on 2024-12-25 at 14:00'")
                print("   • 'View appointments'")
                print("   • 'Check available slots for 2024-12-25'")
                continue
            
            # Check for symptom keywords
            symptom_keywords = ['symptom', 'pain', 'ache', 'feeling', 'have', 'experiencing']
            has_symptoms = any(word in user_input.lower() for word in symptom_keywords)
            
            # Analyze symptoms if detected
            if has_symptoms:
                analysis = symptom_analyzer.analyze_symptoms(user_input)
                if analysis['found_matches']:
                    print("\n🤖 Bot:")
                    print(analysis['recommendation'])
                    continue
            
            # Check for appointment commands
            lower_input = user_input.lower()
            
            if 'view appointment' in lower_input or 'show appointment' in lower_input:
                print("\n🤖 Bot:")
                print(DatabaseManager.view_appointments())
                continue
            
            if 'available slot' in lower_input or 'check availability' in lower_input:
                # Extract date
                import re
                date_match = re.search(r'(\d{4}-\d{2}-\d{2})', user_input)
                if date_match:
                    date = date_match.group(1)
                    print("\n🤖 Bot:")
                    print(DatabaseManager.get_available_slots(date))
                else:
                    print("\n🤖 Bot: Please provide a date (YYYY-MM-DD). Example: 'Check slots for 2024-12-25'")
                continue
            
            if 'book appointment' in lower_input or 'schedule appointment' in lower_input:
                # Try to extract appointment details
                import re
                name_match = re.search(r'for\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)', user_input, re.IGNORECASE)
                date_match = re.search(r'(\d{4}-\d{2}-\d{2})', user_input)
                time_match = re.search(r'(\d{1,2}:\d{2})', user_input)
                
                if name_match and date_match and time_match:
                    name = name_match.group(1)
                    date = date_match.group(1)
                    time = time_match.group(1) + ":00"
                    reason = "General consultation"
                    specialist = "General Practitioner"
                    
                    print("\n🤖 Bot:")
                    result = DatabaseManager.book_appointment(name, date, time, reason, specialist)
                    print(result)
                else:
                    print("\n🤖 Bot: To book an appointment, please provide:")
                    print("   Format: 'Book appointment for [Name] on [YYYY-MM-DD] at [HH:MM]'")
                    print("   Example: 'Book appointment for John Doe on 2024-12-25 at 14:00'")
                continue
            
            # For everything else, use Grok with system prompt
            print("\n🤖 Bot: ", end="", flush=True)
            response = grok.chat(user_input, system_prompt=SYSTEM_PROMPT)
            print(response)
            
        except KeyboardInterrupt:
            print("\n\n🤖 Bot: Goodbye! 👋")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")
            print("Please try again.")


if __name__ == '__main__':
    try:
        start_chatbot()
    except Exception as e:
        print(f"\n❌ Critical error: {e}")
        sys.exit(1)