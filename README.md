quantum-chatbot-ledger/
│
├── 📖 README.md                  # System Archive & Live Monitoring
│
├── 📁 data/                      # Core Document Store
│   └── replies.json              # Structural answers / context mapping
│
├── 📁 site/                      # The User Presentation Layer
│   └── index.html                # Custom user web view (Your Frontend)
│
└── 📁 scripts/                   # The Automation & Execution Layer
    ├── bot_server.py             # <-- RUN THIS SCRIPT to link frontend & backend
    └── monitor.py                # Telemetry sync monitoring tool
