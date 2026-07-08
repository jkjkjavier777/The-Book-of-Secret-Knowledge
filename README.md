# quantum-chatbot-replies

Playful "quantum computer" persona replies for small talk — superposition
setup → collapse → one concrete answer.

## Structure

| Path | Purpose |
|------|---------|
| `data/replies.json` | Bank of inputs → reply variants |
| `bot.js` | Collapse logic — picks a random reply (Node/CLI) |
| `site/index.html` | Same logic, running in-browser via GitHub Pages |
| `docs/README_legacy.md` | Earlier version of this README, kept for reference |

## Usage
```bash
node bot.js "how are you?"
```

## Adding inputs
Add a lowercase key to `replies.json` with 2–4 variants.

## Publish
```bash
git init && git add . && git commit -m "Initial reply bank"
git branch -M main && git remote add origin <repo-url> && git push -u origin main
```

## 📂 Folder Structure
```
📁 docs/           → HOW_TO_OPEN.md
📁 book/           → book_readme.html
📁 scripts/        → render_book.py
📁 site/           → index.html, gallery.html
📁 _quarantine/    → token_flood_artwork.png, PR body.txt (needs manual review)
📄 README.md       → stays at repo root
```

## Issues → Commits
How a change should flow through the repo:

1. **Open an issue** describing the fix or addition (e.g. "reply bank missing 'good morning'").
2. **Reference it in the commit** — `git commit -m "Add greeting replies, closes #4"`. The `closes #4` auto-closes the issue when merged.
3. **One issue, one focused commit** where possible — makes it easy to trace *why* a file changed later.
4. **PRs for anything touching `_quarantine/`** — don't commit those files straight to `main` until they've been reviewed.
