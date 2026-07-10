# Update system
sudo apt update && sudo apt upgrade -y

# Install Python + pip + venv if you don't have them
sudo apt install python3 python3-pip python3-venv -y

# Create project folder
mkdir ~/my_chatbot && cd ~/my_chatbot

# Make virtual environment so deps don't conflict
python3 -m venv venv
source venv/bin/activate # You'll need to run this each time you work on it