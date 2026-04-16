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
    else:
        print("Bot : i don't understand")
