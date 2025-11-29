# chatbot.py
import json
import random
import pickle
from pathlib import Path
from datetime import datetime
import nltk
from nltk.stem import WordNetLemmatizer

# -----------------------------
# Paths
# -----------------------------
BASE = Path(__file__).parent
MODEL_PATH = BASE / "healthmate_model.pkl"
INTENTS_PATH = BASE / "intents.json"
LOG_PATH = BASE / "logs.txt"

# -----------------------------
# Load model + data
# -----------------------------
pipeline = pickle.load(open(MODEL_PATH, "rb"))

with open(INTENTS_PATH, "r", encoding="utf-8") as f:
    intents = json.load(f)

lemmatizer = WordNetLemmatizer()

# -----------------------------
# Helper functions
# -----------------------------
def preprocess(text: str) -> str:
    tokens = nltk.word_tokenize(text.lower())
    lemmas = [lemmatizer.lemmatize(t) for t in tokens if t.isalnum()]
    return " ".join(lemmas)

def get_response(message: str, threshold: float = 0.1):
    msg_proc = preprocess(message)
    probs = pipeline.predict_proba([msg_proc])[0]
    idx = probs.argmax()
    confidence = probs[idx]
    predicted_tag = pipeline.classes_[idx]

    print(f"[DEBUG] Input: {message}")
    print(f"[DEBUG] Processed: {msg_proc}")
    print(f"[DEBUG] Predicted tag: {predicted_tag}")
    print(f"[DEBUG] Confidence: {confidence:.3f}")

    # low confidence -> fallback
    if confidence < threshold:
        return "I'm sorry — I didn't understand that. Could you rephrase or provide more details?"

    for intent in intents["intents"]:
        if intent["tag"] == predicted_tag:
            return random.choice(intent["responses"])

    return "Sorry, something went wrong."

def log_conversation(user_msg, bot_msg):
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(f"{datetime.now().isoformat()} USER: {user_msg}\n")
        f.write(f"{datetime.now().isoformat()} BOT: {bot_msg}\n")
        f.write("-" * 50 + "\n")

# -----------------------------
# Main Chat Loop
# -----------------------------
def main():
    print("🤖 HealthMate: Hello! I’m HealthMate — your AI medical assistant. Type 'quit' to exit.\n")
    while True:
        user_input = input("You: ").strip()
        if user_input.lower() in ("quit", "exit", "bye"):
            print("HealthMate: Goodbye! Take care of your health.")
            break

        bot_reply = get_response(user_input)
        print("HealthMate:", bot_reply, "\n")
        log_conversation(user_input, bot_reply)

if __name__ == "__main__":
    main()
