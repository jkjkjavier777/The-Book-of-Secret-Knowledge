

Title:  
Add HOWTOOPEN.md guide, epigraph, and README Quick Links

Summary  
Add a short, user‑friendly HOWTOOPEN.md that explains how to open and read The Book of Secret Knowledge on GitHub and locally. Insert the provided epigraph into the front matter of bookreadme.html and update README.md with a Quick Links entry pointing to the new guide. Verify presence and basic compatibility of renderbook.py.

Changes  
- Added HOWTOOPEN.md — step‑by‑step instructions for viewing the book on GitHub and locally.  
- Inserted epigraph into book_readme.html front matter.  
- Updated README.md with Quick Links to HOWTOOPEN.md and gallery.html.  
- Confirmed presence and basic compatibility of render_book.py.

Why this change  
Documentation‑only improvement: helps readers open and read the book, preserves repository structure, and ensures rendering scripts are referenced.

Acceptance criteria  
- HOWTOOPEN.md added to repo root and linked from README.md.  
- Epigraph visible in book_readme.html front matter.  
- bookreadme.html, README.md, and renderbook.py confirmed present and referenced.  
- Maintainer review and merge.

Testing & verification  
- Preview README.md on GitHub to confirm badges, links, and Quick Links render correctly.  
- Open book_readme.html in a browser (locally or via GitHub) to confirm epigraph appears and layout is intact.  
- Run python render_book.py --help locally to confirm script is present and runnable (no functional changes expected).

Notes  
- This PR is documentation‑only and does not modify chapter content.  
- If the gallery requires artwork, upload the image to assets/tokenfloodartwork.png before merging so gallery.html displays correctly.  

Closes: #\<issue‑number\>

---
