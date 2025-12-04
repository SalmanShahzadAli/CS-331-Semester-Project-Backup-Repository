-- Medical AI Chatbot Database Schema
-- PostgreSQL

-- Drop existing tables if they exist
DROP TABLE IF EXISTS chat_history CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS patients CASCADE;

-- Patients table
CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    date_of_birth DATE,
    date_registered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_email UNIQUE (email)
);

-- Create index on patient name for faster searches
CREATE INDEX idx_patient_name ON patients(full_name);

-- Appointments table
CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    specialist VARCHAR(100) NOT NULL DEFAULT 'General Practitioner',
    reason TEXT,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_appointment UNIQUE(appointment_date, appointment_time, specialist)
);

-- Create indexes for appointment queries
CREATE INDEX idx_appointment_date ON appointments(appointment_date);
CREATE INDEX idx_appointment_status ON appointments(status);
CREATE INDEX idx_appointment_specialist ON appointments(specialist);
CREATE INDEX idx_patient_appointments ON appointments(patient_id, appointment_date);

-- Chat history table
CREATE TABLE chat_history (
    chat_id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(patient_id) ON DELETE SET NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    session_id VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on timestamp for chat history queries
CREATE INDEX idx_chat_timestamp ON chat_history(timestamp DESC);
CREATE INDEX idx_chat_session ON chat_history(session_id);

-- Medical conditions reference table (optional, for tracking)
CREATE TABLE medical_conditions (
    condition_id SERIAL PRIMARY KEY,
    condition_name VARCHAR(100) NOT NULL UNIQUE,
    specialist_type VARCHAR(100) NOT NULL,
    urgency_level VARCHAR(20) CHECK (urgency_level IN ('low', 'medium', 'high', 'emergency')),
    description TEXT,
    common_symptoms TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert common medical conditions
INSERT INTO medical_conditions (condition_name, specialist_type, urgency_level, description, common_symptoms) VALUES
('Diabetes', 'Endocrinologist', 'high', 'Chronic condition affecting blood sugar regulation', ARRAY['increased thirst', 'frequent urination', 'fatigue', 'blurred vision']),
('Hypertension', 'Cardiologist', 'high', 'High blood pressure condition', ARRAY['headaches', 'shortness of breath', 'nosebleeds', 'chest pain']),
('Asthma', 'Pulmonologist', 'medium', 'Chronic respiratory condition', ARRAY['wheezing', 'shortness of breath', 'chest tightness', 'coughing']),
('Migraine', 'Neurologist', 'medium', 'Severe headache disorder', ARRAY['severe headache', 'nausea', 'sensitivity to light', 'visual auras']),
('Depression', 'Psychiatrist', 'high', 'Mental health disorder affecting mood', ARRAY['persistent sadness', 'loss of interest', 'fatigue', 'difficulty concentrating']),
('Arthritis', 'Rheumatologist', 'medium', 'Joint inflammation causing pain', ARRAY['joint pain', 'stiffness', 'swelling', 'reduced range of motion']),
('GERD', 'Gastroenterologist', 'low', 'Acid reflux condition', ARRAY['heartburn', 'chest pain', 'difficulty swallowing', 'regurgitation']),
('Thyroid Disorder', 'Endocrinologist', 'medium', 'Thyroid gland dysfunction', ARRAY['fatigue', 'weight changes', 'mood changes', 'temperature sensitivity']),
('Eczema', 'Dermatologist', 'low', 'Chronic skin condition', ARRAY['itchy skin', 'red patches', 'dry skin', 'skin rash']),
('Chronic Back Pain', 'Orthopedist', 'medium', 'Persistent back pain', ARRAY['lower back pain', 'muscle aches', 'shooting pain', 'limited flexibility']);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for appointments table
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for upcoming appointments
CREATE OR REPLACE VIEW upcoming_appointments AS
SELECT 
    a.appointment_id,
    p.full_name AS patient_name,
    p.phone,
    p.email,
    a.appointment_date,
    a.appointment_time,
    a.specialist,
    a.reason,
    a.status
FROM appointments a
JOIN patients p ON a.patient_id = p.patient_id
WHERE a.appointment_date >= CURRENT_DATE
  AND a.status = 'scheduled'
ORDER BY a.appointment_date, a.appointment_time;

-- Grant permissions (adjust username as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_username;

-- Display table information
SELECT 
    'Database schema created successfully!' AS message,
    COUNT(*) AS total_tables
FROM information_schema.tables
WHERE table_schema = 'public';