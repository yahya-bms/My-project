import os
import random
import string
import re
from flask import Flask, render_template, request, jsonify
from google import genai
from dotenv import load_dotenv

load_dotenv('.env')

app = Flask(__name__)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Professional responses
responses = {
    "hello": ["Hello!", "Hi there!", "Greetings! How can I help you today?"],
    "bye": ["Goodbye!", "See you later!", "Have a great day!"],
    "how are you": ["I'm functioning perfectly, thank you!", "I'm doing great! How about you?"],
    "thanks": ["You're very welcome!", "No problem at all!", "Glad I could help!"],
    "joke": ["I'm a professional AI, but here goes: Why do programmers prefer dark mode? Because light attracts bugs! 😄"],
    "your name": ["I am your dedicated AI Assistant!"], 
    "nice to meet you": ["Nice to meet you too!", "It's a pleasure to speak with you!"]
}

# Intent mapping
intents = {
    "hello": ["hello", "hi", "hey", "hey there", "yo", "hi bro", "heyy", "greetings"],
    "bye": ["bye", "goodbye", "see you", "see ya", "farewell"],
    "how are you": ["how are you", "how you doing", "how is it going"],
    "thanks": ["thanks", "thank you", "thx", "appreciate it"],
    "your name": ["what is your name", "your name", "who are you"],
    "joke" : ["joke", "tell me a joke", "make me laugh"],
    "nice to meet you": ["nice to meet you", "pleased to meet you"]
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '').strip()
    
    if not user_message:
        return jsonify({"response": "Please enter a message."})

    # Clean message for intent matching
    cleaned_msg = user_message.lower().translate(str.maketrans('', '', string.punctuation))
    
    # 1. Check Intents (Fast response)
    for intent, phrases in intents.items():
        for phrase in phrases:
            if re.search(r'\b' + re.escape(phrase) + r'\b', cleaned_msg):
                return jsonify({"response": random.choice(responses[intent])})

    # 2. Fallback to Gemini API
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_message 
        )
        return jsonify({"response": response.text})
    except Exception as e:
        print("API Error:", e)
        return jsonify({"response": "Oops! I'm getting too many requests or the API failed. Please wait a moment and try again."})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
