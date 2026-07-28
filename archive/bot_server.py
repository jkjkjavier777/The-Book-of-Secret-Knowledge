# bot_server.py
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import datetime

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Ritual responses (simple prototype)
def ritual_response(trigger, content):
    now = datetime.datetime.now()
    if trigger == "dawn":
        return f"🌅 At dawn, the book whispers: '{content}'"
    elif trigger == "storm":
        return f"⛈️ In storm, paradox emerges: '{content[::-1]}'"
    elif trigger == "night":
        return f"🌙 At night, memory fades: '{content.upper()}'"
    else:
        return f"✨ The book reflects: '{content}'"

@app.route("/ritual", methods=["POST"])
def ritual():
    data = request.json
    trigger = data.get("trigger", "default")
    content = data.get("content", "")
    response = ritual_response(trigger, content)
    return jsonify({"response": response})

@socketio.on("ritual_event")
def handle_ritual_event(data):
    trigger = data.get("trigger", "default")
    content = data.get("content", "")
    response = ritual_response(trigger, content)
    emit("ritual_response", {"response": response})

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
