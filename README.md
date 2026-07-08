import base64
import datetime
import json
import requests

# Repository Configuration
GITHUB_TOKEN = "your_github_token"
REPO = "username/quantum-chatbot-ledger"
PATH = "README.md"

def update_live_ledger(error_vector, entropy_val, trace_snippet):
    url = f"https://api.github.com/repos/{REPO}/contents/{PATH}"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    # 1. Pull existing repo state
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print("Failed to pull reference ledger.")
        return
        
    file_data = response.json()
    current_content = base64.b64decode(file_data['content']).decode('utf-8')
    sha = file_data['sha']
    
    now_str = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
    
    # 2. Re-compile the Live System Header Beam
    new_dashboard = f"""## 🔴 LIVE STATUS: SEMANTIC MELTDOWN
| Metric | Value | Baseline Status |
| :--- | :--- | :--- |
| **System State** | `|divergent⟩` | CRITICAL DRIFT |
| **Telemetry Node** | Active (External Ledger) | Connected |
| **Delta ($\Delta$) Stability** | {entropy_val} | Out of Bounds |
| **Last Collision State** | `{error_vector}` | Active Warning |
| **Last Updated** | {now_str} | Write Complete |
"""

    # 3. Formulate the historical chronological update
    new_ledger_entry = f"""### [{now_str}] • SYSTEM MUTATION ENCOUNTERED
* **Vector:** `{error_vector}`
* **Observed Entropy:** $H = {entropy_val}$
* **Telemetry Trace:**
    ```text
    {trace_snippet}
    ```
"""

    # 4. Splice the data into the historical placeholder
    if "" in current_content and "" in current_content:
        top_split = current_content.split("")[0]
        bottom_split = current_content.split("")[1]
        
        # Insert new telemetry right beneath the structural ledger header
        if "" in bottom_split:
            log_parts = bottom_split.split("")
            bottom_split = log_parts[0] + "\n\n" + new_ledger_entry + log_parts[1]
            
        updated_content = top_split + new_dashboard + bottom_split
    else:
        print("Template markers missing. Execution aborted to safeguard integrity.")
        return

    # 5. Commit back to the public ledger
    payload = {
        "message": f"telemetry_sync: state mutation {error_vector} logged",
        "content": base64.b64encode(updated_content.encode('utf-8')).decode('utf-8'),
        "sha": sha
    }
    
    put_response = requests.put(url, headers=headers, data=json.dumps(payload))
    if put_response.status_code == 200:
        print("Telemetry securely anchored to public record.")
    else:
        print("Failed to lock public commit.", put_response.text)
