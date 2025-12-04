import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Heart, Loader, Sparkles, Moon, Sun, Plus, User, Activity, Pill, FileText, Menu, X, Trash2, AlertCircle } from 'lucide-react';

export default function MedicalChatbot({ onBack }) {
    const [activeView, setActiveView] = useState('chat');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [patients, setPatients] = useState({});
    const [currentPatientId, setCurrentPatientId] = useState(null);
    const [assessments, setAssessments] = useState({});
    const [medications, setMedications] = useState({});

    const [chatHistory, setChatHistory] = useState([
        { id: 1, title: 'Medical Consultation', date: 'Today' },
    ]);
    const [currentChatId, setCurrentChatId] = useState(1);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const [patientForm, setPatientForm] = useState({
        name: '', age: '', gender: 'male', blood_type: 'A+', weight_kg: '', height_cm: '',
        phone: '', allergies: '', chronic_conditions: ''
    });

    const [symptomForm, setSymptomForm] = useState({
        symptoms: [{ name: '', description: '', severity: 'moderate', duration_hours: '', location: '' }]
    });

    const [vitalSignsForm, setVitalSignsForm] = useState({
        systolic_bp: '', diastolic_bp: '', heart_rate: '', temperature_celsius: '',
        respiratory_rate: '', oxygen_saturation: ''
    });

    const [medicationForm, setMedicationForm] = useState({
        name: '', dosage: '', frequency: 'once_daily', start_date: new Date().toISOString().split('T')[0],
        prescribing_doctor: '', instructions: ''
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = async () => {
        const apiKey = process.env.REACT_APP_API_KEY;
        if (!input.trim() || isLoading) return;

        const userMessage = {
            text: input,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are HealthMate Medical Assistant. Help with patient registration, symptom assessment, medication tracking, and health monitoring. Provide clear, empathetic medical guidance. Always remind users to consult healthcare professionals for serious concerns.'
                        },
                        { role: 'user', content: currentInput }
                    ]
                })
            });

            const data = await response.json();
            const botResponse = {
                text: data.choices[0].message.content,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            const errorMessage = {
                text: "I apologize, but I'm having trouble connecting. Please try again.",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterPatient = () => {
        const patientId = `P${String(Object.keys(patients).length + 1).padStart(3, '0')}`;
        const newPatient = {
            ...patientForm,
            patient_id: patientId,
            allergies: patientForm.allergies.split(',').map(a => a.trim()).filter(Boolean),
            chronic_conditions: patientForm.chronic_conditions.split(',').map(c => c.trim()).filter(Boolean),
        };

        setPatients(prev => ({ ...prev, [patientId]: newPatient }));
        setCurrentPatientId(patientId);

        const botMessage = {
            text: `✅ Patient Registered!\n\nID: ${patientId}\nName: ${newPatient.name}\nAge: ${newPatient.age}\nBlood Type: ${newPatient.blood_type}\n\nYou can now proceed with assessments.`,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);
        setActiveView('chat');
    };

    const handleSymptomAssessment = () => {
        if (!currentPatientId) {
            alert('Please register a patient first!');
            return;
        }

        const severityOrder = { low: 1, moderate: 2, high: 3, critical: 4 };
        const maxSeverity = Math.max(...symptomForm.symptoms.map(s => severityOrder[s.severity]));
        const riskLevels = ['low', 'moderate', 'high', 'critical'];
        const riskLevel = riskLevels[maxSeverity - 1];

        let recommendations = [];
        if (riskLevel === 'critical') {
            recommendations = ['⚠️ Seek immediate emergency care', '📞 Call emergency services'];
        } else if (riskLevel === 'high') {
            recommendations = ['⚕️ Contact healthcare provider immediately', '👀 Monitor symptoms'];
        } else if (riskLevel === 'moderate') {
            recommendations = ['📅 Schedule doctor appointment', '📊 Continue monitoring'];
        } else {
            recommendations = ['😌 Rest and monitor', '💧 Stay hydrated'];
        }

        const botMessage = {
            text: `📋 Assessment Complete!\n\nRisk Level: ${riskLevel.toUpperCase()}\n\n${recommendations.join('\n')}\n\n${riskLevel === 'high' || riskLevel === 'critical' ? '⚠️ IMMEDIATE ATTENTION REQUIRED' : '✅ Continue monitoring'}`,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);
        setActiveView('chat');
    };

    const handleAddMedication = () => {
        if (!currentPatientId) {
            alert('Please register a patient first!');
            return;
        }

        const botMessage = {
            text: `💊 Medication Added!\n\nName: ${medicationForm.name}\nDosage: ${medicationForm.dosage}\nFrequency: ${medicationForm.frequency.replace(/_/g, ' ')}\n\nInstructions: ${medicationForm.instructions || 'None'}`,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);
        setActiveView('chat');
    };

    const handleRecordVitals = () => {
        if (!currentPatientId) {
            alert('Please register a patient first!');
            return;
        }

        const alerts = [];
        if (parseInt(vitalSignsForm.systolic_bp) > 140) alerts.push('⚠️ High blood pressure');
        if (parseInt(vitalSignsForm.heart_rate) > 100) alerts.push('⚠️ Elevated heart rate');
        if (parseFloat(vitalSignsForm.temperature_celsius) > 38.0) alerts.push('🌡️ Fever detected');

        const botMessage = {
            text: `📊 Vitals Recorded!\n\nBP: ${vitalSignsForm.systolic_bp}/${vitalSignsForm.diastolic_bp} mmHg\nHR: ${vitalSignsForm.heart_rate} bpm\nTemp: ${vitalSignsForm.temperature_celsius}°C\nRR: ${vitalSignsForm.respiratory_rate}/min\nO₂: ${vitalSignsForm.oxygen_saturation}%\n\n${alerts.length > 0 ? '🚨 ALERTS:\n' + alerts.join('\n') : '✅ Normal range'}`,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);
        setActiveView('chat');
    };

    const getPatientSummary = () => {
        if (!currentPatientId) {
            alert('Please select a patient!');
            return;
        }

        const patient = patients[currentPatientId];
        const summary = `👤 PATIENT SUMMARY\n\nName: ${patient.name}\nID: ${patient.patient_id}\nAge: ${patient.age} | Gender: ${patient.gender}\nBlood Type: ${patient.blood_type}\n\n⚠️ Allergies: ${patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None'}`;

        const botMessage = {
            text: summary,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);
    };

    const renderForm = () => {
        if (activeView === 'register') {
            return (
                <div style={{ padding: '2rem', overflowY: 'auto', maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ color: isDarkMode ? '#fff' : '#2d3436', marginBottom: '1.5rem' }}>
                        <User size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        Patient Registration
                    </h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <input style={formInputStyle} placeholder="Full Name" value={patientForm.name} onChange={e => setPatientForm({ ...patientForm, name: e.target.value })} />
                        <input style={formInputStyle} type="number" placeholder="Age" value={patientForm.age} onChange={e => setPatientForm({ ...patientForm, age: e.target.value })} />
                        <select style={formInputStyle} value={patientForm.gender} onChange={e => setPatientForm({ ...patientForm, gender: e.target.value })}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        <select style={formInputStyle} value={patientForm.blood_type} onChange={e => setPatientForm({ ...patientForm, blood_type: e.target.value })}>
                            <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                            <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                        </select>
                        <input style={formInputStyle} type="number" placeholder="Weight (kg)" value={patientForm.weight_kg} onChange={e => setPatientForm({ ...patientForm, weight_kg: e.target.value })} />
                        <input style={formInputStyle} type="number" placeholder="Height (cm)" value={patientForm.height_cm} onChange={e => setPatientForm({ ...patientForm, height_cm: e.target.value })} />
                        <input style={formInputStyle} placeholder="Phone" value={patientForm.phone} onChange={e => setPatientForm({ ...patientForm, phone: e.target.value })} />
                        <input style={formInputStyle} placeholder="Allergies (comma-separated)" value={patientForm.allergies} onChange={e => setPatientForm({ ...patientForm, allergies: e.target.value })} />
                        <input style={formInputStyle} placeholder="Chronic Conditions (comma-separated)" value={patientForm.chronic_conditions} onChange={e => setPatientForm({ ...patientForm, chronic_conditions: e.target.value })} />
                        <button style={submitButtonStyle} onClick={handleRegisterPatient}>Register Patient</button>
                    </div>
                </div>
            );
        }

        if (activeView === 'assessment') {
            return (
                <div style={{ padding: '2rem', overflowY: 'auto', maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ color: isDarkMode ? '#fff' : '#2d3436', marginBottom: '1.5rem' }}>
                        <Activity size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        Symptom Assessment
                    </h2>
                    {symptomForm.symptoms.map((symptom, idx) => (
                        <div key={idx} style={{ marginBottom: '1.5rem', padding: '1rem', background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa', borderRadius: '0.5rem' }}>
                            <h4 style={{ color: isDarkMode ? '#fff' : '#2d3436', marginBottom: '0.75rem' }}>Symptom #{idx + 1}</h4>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                <input style={formInputStyle} placeholder="Symptom name" value={symptom.name} onChange={e => {
                                    const newSymptoms = [...symptomForm.symptoms];
                                    newSymptoms[idx].name = e.target.value;
                                    setSymptomForm({ symptoms: newSymptoms });
                                }} />
                                <textarea style={{ ...formInputStyle, minHeight: '80px' }} placeholder="Description" value={symptom.description} onChange={e => {
                                    const newSymptoms = [...symptomForm.symptoms];
                                    newSymptoms[idx].description = e.target.value;
                                    setSymptomForm({ symptoms: newSymptoms });
                                }} />
                                <select style={formInputStyle} value={symptom.severity} onChange={e => {
                                    const newSymptoms = [...symptomForm.symptoms];
                                    newSymptoms[idx].severity = e.target.value;
                                    setSymptomForm({ symptoms: newSymptoms });
                                }}>
                                    <option value="low">Low Severity</option>
                                    <option value="moderate">Moderate</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                                <input style={formInputStyle} type="number" placeholder="Duration (hours)" value={symptom.duration_hours} onChange={e => {
                                    const newSymptoms = [...symptomForm.symptoms];
                                    newSymptoms[idx].duration_hours = e.target.value;
                                    setSymptomForm({ symptoms: newSymptoms });
                                }} />
                                <input style={formInputStyle} placeholder="Location" value={symptom.location} onChange={e => {
                                    const newSymptoms = [...symptomForm.symptoms];
                                    newSymptoms[idx].location = e.target.value;
                                    setSymptomForm({ symptoms: newSymptoms });
                                }} />
                            </div>
                        </div>
                    ))}
                    <button style={submitButtonStyle} onClick={handleSymptomAssessment}>Submit Assessment</button>
                </div>
            );
        }

        if (activeView === 'vitals') {
            return (
                <div style={{ padding: '2rem', overflowY: 'auto', maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ color: isDarkMode ? '#fff' : '#2d3436', marginBottom: '1.5rem' }}>
                        <Activity size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        Record Vital Signs
                    </h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <input style={formInputStyle} type="number" placeholder="Systolic BP (mmHg)" value={vitalSignsForm.systolic_bp} onChange={e => setVitalSignsForm({ ...vitalSignsForm, systolic_bp: e.target.value })} />
                        <input style={formInputStyle} type="number" placeholder="Diastolic BP (mmHg)" value={vitalSignsForm.diastolic_bp} onChange={e => setVitalSignsForm({ ...vitalSignsForm, diastolic_bp: e.target.value })} />
                        <input style={formInputStyle} type="number" placeholder="Heart Rate (bpm)" value={vitalSignsForm.heart_rate} onChange={e => setVitalSignsForm({ ...vitalSignsForm, heart_rate: e.target.value })} />
                        <input style={formInputStyle} type="number" step="0.1" placeholder="Temperature (°C)" value={vitalSignsForm.temperature_celsius} onChange={e => setVitalSignsForm({ ...vitalSignsForm, temperature_celsius: e.target.value })} />
                        <input style={formInputStyle} type="number" placeholder="Respiratory Rate (/min)" value={vitalSignsForm.respiratory_rate} onChange={e => setVitalSignsForm({ ...vitalSignsForm, respiratory_rate: e.target.value })} />
                        <input style={formInputStyle} type="number" placeholder="Oxygen Saturation (%)" value={vitalSignsForm.oxygen_saturation} onChange={e => setVitalSignsForm({ ...vitalSignsForm, oxygen_saturation: e.target.value })} />
                        <button style={submitButtonStyle} onClick={handleRecordVitals}>Record Vitals</button>
                    </div>
                </div>
            );
        }

        if (activeView === 'medication') {
            return (
                <div style={{ padding: '2rem', overflowY: 'auto', maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ color: isDarkMode ? '#fff' : '#2d3436', marginBottom: '1.5rem' }}>
                        <Pill size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        Add Medication
                    </h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <input style={formInputStyle} placeholder="Medication Name" value={medicationForm.name} onChange={e => setMedicationForm({ ...medicationForm, name: e.target.value })} />
                        <input style={formInputStyle} placeholder="Dosage (e.g., 500mg)" value={medicationForm.dosage} onChange={e => setMedicationForm({ ...medicationForm, dosage: e.target.value })} />
                        <select style={formInputStyle} value={medicationForm.frequency} onChange={e => setMedicationForm({ ...medicationForm, frequency: e.target.value })}>
                            <option value="once_daily">Once Daily</option>
                            <option value="twice_daily">Twice Daily</option>
                            <option value="three_times_daily">Three Times Daily</option>
                            <option value="as_needed">As Needed</option>
                        </select>
                        <input style={formInputStyle} type="date" value={medicationForm.start_date} onChange={e => setMedicationForm({ ...medicationForm, start_date: e.target.value })} />
                        <input style={formInputStyle} placeholder="Prescribing Doctor" value={medicationForm.prescribing_doctor} onChange={e => setMedicationForm({ ...medicationForm, prescribing_doctor: e.target.value })} />
                        <textarea style={{ ...formInputStyle, minHeight: '80px' }} placeholder="Instructions" value={medicationForm.instructions} onChange={e => setMedicationForm({ ...medicationForm, instructions: e.target.value })} />
                        <button style={submitButtonStyle} onClick={handleAddMedication}>Add Medication</button>
                    </div>
                </div>
            );
        }

        return null;
    };

    const formInputStyle = {
        padding: '0.75rem 1rem',
        border: isDarkMode ? '1px solid rgba(231, 76, 60, 0.3)' : '1px solid #e9ecef',
        borderRadius: '0.5rem',
        fontSize: '0.95rem',
        background: isDarkMode ? '#000' : '#ffffff',
        color: isDarkMode ? '#fff' : '#2d3436',
        outline: 'none',
    };

    const submitButtonStyle = {
        padding: '0.875rem 1.5rem',
        background: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
    };

    const containerStyle = {
        height: '100vh',
        display: 'flex',
        background: isDarkMode ? 'linear-gradient(135deg, #2d3436 0%, #000000 100%)' : '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    };

    const sidebarStyle = {
        width: isSidebarOpen ? '280px' : '0',
        background: isDarkMode ? '#1a1a1a' : '#f8f9fa',
        borderRight: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
    };

    const menuItemStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        cursor: 'pointer',
        color: isDarkMode ? '#fff' : '#2d3436',
        transition: 'all 0.2s',
        fontSize: '0.9rem',
        border: 'none',
        background: 'none',
        width: '100%',
        textAlign: 'left',
    };

    return (
        <div style={containerStyle}>
            <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>

            <div style={sidebarStyle}>
                <div style={{ padding: '1rem' }}>
                    <h3 style={{ color: isDarkMode ? '#fff' : '#2d3436', fontSize: '0.875rem', marginBottom: '1rem' }}>Quick Actions</h3>
                    <button style={menuItemStyle} onClick={() => setActiveView('register')} onMouseEnter={e => e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : '#e9ecef'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <User size={18} /> Register Patient
                    </button>
                    <button style={menuItemStyle} onClick={() => setActiveView('assessment')} onMouseEnter={e => e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : '#e9ecef'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Activity size={18} /> Symptom Assessment
                    </button>
                    <button style={menuItemStyle} onClick={() => setActiveView('vitals')} onMouseEnter={e => e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : '#e9ecef'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Activity size={18} /> Vital Signs
                    </button>
                    <button style={menuItemStyle} onClick={() => setActiveView('medication')} onMouseEnter={e => e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : '#e9ecef'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Pill size={18} /> Add Medication
                    </button>
                    <button style={menuItemStyle} onClick={getPatientSummary} onMouseEnter={e => e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : '#e9ecef'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <FileText size={18} /> Patient Summary
                    </button>
                    <button style={menuItemStyle} onClick={() => setActiveView('chat')} onMouseEnter={e => e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : '#e9ecef'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Plus size={18} /> New Chat
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', textTransform: 'uppercase', padding: '0.5rem 0', marginTop: '1rem' }}>Chat History</div>
                    {chatHistory.map(chat => (
                        <div key={chat.id} style={{
                            padding: '0.75rem',
                            marginBottom: '0.5rem',
                            background: chat.id === currentChatId ? (isDarkMode ? 'rgba(231, 76, 60, 0.1)' : 'rgba(231, 76, 60, 0.05)') : 'transparent',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            borderLeft: chat.id === currentChatId ? '3px solid #e74c3c' : 'none',
                        }} onClick={() => setCurrentChatId(chat.id)}>
                            <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#fff' : '#2d3436' }}>{chat.title}</div>
                            <div style={{ fontSize: '0.7rem', color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', marginTop: '0.25rem' }}>{chat.date}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    background: isDarkMode ? 'rgba(45, 52, 54, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '1rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', padding: '0.5rem' }} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#e74c3c', fontSize: '1rem', fontWeight: 600 }} onClick={onBack}>
                            <ArrowLeft size={20} /> <span style={{ marginLeft: '0.5rem' }}>Back</span>
                        </button>
                        <h2 style={{ margin: 0, color: isDarkMode ? '#fff' : '#2d3436', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                            <Heart size={24} color="#e74c3c" /> HealthMate Medical <Sparkles size={18} color="#e74c3c" />
                        </h2>
                    </div>
                    <button style={{
                        background: '#e74c3c',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                    }} onClick={() => setIsDarkMode(!isDarkMode)}>
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {activeView === 'chat' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ flex: 1, overflowY: 'auto', padding: messages.length === 0 ? '0' : '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: messages.length === 0 ? 'center' : 'flex-start', alignItems: messages.length === 0 ? 'center' : 'stretch' }}>
                                {messages.length === 0 ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <h1 style={{ fontSize: '2rem', color: isDarkMode ? '#fff' : '#2d3436' }}>How can I help you today?</h1>
                                        <p style={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', marginTop: '1rem' }}>Register a patient, assess symptoms, or ask me anything!</p>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((msg, index) => (
                                            <div key={index} style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                                maxWidth: '75%',
                                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                            }}>
                                                <div style={{
                                                    padding: '1rem 1.25rem',
                                                    borderRadius: msg.sender === 'user' ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
                                                    background: msg.sender === 'user' ? '#e74c3c' : (isDarkMode ? '#2d3436' : '#f8f9fa'),
                                                    color: msg.sender === 'user' ? 'white' : (isDarkMode ? '#fff' : '#2d3436'),
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                    lineHeight: '1.5',
                                                    fontSize: '0.95rem',
                                                    whiteSpace: 'pre-wrap',
                                                }}>
                                                    {msg.text}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.7rem',
                                                    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                                                    marginTop: '0.25rem',
                                                    paddingLeft: '0.5rem',
                                                }}>
                                                    {msg.timestamp}
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem 1.25rem', background: isDarkMode ? '#2d3436' : '#f8f9fa', borderRadius: '1.25rem', maxWidth: '75px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e74c3c', animation: 'bounce 1.4s infinite ease-in-out' }}></div>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e74c3c', animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '0.2s' }}></div>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e74c3c', animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '0.4s' }}></div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            <div style={{
                                padding: '2rem',
                                background: isDarkMode ? 'rgba(45, 52, 54, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                borderTop: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e9ecef',
                            }}>
                                <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '700px', margin: '0 auto' }}>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                                        placeholder="Message HealthMate Medical..."
                                        disabled={isLoading}
                                        style={{
                                            flex: 1,
                                            padding: '1rem 1.5rem',
                                            border: isDarkMode ? '1px solid rgba(231, 76, 60, 0.3)' : '1px solid #e9ecef',
                                            borderRadius: '1.5rem',
                                            fontSize: '0.95rem',
                                            background: isDarkMode ? '#000' : '#ffffff',
                                            color: isDarkMode ? '#fff' : '#2d3436',
                                            outline: 'none',
                                        }}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={isLoading}
                                        style={{
                                            background: isLoading ? '#b2bec3' : '#e74c3c',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.875rem',
                                            borderRadius: '50%',
                                            width: '48px',
                                            height: '48px',
                                            cursor: isLoading ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {isLoading ? <Loader size={20} /> : <Send size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        renderForm()
                    )}
                </div>
            </div>
        </div>
    );
}