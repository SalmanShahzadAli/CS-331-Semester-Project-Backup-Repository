"""Symptom analysis and specialist recommendation system."""

from typing import Dict, List, Tuple
from .medical_conditions import MEDICAL_CONDITIONS


class SymptomAnalyzer:
    """Analyzes user symptoms and recommends specialists."""
    
    def __init__(self):
        """Initialize with medical conditions database."""
        self.conditions = MEDICAL_CONDITIONS
        self.symptom_index = self._build_symptom_index()
    
    def _build_symptom_index(self) -> Dict:
        """
        Create a searchable index of symptoms to conditions.
        
        Returns:
            Dictionary mapping symptoms to conditions
        """
        index = {}
        for condition in self.conditions:
            for symptom in condition['symptoms']:
                symptom_lower = symptom.lower()
                if symptom_lower not in index:
                    index[symptom_lower] = []
                index[symptom_lower].append(condition)
        return index
    
    def analyze_symptoms(self, user_input: str) -> Dict:
        """
        Analyze user symptoms and return possible conditions with specialists.
        
        Args:
            user_input: String containing symptoms mentioned by user
        
        Returns:
            Dictionary with analysis results
        """
        user_input_lower = user_input.lower()
        
        # Find matching conditions
        matches = {}
        
        for symptom, conditions in self.symptom_index.items():
            if symptom in user_input_lower:
                for condition in conditions:
                    condition_name = condition['condition']
                    if condition_name not in matches:
                        matches[condition_name] = {
                            'condition': condition,
                            'matched_symptoms': [],
                            'score': 0
                        }
                    matches[condition_name]['matched_symptoms'].append(symptom)
                    matches[condition_name]['score'] += 1
        
        if not matches:
            return {
                'found_matches': False,
                'message': "I couldn't match your symptoms to specific conditions. I recommend seeing a General Practitioner for evaluation.",
                'suggested_specialist': 'General Practitioner'
            }
        
        # Sort by number of matching symptoms
        sorted_matches = sorted(
            matches.items(), 
            key=lambda x: x[1]['score'], 
            reverse=True
        )
        
        # Get top matches (up to 3)
        top_matches = sorted_matches[:3]
        
        return {
            'found_matches': True,
            'matches': top_matches,
            'recommendation': self._generate_recommendation(top_matches)
        }
    
    def _generate_recommendation(self, matches: List[Tuple]) -> str:
        """
        Generate specialist recommendation based on matches.
        
        Args:
            matches: List of (condition_name, match_data) tuples
        
        Returns:
            Formatted recommendation string
        """
        if not matches:
            return None
        
        top_match = matches[0][1]['condition']
        matched_symptoms = matches[0][1]['matched_symptoms']
        
        # Create urgency indicator
        urgency_emoji = {
            'low': '🟢',
            'medium': '🟡',
            'high': '🔴',
            'emergency': '🚨'
        }
        
        urgency_message = {
            'low': 'LOW PRIORITY - Schedule appointment when convenient',
            'medium': 'MODERATE PRIORITY - Schedule appointment within 1-2 weeks',
            'high': 'HIGH PRIORITY - Schedule appointment within a few days',
            'emergency': 'EMERGENCY - Seek immediate medical attention'
        }
        
        recommendation = f"""
🔍 SYMPTOM ANALYSIS RESULTS:
{'='*60}

Based on your symptoms, you may be experiencing:
📋 {top_match['condition']}

Matched Symptoms: {', '.join(matched_symptoms[:5])}
{"..." if len(matched_symptoms) > 5 else ""}

📖 DESCRIPTION:
{top_match['description']}

👨‍⚕️ RECOMMENDED SPECIALIST: {top_match['specialist']}

{urgency_emoji[top_match['urgency']]} URGENCY LEVEL: {urgency_message[top_match['urgency']]}

💊 GENERAL TREATMENT APPROACH:
{top_match['treatment']}

🏥 WHEN TO SEE A DOCTOR:
{top_match['when_to_see_doctor']}
"""
        
        # Add other possible conditions if multiple matches
        if len(matches) > 1:
            recommendation += "\n\n📌 OTHER POSSIBLE CONDITIONS:\n"
            for i, (name, data) in enumerate(matches[1:], 1):
                recommendation += f"   {i}. {name} - See {data['condition']['specialist']}\n"
        
        # Add appointment suggestion based on urgency
        recommendation += "\n" + "="*60 + "\n"
        
        if top_match['urgency'] == 'emergency':
            recommendation += "\n🚨 EMERGENCY: Please call emergency services (911) or go to the nearest emergency room immediately!"
        elif top_match['urgency'] == 'high':
            recommendation += f"\n🔴 HIGH PRIORITY: Would you like me to book an urgent appointment with a {top_match['specialist']}?"
        elif top_match['urgency'] == 'medium':
            recommendation += f"\n🟡 RECOMMENDED: Would you like to schedule an appointment with a {top_match['specialist']}?"
        else:
            recommendation += f"\n🟢 If symptoms persist or worsen, would you like to book an appointment with a {top_match['specialist']}?"
        
        # Add medical disclaimer
        recommendation += """

⚠️ IMPORTANT DISCLAIMER:
This is for general information only and not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
"""
        
        return recommendation
    
    def get_specialist_for_condition(self, condition_name: str) -> str:
        """
        Get specialist for a specific condition.
        
        Args:
            condition_name: Name of the medical condition
        
        Returns:
            Specialist type or 'General Practitioner' if not found
        """
        for condition in self.conditions:
            if condition['condition'].lower() == condition_name.lower():
                return condition['specialist']
        return "General Practitioner"
    
    def get_urgency_for_condition(self, condition_name: str) -> str:
        """
        Get urgency level for a specific condition.
        
        Args:
            condition_name: Name of the medical condition
        
        Returns:
            Urgency level ('low', 'medium', 'high', 'emergency')
        """
        for condition in self.conditions:
            if condition['condition'].lower() == condition_name.lower():
                return condition['urgency']
        return "medium"
    
    def search_by_specialist(self, specialist_name: str) -> List[Dict]:
        """
        Find all conditions handled by a specific specialist.
        
        Args:
            specialist_name: Name of the specialist
        
        Returns:
            List of conditions
        """
        return [
            condition for condition in self.conditions
            if condition['specialist'].lower() == specialist_name.lower()
        ]
    
    def get_conditions_by_symptom(self, symptom: str) -> List[str]:
        """
        Get all conditions associated with a specific symptom.
        
        Args:
            symptom: Symptom to search for
        
        Returns:
            List of condition names
        """
        symptom_lower = symptom.lower()
        if symptom_lower in self.symptom_index:
            return [
                condition['condition'] 
                for condition in self.symptom_index[symptom_lower]
            ]
        return []


# Test functions
if __name__ == '__main__':
    print("Testing Symptom Analyzer")
    print("="*60)
    
    analyzer = SymptomAnalyzer()
    
    # Test 1: Diabetes symptoms
    print("\nTEST 1: Diabetes-like symptoms")
    print("-"*60)
    test1 = "I have increased thirst, frequent urination, and extreme fatigue"
    result1 = analyzer.analyze_symptoms(test1)
    if result1['found_matches']:
        print(result1['recommendation'])
    
    # Test 2: Migraine symptoms
    print("\n\nTEST 2: Migraine symptoms")
    print("-"*60)
    test2 = "I have a severe headache with nausea and sensitivity to light"
    result2 = analyzer.analyze_symptoms(test2)
    if result2['found_matches']:
        print(result2['recommendation'])
    
    # Test 3: Multiple matches
    print("\n\nTEST 3: Symptoms matching multiple conditions")
    print("-"*60)
    test3 = "I have chest pain and shortness of breath"
    result3 = analyzer.analyze_symptoms(test3)
    if result3['found_matches']:
        print(result3['recommendation'])
    
    # Test specialist search
    print("\n\nTEST 4: Conditions by specialist")
    print("-"*60)
    cardio_conditions = analyzer.search_by_specialist("Cardiologist")
    print(f"Conditions handled by Cardiologist:")
    for condition in cardio_conditions:
        print(f"  - {condition['condition']}")