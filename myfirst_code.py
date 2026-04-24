import random
import string
from google import genai
import os
import re

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

responses={
    "hello":["Hii!","hey there!","hello motherfucker!"],
    "bye":["Goodbye","See you!"],
    "how are you":["I'm doing great!", "All good here!"],
    "thanks": ["You're welcome!", "No problem!", "Anytime!"],
    "joke": ["Haha funny!", "I'm a chatbot, not a comedian 😄"],
    "your name": ["I'm your Python bot!"], 
    "nice to meet you":["nice to meet you too!","it's a pleasure to know you!"]
}
#to understand the message more 
intents = {
    "hello": ["hello", "hi", "hey", "hey there", "yo", "hi bro", "heyy"],
    "bye": ["bye", "goodbye", "see you", "see ya"],
    "how are you": ["how are you", "how you doing", "how is it going"],
    "thanks": ["thanks", "thank you", "thx"],
    "your name": ["what is your name","your fucking name"],
    "joke" : ["joke", "tell me a joke"],
    "nice to meet you": ["nice to meet you", "pleased to meet you"]
}

while True:
    user=input("you : ").lower()
    user = user.translate(str.maketrans('', '', string.punctuation))
    replied = False  # track if we answered
    for intent, phrases in intents.items():
        for phrase in phrases:
            if re.search(r'\b' + re.escape(phrase) + r'\b', user): 
                print("Bot : ",random.choice(responses[intent]))
                replied= True
                if intent == "bye":
                 exit()
                break
    if not replied:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user 
        )

        print("Bot:", response.text)
