import random
respones={
    "hello":["Hii!","hey there!","hello motherfucker!"],
    "bye":["Goodbye","See you!"]
}


while True:
    user=input("you : ").lower()

    if "hello" in user:
        print("Bot :",random.choice(respones["hello"]))
    elif "bye" in user:
        print("Bot :",random.choice(respones["bye"]))
        break
    elif "how are you" in user:
        print("Bot : i'm doing great!")
    elif "how old are you?" in user :
        print("Bot : I'm a chatbot i don't have an age.")
    else:
        print("Bot : i don't understand")
    
