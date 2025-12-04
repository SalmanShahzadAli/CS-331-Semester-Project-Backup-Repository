"""Query processor for routing user inputs to appropriate handlers."""

import os
import sys
import re
from typing import Dict, Optional

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.symptom_analyzer import SymptomAnalyzer
from database.db_manager import DatabaseManager


class QueryProcessor:
    """Processes and routes user queries."""
    
    def __init__(self, rag_system=None):
        """
        Initialize query processor.
        
        Args:
            rag_system: RAG system instance for medical Q&A
        """
        self.rag_system = rag_system
        self.symptom_analyzer = SymptomAnalyzer()
        self.conversation_state = {
            'awaiting_appointment_confirmation': False,
            'suggested_specialist': None,
            'suggested_urgency': None,
            'booking_data': {}
        }
    
    def process(self, user_input: str) -> str:
        """
        Process user input and route to appropriate handler.
        
        Args:
            user_input: User's message
        
        Returns:
            Bot response string
        """
        user_input_lower = user_input.lower().strip()
        
        # Check for empty input
        if not user_input_lower:
            return "I didn't catch that. Could you please say that again?"
        
        # Handle appointment confirmation
        if self.conversation_state['awaiting_appointment_confirmation']:
            return self._handle_appointment_confirmation(user_input_lower)
        
        # Check for appointment management commands
        if any(word in user_input_lower for word in ['view appointment', 'show appointment', 'my appointment']):
            return self._handle_view_appointments(user_input)
        
        if 'cancel appointment' in user_input_lower:
            return self._handle_cancel_appointment(user_input)
        
        if any(word in user_input_lower for word in ['available slot', 'available time', 'check availability']):
            return self._handle_check_availability(user_input)
        
        if 'book appointment' in user_input_lower or 'schedule appointment' in user_input_lower:
            return self._handle_book_appointment(user_input)
        
        # Check for symptom keywords
        symptom_keywords = [
            'symptom', 'feeling', 'pain', 'ache', 'hurt', 'sick',
            'experiencing', 'having', 'suffering', 'dizzy', 'nausea',
            'fever', 'cough', 'headache', 'tired', 'fatigue'
        ]
        
        if any(keyword in user_input_lower for keyword in symptom_keywords):
            return self._handle_symptom_analysis(user_input)
        
        # Default to RAG system for general medical questions
        return self._handle_medical_query(user_input)
    
    def _handle_symptom_analysis(self, user_input: str) -> str:
        """Handle symptom analysis and specialist recommendation."""
        result = self.symptom_analyzer.analyze_symptoms(user_input)
        
        if result['found_matches']:
            # Store specialist suggestion
            top_match = result['matches'][0][1]['condition']
            self.conversation_state['awaiting_appointment_confirmation'] = True
            self.conversation_state['suggested_specialist'] = top_match['specialist']
            self.conversation_state['suggested_urgency'] = top_match['urgency']
            
            return result['recommendation']
        else:
            return result['message']
    
    def _handle_appointment_confirmation(self, user_input: str) -> str:
        """Handle yes/no response to appointment booking suggestion."""
        affirmative = ['yes', 'sure', 'okay', 'ok', 'please', 'book', 'schedule', 'yeah', 'yep']
        negative = ['no', 'not now', 'later', 'nope', 'nah']
        
        if any(word in user_input for word in affirmative):
            specialist = self.conversation_state['suggested_specialist']
            self.conversation_state['awaiting_appointment_confirmation'] = False
            
            return f"""Great! I'll help you book an appointment with a {specialist}.

Please provide the following information:
1. Your full name
2. Preferred date (format: YYYY-MM-DD)
3. Any additional notes about your symptoms

Example: "Book for John Doe on 2024-12-25, experiencing severe symptoms"

Or you can check available slots first by saying: "Show available slots for {specialist} on 2024-12-25"
"""
        
        elif any(word in user_input for word in negative):
            self.conversation_state['awaiting_appointment_confirmation'] = False
            return "No problem! Feel free to ask any other questions or book an appointment whenever you're ready."
        
        else:
            return "I didn't understand. Would you like to book an appointment? Please say 'yes' or 'no'."
    
    def _handle_view_appointments(self, user_input: str) -> str:
        """Handle viewing appointments."""
        # Try to extract patient name
        name_pattern = r'for\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'
        match = re.search(name_pattern, user_input, re.IGNORECASE)
        
        if match:
            patient_name = match.group(1)
            return DatabaseManager.view_appointments(patient_name=patient_name)
        else:
            return DatabaseManager.view_appointments()
    
    def _handle_cancel_appointment(self, user_input: str) -> str:
        """Handle canceling appointments."""
        # Try to extract appointment ID
        id_pattern = r'(?:id|number|#)\s*(\d+)'
        match = re.search(id_pattern, user_input, re.IGNORECASE)
        
        if match:
            appointment_id = int(match.group(1))
            return DatabaseManager.cancel_appointment(appointment_id)
        else:
            return "Please provide the appointment ID to cancel. Example: 'cancel appointment id 5'"
    
    def _handle_check_availability(self, user_input: str) -> str:
        """Handle checking available time slots."""
        # Try to extract date
        date_pattern = r'(\d{4}-\d{2}-\d{2})'
        date_match = re.search(date_pattern, user_input)
        
        if not date_match:
            return "Please provide a date in YYYY-MM-DD format. Example: 'Show available slots for 2024-12-25'"
        
        date = date_match.group(1)
        
        # Try to extract specialist
        specialist = "General Practitioner"
        for condition in self.symptom_analyzer.conditions:
            if condition['specialist'].lower() in user_input.lower():
                specialist = condition['specialist']
                break
        
        return DatabaseManager.get_available_slots(date, specialist)
    
    def _handle_book_appointment(self, user_input: str) -> str:
        """Handle booking appointments."""
        # Try to extract booking information
        name_pattern = r'for\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'
        date_pattern = r'(\d{4}-\d{2}-\d{2})'
        time_pattern = r'(\d{1,2}:\d{2})'
        
        name_match = re.search(name_pattern, user_input, re.IGNORECASE)
        date_match = re.search(date_pattern, user_input)
        time_match = re.search(time_pattern, user_input)
        
        if not (name_match and date_match and time_match):
            return """To book an appointment, please provide:
1. Patient name (e.g., "for John Doe")
2. Date (YYYY-MM-DD format)
3. Time (HH:MM format)

Example: "Book appointment for John Doe on 2024-12-25 at 14:00"

Or check available slots first: "Show available slots for 2024-12-25"
"""
        
        name = name_match.group(1)
        date = date_match.group(1)
        time = time_match.group(1) + ":00"  # Add seconds
        
        # Use suggested specialist if available
        specialist = self.conversation_state.get('suggested_specialist', 'General Practitioner')
        
        # Extract reason (everything after the time)
        reason = "General consultation"
        if 'reason' in user_input.lower() or 'for' in user_input.lower():
            parts = user_input.lower().split('reason')
            if len(parts) > 1:
                reason = parts[1].strip()
        
        return DatabaseManager.book_appointment(
            patient_name=name,
            appointment_date=date,
            appointment_time=time,
            reason=reason,
            specialist=specialist
        )
    
    def _handle_medical_query(self, user_input: str) -> str:
        """Handle general medical questions using RAG system."""
        if self.rag_system is None:
            return "I apologize, but the medical knowledge system is not available right now. Please try again later."
        
        try:
            response = self.rag_system.query(user_input)
            return response.get('answer', "I couldn't find an answer to that question.")
        except Exception as e:
            return f"I encountered an error while processing your question: {str(e)}"
    
    def reset_state(self):
        """Reset conversation state."""
        self.conversation_state = {
            'awaiting_appointment_confirmation': False,
            'suggested_specialist': None,
            'suggested_urgency': None,
            'booking_data': {}
        }


# For testing
if __name__ == '__main__':
    print("Query Processor Test")
    print("="*60)
    
    processor = QueryProcessor()
    
    test_queries = [
        "I have increased thirst and frequent urination",
        "yes",  # Confirming appointment
        "Show available slots for 2024-12-25",
        "Book appointment for John Doe on 2024-12-25 at 14:00",
        "View my appointments",
        "What is diabetes?"
    ]
    
    for query in test_queries:
        print(f"\nUser: {query}")
        print("-"*60)
        response = processor.process(query)
        print(f"Bot: {response}\n")