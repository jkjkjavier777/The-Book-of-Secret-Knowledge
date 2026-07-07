"""
Book of Secret Knowledge — Repo Layout Utility
"""

import os
import sys

RECOMMENDED = """
the-book-of-secret-knowledge/
├── README.md
├── LICENSE.md
├── book_readme.html
├── bot.js
├── package-lock.json
├── list_repo_structure.py
├── data/
│   └── replies.json
├── descriptors/
│   ├── duosx_quantum_circuit.md
│   ├── earth99_descriptor.md
│   └── quantum_descriptor.md
└── static/
    └── img/
"""

def main():
    print(RECOMMENDED)
    if "--apply" in sys.argv:
        for d in ["data", "descriptors", "static/img"]:
            os.makedirs(d, exist_ok=True)
            print(f"Ensured directory exists: {d}")
    else:
        print("(Dry run — pass --apply to create missing folders.)")

if __name__ == "__main__":
    main()