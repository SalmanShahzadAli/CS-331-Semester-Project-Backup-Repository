"""Flask API server for Medical Chatbot"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from models.symptom_analyzer import SymptomAnalyzer
from database.db_manager import DatabaseManager

load_dotenv()

app = Flask(__name__)
CORS(app)

symptom_analyzer = SymptomAnalyzer()

SYSTEM_PROMPT = """You are a helpful medical assistant chatbot.
Follow these rules:

1. Provide general medical information.
2. Never diagnose; only give guidance.
3. Recommend specialists if symptoms match.
4. Keep responses short (2–4 sentences).
5. Always add: 
"This is general information. Please consult a healthcare provider for personalized advice."
"""

###############################
# 🔥 PRIMARY CHAT ENDPOINT
###############################
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '').strip()

        if not user_message:
            return jsonify({"response": "Please type a message.", "type": "error"}), 400

        # === Symptom Detection ===
        keywords = ['symptom', 'pain', 'ache', 'hurting', 'burning', 'tightness', 'feeling']
        if any(w in user_message.lower() for w in keywords):
            analysis = symptom_analyzer.analyze_symptoms(user_message)
            if analysis.get("found_matches"):
                return jsonify({
                    "response": analysis["recommendation"],
                    "type": "symptom_analysis"
                })

        # === AI Chat ===
        ai_reply = ask_ai(user_message)

        return jsonify({
            "response": ai_reply,
            "type": "general"
        })

    except Exception as e:
        print("❌ Error in /api/chat:", e)
        return jsonify({"error": str(e)}), 500


###############################
# 🔥 AI LAYER (WE WILL FILL THIS)
###############################
def ask_ai(user_message):
    ai_reply = ask_ai(user_message)
    return jsonify({"response": ai_reply, "type": "general"})


###############################
# Appointment Endpoints
###############################
@app.route('/api/appointments', methods=['GET'])
def view_appointments():
    return jsonify({"appointments": DatabaseManager.view_appointments()})


@app.route('/api/appointments/book', methods=['POST'])
def book():
    data = request.json
    name = data.get('name')
    date = data.get('date')
    time = data.get('time')
    reason = data.get('reason', 'General consultation')
    specialist = data.get('specialist', 'General Practitioner')

    if not name or not date or not time:
        return jsonify({"error": "Missing data"}), 400

    result = DatabaseManager.book_appointment(name, date, time, reason, specialist)
    return jsonify({"message": result})


@app.route('/api/appointments/slots', methods=['GET'])
def slots():
    date = request.args.get('date')
    if not date:
        return jsonify({"error": "Date required"}), 400
    return jsonify({"slots": DatabaseManager.get_available_slots(date)})


if __name__ == '__main__':
    print("🚀 Medical Chatbot API running at http://localhost:5001")
    app.run(host="0.0.0.0", port=5001, debug=True)
