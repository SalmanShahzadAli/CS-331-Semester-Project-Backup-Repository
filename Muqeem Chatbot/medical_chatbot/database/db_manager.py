"""Database manager for all database operations."""

import psycopg2
from psycopg2 import sql
from datetime import datetime, date, time as dt_time
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.database_config import DatabaseConfig


class DatabaseManager:
    """Handles all database operations."""
    
    @staticmethod
    def get_connection():
        """Get database connection."""
        return psycopg2.connect(**DatabaseConfig.get_config_dict())
    
    # ============ PATIENT OPERATIONS ============
    
    @staticmethod
    def add_patient(full_name, phone=None, email=None, date_of_birth=None):
        """
        Add a new patient or return existing patient ID.
        
        Args:
            full_name: Patient's full name
            phone: Phone number (optional)
            email: Email address (optional)
            date_of_birth: Date of birth (optional)
        
        Returns:
            patient_id or None if error
        """
        try:
            conn = DatabaseManager.get_connection()
            cursor = conn.cursor()
            
            # Check if patient exists by name
            cursor.execute(
                "SELECT patient_id FROM patients WHERE full_name = %s",
                (full_name,)
            )
            result = cursor.fetchone()
            
            if result:
                patient_id = result[0]
            else:
                # Insert new patient
                cursor.execute(
                    """INSERT INTO patients (full_name, phone, email, date_of_birth) 
                       VALUES (%s, %s, %s, %s) RETURNING patient_id""",
                    (full_name, phone, email, date_of_birth)
                )
                patient_id = cursor.fetchone()[0]
                conn.commit()
            
            cursor.close()
            conn.close()
            return patient_id
            
        except Exception as e:
            print(f"Error adding patient: {e}")
            return None
    
    @staticmethod
    def get_patient(patient_id=None, full_name=None):
        """Get patient information."""
        try:
            conn = DatabaseManager.get_connection()
            cursor = conn.cursor()
            
            if patient_id:
                cursor.execute(
                    "SELECT * FROM patients WHERE patient_id = %s",
                    (patient_id,)
                )
            elif full_name:
                cursor.execute(
                    "SELECT * FROM patients WHERE full_name = %s",
                    (full_name,)
                )
            else:
                return None
            
            result = cursor.fetchone()
            cursor.close()
            conn.close()
            
            if result:
                return {
                    'patient_id': result[0],
                    'full_name': result[1],
                    'phone': result[2],
                    'email': result[3],
                    'date_of_birth': result[4],
                    'date_registered': result[5]
                }
            return None
            
        except Exception as e:
            print(f"Error getting patient: {e}")
            return None
    
    # ============ APPOINTMENT OPERATIONS ============
    
    @staticmethod
    def book_appointment(patient_name, appointment_date, appointment_time, 
                        reason, specialist="General Practitioner", notes=None):
        """
        Book a new appointment.
        
        Args:
            patient_name: Patient's full name
            appointment_date: Date (YYYY-MM-DD string or date object)
            appointment_time: Time (HH:MM string or time object)
            reason: Reason for visit
            specialist: Type of specialist
            notes: Additional notes (optional)
        
        Returns:
            Success message or error message
        """
        try:
            conn = DatabaseManager.get_connection()
            cursor = conn.cursor()
            
            # Get or create patient
            patient_id = DatabaseManager.add_patient(patient_name)
            if not patient_id:
                return "Error: Could not create patient record."
            
            # Convert date/time if strings
            if isinstance(appointment_date, str):
                appointment_date = datetime.strptime(appointment_date, '%Y-%m-%d').date()
            if isinstance(appointment_time, str):
                appointment_time = datetime.strptime(appointment_time, '%H:%M:%S').time()
            
            # Check if slot is available
            cursor.execute(
                """SELECT appointment_id FROM appointments 
                   WHERE appointment_date = %s 
                   AND appointment_time = %s 
                   AND specialist = %s
                   AND status = 'scheduled'""",
                (appointment_date, appointment_time, specialist)
            )
            
            if cursor.fetchone():
                cursor.close()
                conn.close()
                return f"❌ Sorry, {specialist} is not available at {appointment_time} on {appointment_date}."
            
            # Book appointment
            cursor.execute(
                """INSERT INTO appointments 
                   (patient_id, appointment_date, appointment_time, reason, specialist, notes) 
                   VALUES (%s, %s, %s, %s, %s, %s) RETURNING appointment_id""",
                (patient_id, appointment_date, appointment_time, reason, specialist, notes)
            )
            
            appointment_id = cursor.fetchone()[0]
            conn.commit()
            cursor.close()
            conn.close()
            
            return f"""✅ APPOINTMENT CONFIRMED!

Appointment ID: {appointment_id}
Patient: {patient_name}
Specialist: {specialist}
Date: {appointment_date}
Time: {appointment_time}
Reason: {reason}

📧 Please arrive 15 minutes early for check-in."""
            
        except Exception as e:
            return f"❌ Error booking appointment: {e}"
    
    @staticmethod
    def view_appointments(patient_name=None, specialist=None, status='scheduled'):
        """
        View appointments with optional filters.
        
        Args:
            patient_name: Filter by patient name (optional)
            specialist: Filter by specialist (optional)
            status: Filter by status (default: 'scheduled')
        
        Returns:
            Formatted string of appointments
        """
        try:
            conn = DatabaseManager.get_connection()
            cursor = conn.cursor()
            
            query = """
                SELECT a.appointment_id, p.full_name, a.appointment_date, 
                       a.appointment_time, a.specialist, a.reason, a.status
                FROM appointments a
                JOIN patients p ON a.patient_id = p.patient_id
                WHERE a.status = %s
            """
            params = [status]
            
            if patient_name:
                query += " AND p.full_name = %s"
                params.append(patient_name)
            
            if specialist:
                query += " AND a.specialist = %s"
                params.append(specialist)
            
            query += " ORDER BY a.appointment_date, a.appointment_time"
            
            cursor.execute(query, params)
            appointments = cursor.fetchall()
            cursor.close()
            conn.close()
            
            if not appointments:
                return "No appointments found."
            
            result = "\n📅 SCHEDULED APPOINTMENTS:\n" + "="*70 + "\n"
            for apt in appointments:
                result += f"""
ID: {apt[0]}
Patient: {apt[1]}
Date: {apt[2]}
Time: {apt[3]}
Specialist: {apt[4]}
Reason: {apt[5]}
Status: {apt[6]}
{'─'*70}
"""
            
            return result
            
        except Exception as e:
            return f"Error viewing appointments: {e}"
    
    @staticmethod
    def cancel_appointment(appointment_id):
        """Cancel an appointment."""
        try:
            conn = DatabaseManager.get_connection()
            cursor = conn.cursor()
            
            cursor.execute(
                """UPDATE appointments 
                   SET status = 'cancelled' 
                   WHERE appointment_id = %s 
                   RETURNING appointment_id""",
                (appointment_id,)
            )
            
            result = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            if result:
                return f"✅ Appointment {appointment_id} has been cancelled."
            else:
                return f"❌ Appointment {appointment_id} not found."
                
        except Exception as e:
            return f"Error cancelling appointment: {e}"
    
    @staticmethod
    def get_available_slots(appointment_date, specialist="General Practitioner"):
        """
        Get available time slots for a given date and specialist.
        
        Args:
            appointment_date: Date to check (YYYY-MM-DD string or date object)
            specialist: Type of specialist
        
        Returns:
            List of available time slots
        """
        try:
            conn = DatabaseManager.get_connection()
            cursor = conn.cursor()
            
            # Convert date if string
            if isinstance(appointment_date, str):
                appointment_date = datetime.strptime(appointment_date, '%Y-%m-%d').date()
            
            # Get booked times
            cursor.execute(
                """SELECT appointment_time FROM appointments 
                   WHERE appointment_date = %s 
                   AND specialist = %s
                   AND status = 'scheduled'""",
                (appointment_date, specialist)
            )
            
            booked_times = [str(row[0]) for row in cursor.fetchall()]
            cursor.close()
            conn.close()
            
            # Define all possible slots
            all_slots = [
                '09:00:00', '10:00:00', '11:00:00', 
                '14:00:00', '15:00:00', '16:00:00'
            ]
            available_slots = [slot for slot in all_slots if slot not in booked_times]
            
            if available_slots:
                result = f"📅 Available slots for {specialist} on {appointment_date}:\n\n"
                for slot in available_slots:
                    result += f"  ⏰ {slot[:5]}\n"
                return result
            else:
                return f"No available slots for {specialist} on {appointment_date}."
                
        except Exception as e:
            return f"Error checking available slots: {e}"
    
    # ============ CHAT HISTORY OPERATIONS ============
    
    @staticmethod
    def save_chat_history(patient_name, user_message, bot_response, session_id=None):
        """Save chat conversation to database."""
        try:
            conn = DatabaseManager.get_connection()
            cursor = conn.cursor()
            
            patient_id = DatabaseManager.add_patient(patient_name)
            
            cursor.execute(
                """INSERT INTO chat_history 
                   (patient_id, user_message, bot_response, session_id) 
                   VALUES (%s, %s, %s, %s)""",
                (patient_id, user_message, bot_response, session_id)
            )
            
            conn.commit()
            cursor.close()
            conn.close()
            
        except Exception as e:
            print(f"Error saving chat history: {e}")
    
    @staticmethod
    def get_chat_history(patient_name=None, limit=50):
        """Retrieve chat history."""
        try:
            conn = DatabaseManager.get_connection()
            cursor = conn.cursor()
            
            if patient_name:
                cursor.execute(
                    """SELECT ch.user_message, ch.bot_response, ch.timestamp
                       FROM chat_history ch
                       JOIN patients p ON ch.patient_id = p.patient_id
                       WHERE p.full_name = %s
                       ORDER BY ch.timestamp DESC
                       LIMIT %s""",
                    (patient_name, limit)
                )
            else:
                cursor.execute(
                    """SELECT ch.user_message, ch.bot_response, ch.timestamp
                       FROM chat_history ch
                       ORDER BY ch.timestamp DESC
                       LIMIT %s""",
                    (limit,)
                )
            
            history = cursor.fetchall()
            cursor.close()
            conn.close()
            
            return history
            
        except Exception as e:
            print(f"Error getting chat history: {e}")
            return []


# Test functions
if __name__ == '__main__':
    print("Testing Database Manager...")
    
    # Test adding patient
    patient_id = DatabaseManager.add_patient("Test Patient", "555-1234", "test@email.com")
    print(f"Patient ID: {patient_id}")
    
    # Test booking appointment
    result = DatabaseManager.book_appointment(
        "Test Patient",
        "2024-12-25",
        "10:00:00",
        "Regular checkup",
        "General Practitioner"
    )
    print(result)
    
    # Test viewing appointments
    print(DatabaseManager.view_appointments())
    
    # Test available slots
    print(DatabaseManager.get_available_slots("2024-12-25"))