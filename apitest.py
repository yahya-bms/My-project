from google import genai

client=genai.Client(api_key="AIzaSyAL_Qqt1PeLeCeQhD4rU5syY1QoTR57wc0")


response =client.models.generate_content(model="gemini-2.5-flash",contents="Hello, how are you?")

print(response.text)