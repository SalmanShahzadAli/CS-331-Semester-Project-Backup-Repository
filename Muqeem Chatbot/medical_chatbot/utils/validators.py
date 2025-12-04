"""Input validation and sanitization utilities."""

import re
from datetime import datetime, date, timedelta
from typing import Optional, Tuple


class InputValidator:
    """Validates and sanitizes user inputs."""
    
    @staticmethod
    def validate_date(date_string: str) -> Tuple[bool, Optional[str], Optional[date]]:
        """
        Validate date string in YYYY-MM-DD format.
        
        Args:
            date_string: Date string to validate
        
        Returns:
            Tuple of (is_valid, error_message, parsed_date)
        """
        try:
            parsed_date = datetime.strptime(date_string, '%Y-%m-%d').date()
            
            # Check if date is in the past
            if parsed_date < date.today():
                return False, "Date cannot be in the past", None
            
            # Check if date is too far in the future (e.g., more than 1 year)
            max_date = date.today() + timedelta(days=365)
            if parsed_date > max_date:
                return False, "Date cannot be more than 1 year in the future", None
            
            return True, None, parsed_date
            
        except ValueError:
            return False, "Invalid date format. Please use YYYY-MM-DD (e.g., 2024-12-25)", None
    
    @staticmethod
    def validate_time(time_string: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Validate time string in HH:MM format.
        
        Args:
            time_string: Time string to validate
        
        Returns:
            Tuple of (is_valid, error_message, normalized_time)
        """
        try:
            # Try to parse time
            time_obj = datetime.strptime(time_string, '%H:%M').time()
            
            # Check if time is within business hours (e.g., 9 AM to 5 PM)
            if time_obj.hour < 9 or time_obj.hour >= 17:
                return False, "Time must be between 09:00 and 17:00", None
            
            # Normalize to HH:MM:SS format
            normalized = time_obj.strftime('%H:%M:00')
            
            return True, None, normalized
            
        except ValueError:
            return False, "Invalid time format. Please use HH:MM (e.g., 14:00)", None
    
    @staticmethod
    def validate_name(name: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Validate patient name.
        
        Args:
            name: Name to validate
        
        Returns:
            Tuple of (is_valid, error_message, sanitized_name)
        """
        if not name or len(name.strip()) == 0:
            return False, "Name cannot be empty", None
        
        name = name.strip()
        
        # Check length
        if len(name) < 2:
            return False, "Name is too short", None
        
        if len(name) > 100:
            return False, "Name is too long (max 100 characters)", None
        
        # Check for valid characters (letters, spaces, hyphens, apostrophes)
        if not re.match(r"^[A-Za-z\s\-']+$", name):
            return False, "Name can only contain letters, spaces, hyphens, and apostrophes", None
        
        # Capitalize properly
        sanitized = ' '.join(word.capitalize() for word in name.split())
        
        return True, None, sanitized
    
    @staticmethod
    def validate_phone(phone: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Validate phone number.
        
        Args:
            phone: Phone number to validate
        
        Returns:
            Tuple of (is_valid, error_message, sanitized_phone)
        """
        if not phone:
            return True, None, None  # Phone is optional
        
        # Remove common separators
        cleaned = re.sub(r'[\s\-\(\)\.]+', '', phone)
        
        # Check if it contains only digits and +
        if not re.match(r'^\+?\d+$', cleaned):
            return False, "Phone number can only contain digits, +, and common separators", None
        
        # Check length (10-15 digits is typical)
        digits_only = re.sub(r'\D', '', cleaned)
        if len(digits_only) < 10 or len(digits_only) > 15:
            return False, "Phone number must be 10-15 digits", None
        
        return True, None, cleaned
    
    @staticmethod
    def validate_email(email: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Validate email address.
        
        Args:
            email: Email to validate
        
        Returns:
            Tuple of (is_valid, error_message, sanitized_email)
        """
        if not email:
            return True, None, None  # Email is optional
        
        email = email.strip().lower()
        
        # Basic email regex
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        
        if not re.match(pattern, email):
            return False, "Invalid email format", None
        
        if len(email) > 100:
            return False, "Email is too long (max 100 characters)", None
        
        return True, None, email
    
    @staticmethod
    def sanitize_text(text: str, max_length: int = 1000) -> str:
        """
        Sanitize general text input.
        
        Args:
            text: Text to sanitize
            max_length: Maximum allowed length
        
        Returns:
            Sanitized text
        """
        if not text:
            return ""
        
        # Remove excessive whitespace
        text = ' '.join(text.split())
        
        # Truncate if too long
        if len(text) > max_length:
            text = text[:max_length]
        
        # Remove potentially dangerous characters for SQL injection
        # (Note: Using parameterized queries is the primary defense)
        dangerous_chars = ['--', ';', '/*', '*/', 'xp_', 'sp_']
        for char in dangerous_chars:
            text = text.replace(char, '')
        
        return text.strip()
    
    @staticmethod
    def validate_appointment_id(appointment_id: str) -> Tuple[bool, Optional[str], Optional[int]]:
        """
        Validate appointment ID.
        
        Args:
            appointment_id: Appointment ID to validate
        
        Returns:
            Tuple of (is_valid, error_message, parsed_id)
        """
        try:
            id_int = int(appointment_id)
            
            if id_int < 1:
                return False, "Appointment ID must be a positive number", None
            
            return True, None, id_int
            
        except ValueError:
            return False, "Appointment ID must be a number", None


# For testing
if __name__ == '__main__':
    print("Input Validator Test")
    print("="*60)
    
    # Test date validation
    print("\nDate Validation:")
    test_dates = ["2024-12-25", "2023-01-01", "2025-15-01", "invalid"]
    for test_date in test_dates:
        valid, error, parsed = InputValidator.validate_date(test_date)
        if valid:
            print(f"✅ {test_date} → Valid (parsed: {parsed})")
        else:
            print(f"❌ {test_date} → Invalid ({error})")
    
    # Test time validation
    print("\nTime Validation:")
    test_times = ["14:00", "09:00", "08:00", "25:00", "invalid"]
    for test_time in test_times:
        valid, error, normalized = InputValidator.validate_time(test_time)
        if valid:
            print(f"✅ {test_time} → Valid (normalized: {normalized})")
        else:
            print(f"❌ {test_time} → Invalid ({error})")
    
    # Test name validation
    print("\nName Validation:")
    test_names = ["John Doe", "mary smith", "A", "John123", "O'Connor"]
    for test_name in test_names:
        valid, error, sanitized = InputValidator.validate_name(test_name)
        if valid:
            print(f"✅ '{test_name}' → Valid (sanitized: '{sanitized}')")
        else:
            print(f"❌ '{test_name}' → Invalid ({error})")
    
    # Test email validation
    print("\nEmail Validation:")
    test_emails = ["test@example.com", "invalid.email", "user@domain", ""]
    for test_email in test_emails:
        valid, error, sanitized = InputValidator.validate_email(test_email)
        if valid:
            print(f"✅ '{test_email}' → Valid")
        else:
            print(f"❌ '{test_email}' → Invalid ({error})")
    
    # Test phone validation
    print("\nPhone Validation:")
    test_phones = ["555-123-4567", "5551234567", "+1-555-123-4567", "123", ""]
    for test_phone in test_phones:
        valid, error, sanitized = InputValidator.validate_phone(test_phone)
        if valid:
            print(f"✅ '{test_phone}' → Valid (sanitized: '{sanitized}')")
        else:
            print(f"❌ '{test_phone}' → Invalid ({error})")