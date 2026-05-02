# AI Assistant Web Application

A modern, professional web application for an AI Chatbot, built using Python Flask and the Google Gemini API. It features a clean, dark-mode UI inspired by ChatGPT.

## Features

- **Modern Web Interface**: Clean dark-mode design with smooth animations.
- **Responsive Layout**: Works perfectly on both Desktop and Mobile devices.
- **Smart Chatting**: Fast responses for basic intents (hello, thanks, bye) and intelligent reasoning powered by Google Gemini 2.5 Flash for complex questions.
- **Typing Indicator**: Animated "Bot is thinking..." dots while waiting for the AI.
- **Chat History**: Automatically saves your conversation to the browser's local storage so you don't lose it if you refresh the page.
- **Markdown Support**: The AI's code blocks and text formatting are beautifully rendered.
- **Copy to Clipboard**: Easily copy the AI's responses with a single click.

## How to Run Locally on Windows

Follow these beginner-friendly steps to run your own AI Assistant:

1. **Open your Terminal/Command Prompt**
   Navigate to the project folder (`My-project`).

2. **Set up the Environment File**
   Ensure you have a `.env` file in the root folder containing your Gemini API key:
   ```text
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Install the Required Packages**
   Run the following command to install Flask and the Google GenAI library:
   ```bash
   python -m pip install -r requirements.txt
   ```

4. **Start the Web Server**
   Run the Flask application:
   ```bash
   python app.py
   ```

5. **Open in your Browser**
   Once the server starts, you'll see a message saying `Running on http://127.0.0.1:5000`. 
   Open your web browser (Chrome, Edge, Firefox) and go to:
   **http://localhost:5000**

6. **Start Chatting!**
   You can now chat with your AI assistant using the beautiful web interface!
