import http.server
import socketserver
import json
import os
import random

PORT = 8000
# Reference paths relative to the script location
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)
SITE_DIR = os.path.join(REPO_ROOT, "site")
DATA_FILE = os.path.join(REPO_ROOT, "data", "replies.json")

class QuantumBotHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Point the default file server to serve assets straight out of the site folder
        super().__init__(*args, directory=SITE_DIR, **kwargs)

    def do_POST(self):
        if self.path == '/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_json = json.loads(post_data.decode('utf-8'))
            user_input = request_json.get("message", "").strip().lower()
            
            # Collapse the quantum logic statement
            reply = self.resolve_quantum_state(user_input)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            
            response = {"reply": reply}
            self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_error(404, "Endpoint not found")

    def resolve_quantum_state(self, user_input):
        # Load the dynamic reply database on every call to support live modifications
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                replies_bank = json.load(f)
        except Exception:
            return "Error: Unable to verify repository data context bank."

        if user_input in replies_bank:
            options = replies_bank[user_input]
            return random.choice(options)
        
        return "No entangled reply found for that input yet — still in an undefined state."

if __name__ == "__main__":
    print(f"Initializing connection layout...")
    print(f"Mapping interface vector to root: {SITE_DIR}")
    print(f"Anchoring data target to stream: {DATA_FILE}")
    
    # Change directory context so handler cleanly binds path maps
    os.chdir(SITE_DIR)
    
    with socketserver.TCPServer(("", PORT), QuantumBotHandler) as httpd:
        print(f"🟢 Quantum Bot Engine Live at: http://localhost:{PORT}")
        print("Press Ctrl+C to disconnect state variables safely.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down engine loop gracefully.")
