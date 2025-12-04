"""Medical conditions database with symptoms and specialist mappings."""

MEDICAL_CONDITIONS = [
    {
        "condition": "Diabetes",
        "symptoms": [
            "increased thirst", "frequent urination", "extreme fatigue",
            "blurred vision", "slow healing wounds", "unexplained weight loss",
            "increased hunger", "tingling in hands", "tingling in feet"
        ],
        "specialist": "Endocrinologist",
        "urgency": "high",
        "description": """Diabetes is a chronic condition affecting blood sugar regulation.
Type 1: Body doesn't produce insulin, usually diagnosed in children and young adults.
Type 2: Body doesn't use insulin properly, most common type, linked to obesity and lifestyle.
Complications if untreated: Heart disease, kidney damage, nerve damage, vision problems.""",
        "treatment": "Healthy diet, regular exercise, blood sugar monitoring, medication or insulin as prescribed.",
        "when_to_see_doctor": "If you have multiple symptoms, family history, or blood sugar concerns. Urgent if blood sugar is very high or low."
    },
    {
        "condition": "Hypertension",
        "symptoms": [
            "headaches", "shortness of breath", "nosebleeds", "chest pain",
            "dizziness", "vision problems", "fatigue", "irregular heartbeat"
        ],
        "specialist": "Cardiologist",
        "urgency": "high",
        "description": """High blood pressure - blood pressure consistently above 130/80 mmHg.
Often has no symptoms ('silent killer').
Risk factors: Age, family history, obesity, lack of exercise, high salt diet, excessive alcohol, stress.
Can lead to heart attack, stroke, kidney disease.""",
        "treatment": "DASH diet (low sodium, high fruits/vegetables), regular exercise, maintain healthy weight, limit alcohol, stress management, medication if prescribed.",
        "when_to_see_doctor": "If blood pressure readings are consistently high (above 130/80), severe headaches, or chest pain. Emergency if above 180/120."
    },
    {
        "condition": "Asthma",
        "symptoms": [
            "wheezing", "shortness of breath", "chest tightness",
            "coughing at night", "difficulty breathing", "rapid breathing"
        ],
        "specialist": "Pulmonologist",
        "urgency": "medium",
        "description": """Chronic respiratory condition causing airway inflammation.
Triggers: Allergens (pollen, dust mites, pet dander), exercise, cold air, smoke, strong odors, respiratory infections.
Can range from mild to life-threatening.""",
        "treatment": "Quick-relief inhalers for acute symptoms, long-term control medications, avoid triggers, allergy management.",
        "when_to_see_doctor": "Frequent symptoms, nighttime awakening, difficulty with daily activities. Emergency if severe difficulty breathing or blue lips."
    },
    {
        "condition": "Depression",
        "symptoms": [
            "persistent sadness", "loss of interest", "fatigue",
            "sleep changes", "appetite changes", "difficulty concentrating",
            "feelings of worthlessness", "thoughts of death", "irritability"
        ],
        "specialist": "Psychiatrist",
        "urgency": "high",
        "description": """Mental health disorder affecting mood and daily functioning.
Can affect anyone regardless of age, gender, or background.
Highly treatable with proper care. Not a sign of weakness.""",
        "treatment": "Psychotherapy (talk therapy), medications (antidepressants), lifestyle changes (exercise, healthy diet, social support), support groups.",
        "when_to_see_doctor": "If symptoms persist for 2+ weeks or interfere with daily life. SEEK IMMEDIATE HELP if you have thoughts of self-harm or suicide. Call emergency services or crisis hotline."
    },
    {
        "condition": "Migraine",
        "symptoms": [
            "severe headache", "throbbing pain", "nausea", "vomiting",
            "sensitivity to light", "sensitivity to sound", "visual auras",
            "dizziness", "blurred vision"
        ],
        "specialist": "Neurologist",
        "urgency": "medium",
        "description": """Severe headache disorder with intense throbbing pain, usually on one side.
Can last 4-72 hours if untreated.
Triggers: Stress, certain foods (aged cheese, chocolate), hormonal changes, sleep changes, weather changes.""",
        "treatment": "Pain relievers, triptans for acute attacks, preventive medications, lifestyle modifications, avoiding triggers.",
        "when_to_see_doctor": "Frequent migraines (more than 4 per month), severe pain not responding to over-the-counter medications, sudden change in headache pattern."
    },
    {
        "condition": "Arthritis",
        "symptoms": [
            "joint pain", "joint stiffness", "swelling", "reduced range of motion",
            "morning stiffness", "joint tenderness", "joint warmth"
        ],
        "specialist": "Rheumatologist",
        "urgency": "medium",
        "description": """Inflammation of joints causing pain and stiffness.
Types: Osteoarthritis (wear and tear, common with aging), Rheumatoid arthritis (autoimmune, can occur at any age).
Can affect any joint, commonly hands, knees, hips, spine.""",
        "treatment": "Pain relievers, anti-inflammatory medications, physical therapy, exercise, weight management, hot/cold therapy.",
        "when_to_see_doctor": "Persistent joint pain lasting more than a few weeks, severe swelling, significant limitation in daily activities."
    },
    {
        "condition": "GERD",
        "symptoms": [
            "heartburn", "chest pain", "difficulty swallowing", "regurgitation",
            "sour taste", "chronic cough", "hoarseness", "throat irritation"
        ],
        "specialist": "Gastroenterologist",
        "urgency": "low",
        "description": """Gastroesophageal Reflux Disease - stomach acid flows back into esophagus causing irritation.
Common triggers: Spicy foods, fatty foods, caffeine, alcohol, chocolate, lying down after eating.
Can lead to esophageal damage if untreated.""",
        "treatment": "Antacids, H2 blockers, proton pump inhibitors, dietary changes (avoid triggers), eating smaller meals, not lying down after eating, elevating head while sleeping.",
        "when_to_see_doctor": "Frequent heartburn (2+ times per week), difficulty swallowing, persistent symptoms despite medication, unexplained weight loss."
    },
    {
        "condition": "Thyroid Disorder",
        "symptoms": [
            "fatigue", "weight changes", "mood changes", "temperature sensitivity",
            "heart rate changes", "hair loss", "dry skin", "muscle weakness"
        ],
        "specialist": "Endocrinologist",
        "urgency": "medium",
        "description": """Thyroid gland produces too much (hyperthyroidism) or too little (hypothyroidism) hormone.
Affects metabolism, energy, temperature regulation, heart rate.
Common in women, especially after pregnancy or with age.""",
        "treatment": "Medication to regulate thyroid hormone levels, regular monitoring with blood tests, possible radioactive iodine treatment or surgery in severe cases.",
        "when_to_see_doctor": "Unexplained weight changes (gain or loss), persistent fatigue, rapid or slow heart rate, multiple symptoms present."
    },
    {
        "condition": "Eczema",
        "symptoms": [
            "itchy skin", "red patches", "dry skin", "skin rash",
            "scaling", "inflammation", "skin thickening", "oozing or crusting"
        ],
        "specialist": "Dermatologist",
        "urgency": "low",
        "description": """Chronic skin condition causing inflammation and irritation.
Often triggered by allergens, stress, irritants (soaps, detergents), weather changes.
Common in children but can affect adults. Not contagious.""",
        "treatment": "Moisturizers (apply frequently), topical corticosteroids, immunomodulators, avoid triggers (harsh soaps, allergens), keep skin hydrated.",
        "when_to_see_doctor": "Severe itching affecting sleep or daily activities, widespread rash, signs of infection (oozing, crusting, fever), not responding to over-the-counter treatments."
    },
    {
        "condition": "Chronic Back Pain",
        "symptoms": [
            "lower back pain", "muscle aches", "shooting pain", "limited flexibility",
            "pain radiating down leg", "numbness", "tingling", "difficulty standing"
        ],
        "specialist": "Orthopedist",
        "urgency": "medium",
        "description": """Persistent back pain lasting more than 3 months.
Causes: Herniated disc, arthritis, muscle strain, poor posture, injury, degenerative disc disease.
Can significantly impact daily life and mobility.""",
        "treatment": "Physical therapy, pain medications (NSAIDs), muscle relaxants, exercise (strengthening and stretching), posture correction, hot/cold therapy, massage.",
        "when_to_see_doctor": "Pain lasting more than 2 weeks, severe pain, numbness or weakness in legs, loss of bowel/bladder control (EMERGENCY), pain after injury."
    },
    {
        "condition": "Anxiety Disorder",
        "symptoms": [
            "excessive worry", "restlessness", "fatigue", "difficulty concentrating",
            "irritability", "muscle tension", "sleep disturbances", "panic attacks"
        ],
        "specialist": "Psychiatrist",
        "urgency": "medium",
        "description": """Mental health condition characterized by persistent, excessive worry.
Types include: Generalized anxiety disorder, panic disorder, social anxiety disorder.
Can interfere with daily activities and quality of life.""",
        "treatment": "Cognitive behavioral therapy (CBT), medications (anti-anxiety drugs, antidepressants), relaxation techniques, lifestyle changes, stress management.",
        "when_to_see_doctor": "Persistent worry interfering with daily life, panic attacks, physical symptoms (rapid heartbeat, sweating), avoiding activities due to anxiety."
    },
    {
        "condition": "Allergic Rhinitis",
        "symptoms": [
            "sneezing", "runny nose", "itchy nose", "nasal congestion",
            "itchy eyes", "watery eyes", "postnasal drip", "cough"
        ],
        "specialist": "Allergist",
        "urgency": "low",
        "description": """Allergic reaction causing nasal inflammation.
Triggered by: Pollen, dust mites, pet dander, mold spores.
Can be seasonal (hay fever) or year-round.""",
        "treatment": "Antihistamines, nasal corticosteroids, decongestants, avoiding allergens, allergy shots (immunotherapy) for severe cases.",
        "when_to_see_doctor": "Symptoms interfering with sleep or daily activities, not responding to over-the-counter medications, frequent sinus infections."
    }
]


def format_medical_documents():
    """
    Convert structured medical conditions to document format for RAG system.
    
    Returns:
        List of formatted medical documents
    """
    documents = []
    
    for condition in MEDICAL_CONDITIONS:
        doc = f"""Medical Condition: {condition['condition']}

Description:
{condition['description']}

Common Symptoms:
{', '.join(condition['symptoms'])}

Recommended Specialist: {condition['specialist']}

Urgency Level: {condition['urgency'].upper()}

Treatment Options:
{condition['treatment']}

When to See a Doctor:
{condition['when_to_see_doctor']}

---
IMPORTANT MEDICAL DISCLAIMER: This information is for general educational purposes only and should not be considered as medical advice. Always consult with a qualified healthcare professional for proper diagnosis and treatment of any medical condition.
---
"""
        documents.append(doc)
    
    return documents


def get_all_symptoms():
    """Get a list of all unique symptoms across all conditions."""
    all_symptoms = set()
    for condition in MEDICAL_CONDITIONS:
        all_symptoms.update(condition['symptoms'])
    return sorted(list(all_symptoms))


def get_all_specialists():
    """Get a list of all specialists."""
    specialists = set()
    for condition in MEDICAL_CONDITIONS:
        specialists.add(condition['specialist'])
    return sorted(list(specialists))


def get_conditions_by_urgency(urgency_level):
    """
    Get conditions by urgency level.
    
    Args:
        urgency_level: 'low', 'medium', 'high', or 'emergency'
    
    Returns:
        List of conditions matching the urgency level
    """
    return [
        condition for condition in MEDICAL_CONDITIONS 
        if condition['urgency'] == urgency_level
    ]


# For testing
if __name__ == '__main__':
    print("Medical Conditions Database")
    print("="*60)
    print(f"Total conditions: {len(MEDICAL_CONDITIONS)}")
    print(f"Total unique symptoms: {len(get_all_symptoms())}")
    print(f"Specialists available: {', '.join(get_all_specialists())}")
    
    print("\n" + "="*60)
    print("HIGH URGENCY CONDITIONS:")
    for condition in get_conditions_by_urgency('high'):
        print(f"  - {condition['condition']} → {condition['specialist']}")
    
    print("\n" + "="*60)
    print("Sample Document Format:")
    print(format_medical_documents()[0][:500] + "...")