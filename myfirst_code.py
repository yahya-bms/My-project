import random
import string
import google.generativeai as genai

client = OpenAI(api_key="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")
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
    "your name": ["your fucking name"],
    "joke" : ["joke", "tell me a joke"],
    "nice to meet you": ["nice to meet you", "pleased to meet you"]
}

while True:
    user=input("you : ").lower()
    user = user.translate(str.maketrans('', '', string.punctuation))
    replied = False  # track if we answered
    for intent, phrases in intents.items():
        for phrase in phrases:
            if phrase in user :
                print("Bot : ",random.choice(responses[intent]))
                replied= True
                if intent == "bye":
                 exit()
                break
    if not replied:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are a friendly chatbot."},
                {"role": "user", "content": user}
            ]
        )

        print("Bot:", response.choices[0].message.content)

