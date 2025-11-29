# train_model.py (improved)
import json, pickle
from pathlib import Path
import nltk
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score, GridSearchCV, train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

nltk.download('punkt', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('omw-1.4', quiet=True)

BASE = Path(__file__).parent
DATA_PATH = BASE / "intents.json"
MODEL_OUT = BASE / "healthmate_model.pkl"

lemmatizer = WordNetLemmatizer()

def preprocess(text: str) -> str:
    tokens = nltk.word_tokenize(text.lower())
    lemmas = [lemmatizer.lemmatize(t) for t in tokens if t.isalnum()]
    return " ".join(lemmas)

def load_data():
    with open(DATA_PATH, encoding='utf-8') as f:
        data = json.load(f)
    X, y = [], []
    for intent in data['intents']:
        tag = intent['tag']
        for pattern in intent['patterns']:
            X.append(preprocess(pattern))
            y.append(tag)
    return X, y

def train_and_evaluate():
    X, y = load_data()
    print(f"Loaded {len(X)} samples, {len(set(y))} classes")

    # split for final test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.10, random_state=42)

    # define pipelines
    pipe_nb = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1,2), max_features=5000)),
        ('clf', MultinomialNB())
    ])
    pipe_lr = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1,2), max_features=5000)),
        ('clf', LogisticRegression(max_iter=200))
    ])

    # quick CV scores
    print("Cross-validating MultinomialNB...")
    scores_nb = cross_val_score(pipe_nb, X_train, y_train, cv=5, scoring='accuracy')
    print("NB CV accuracy:", np.mean(scores_nb), scores_nb)

    print("Cross-validating LogisticRegression...")
    scores_lr = cross_val_score(pipe_lr, X_train, y_train, cv=5, scoring='accuracy')
    print("LR CV accuracy:", np.mean(scores_lr), scores_lr)

    # choose best model (here we prefer LR if it's better)
    chosen = pipe_lr if np.mean(scores_lr) >= np.mean(scores_nb) else pipe_nb
    chosen.fit(X_train, y_train)
    y_pred = chosen.predict(X_test)

    print("\n--- Test set evaluation ---")
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred, zero_division=0))

    # confusion matrix
    labels = sorted(list(set(y)))
    cm = confusion_matrix(y_test, y_pred, labels=labels)
    plt.figure(figsize=(10,8))
    sns.heatmap(cm, annot=True, fmt='d', xticklabels=labels, yticklabels=labels)
    plt.title("Confusion Matrix")
    plt.ylabel("True")
    plt.xlabel("Predicted")
    plt.tight_layout()
    plt.show()

    # save the chosen pipeline
    with open(MODEL_OUT, 'wb') as f:
        pickle.dump(chosen, f)
    print("Saved model to", MODEL_OUT)

if __name__ == "__main__":
    train_and_evaluate()
