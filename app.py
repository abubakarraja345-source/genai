from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

genai.configure(api_key="AIzaSyAqU_UICxqf3g_OLrTJNRzxVXyuTLYQTiU")


PERSONALITY_PROMPTS = {
    "friendly": "Respond warmly and supportively.",
    "formal": "Respond politely and professionally.",
    "humorous": "Respond cleverly with light humor.",
    "funny": "Respond with fun humor but still answer clearly."
}

chat_history = {} 

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        message = data.get("message", "")
        personality = data.get("personality", "friendly").lower()
        user_id = data.get("user_id", "default_user")

        if not message:
            return jsonify({"reply": "Please type something."})

        if user_id not in chat_history:
            chat_history[user_id] = []

        chat_history[user_id].append({"role": "user", "content": message})

        history_text = "\n".join(
            f"{msg['role'].capitalize()}: {msg['content']}"
            for msg in chat_history[user_id]
        )

        prompt = f"""
        You are an AI chatbot.
        Personality: {PERSONALITY_PROMPTS.get(personality, "Be helpful and clear.")}

        Here is the conversation so far:
        {history_text}

        Now respond to the last user message in context.
        AI:
        """

        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        reply = response.text.strip() if response.text else "(No response)"

        chat_history[user_id].append({"role": "ai", "content": reply})

        return jsonify({"reply": reply, "history": chat_history[user_id]})

    except Exception as e:
        return jsonify({"reply": f"Error: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True)
