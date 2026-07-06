# The-Book-of-Secret-Knowledge

#!/usr/bin/env python3
"""
Render book_readme.html to a Letter-sized PDF using pdfkit/wkhtmltopdf.
Usage: python render_book_pdfkit.py book_readme.html output_book_letter.pdf
"""
import sys
import pdfkit
from pathlib import Path

def render(input_html: str, output_pdf: str):
    html_path = Path(input_html).resolve()
    if not html_path.exists():
        raise FileNotFoundError(f"Input HTML not found: {html_path}")
    options = {
        'page-size': 'Letter',
        'margin-top': '1in',
        'margin-right': '1in',
        'margin-bottom': '1in',
        'margin-left': '1in',
        'encoding': "UTF-8",
        'enable-local-file-access': None
    }
    pdfkit.from_file(str(html_path), output_pdf, options=options)
    print(f"Rendered PDF saved to: {output_pdf}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python render_book_pdfkit.py book_readme.html output_book_letter.pdf")
        sys.exit(1)
    render(sys.argv[1], sys.argv[2])

#!/usr/bin/env python3
"""
Render book_readme.html to a Letter-sized PDF using WeasyPrint.
Usage: python render_book_weasy.py book_readme.html output_book_letter.pdf
"""
import sys
from pathlib import Path
from weasyprint import HTML, CSS

def render(input_html: str, output_pdf: str):
    html_path = Path(input_html).resolve()
    if not html_path.exists():
        raise FileNotFoundError(f"Input HTML not found: {html_path}")
    # Load HTML and render with default CSS; @page in the HTML sets Letter size
    HTML(filename=str(html_path)).write_pdf(target=output_pdf)
    print(f"Rendered PDF saved to: {output_pdf}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python render_book_weasy.py book_readme.html output_book_letter.pdf")
        sys.exit(1)
    render(sys.argv[1], sys.argv[2])

</div>
</section>

<section class="appendix" id="appendix">
  <h3 class="chapter-title">Appendix — Glossary, Bibliography, Contributors</h3>
  <div class="section">
    <h4>Glossary</h4>
    <p>Maintain the glossary in `/appendix/glossary.md` and link terms inline.</p>

    <h4>Contributors</h4>
    <p>Lead Curator: <strong>name or handle</strong> — Editors: list of contributors.</p>
  </div>

  <footer>
    <div>MIT License • Maintainers: add names • Contact: open an issue</div>
  </footer>
</section>

</div>
</section>

<section class="chapter" id="chapter-3">
  <h3 class="chapter-title">Chapter 3 — Methods and Practices</h3>
  <div class="epigraph">"Practice is the laboratory of truth."</div>
  <p class="summary">Step-by-step methods, exercises, and suggested session plans.</p>

  <div class="section">
    <h4>Exercises</h4>
    <p>Each exercise includes objectives, materials, and a debrief template for group discussion.</p>
    <div class="note"><strong>Action:</strong> Assign exercises to study sessions and log outcomes in `/notes`.</div>

</div>

  <div class="refs">
    <strong>References</strong>
    <ol>
      <li>Primary source edition details.</li>
      <li>Secondary commentary and modern analysis.</li>
    </ol>
  </div>
</section>

<section class="chapter" id="chapter-2">
  <h3 class="chapter-title">Chapter 2 — Foundations and Key Concepts</h3>
  <div class="epigraph">"Foundations are the quiet architecture of practice."</div>
  <p class="summary">Core concepts, definitions, and the glossary entries you should master.</p>

  <div class="section">
    <h4>Core Questions</h4>
    <ul>
      <li>What counts as "secret" in this tradition</li>
      <li>How knowledge is transmitted and preserved</li>
      <li>Practical exercises to test understanding</li>
    </ul>

</div>
</header>

<section class="front-matter" id="front-matter">
  <nav class="toc" aria-label="Table of contents">
    <strong>Table of Contents</strong>
    <ul>
      <li><a href="#preface">Preface</a></li>
      <li><a href="#how-to-use">How to Use This Book</a></li>
      <li><a href="#chapter-1">Chapter 1 — Introduction</a></li>
      <li><a href="#chapter-2">Chapter 2 — Foundations</a></li>
      <li><a href="#chapter-3">Chapter 3 — Methods</a></li>
      <li><a href="#appendix">Appendix & Glossary</a></li>
    </ul>
  </nav>

  <article id="preface" style="margin-top:18px;">
    <h3 class="chapter-title">Preface</h3>
    <p class="summary">Why this shared study exists and how to use the materials collaboratively.</p>
    <div class="section">
      This repository is designed to be read like a book. Each chapter is self-contained and cross-referenced. Use the Table of Contents to jump to sections or read straight through for a linear experience.
    </div>
  </article>

  <article id="how-to-use">
    <h3 class="chapter-title">How to Use This Book</h3>
    <div class="section">
      - Read the master README for the full narrative.  
      - Open `/chapters` for modular chapter files.  
      - Add notes to `/notes` and link them from chapters.  
    </div>
  </article>
</section>

<section class="chapter" id="chapter-1">
  <h3 class="chapter-title">Chapter 1 — Introduction to the Secret Knowledge</h3>
  <div class="epigraph">"To know is to begin; to practice is to become."</div>
  <p class="summary">This chapter introduces central themes and study questions.</p>

  <div class="section">
    <h4>Origins and Context</h4>
    <p>The Book of Secret Knowledge emerges from a lineage of practical manuals and esoteric treatises. Our study focuses on extracting methods that are applicable today.</p>
    <div class="note"><strong>Note:</strong> Keep a running list of unfamiliar terms in the Glossary.</div>

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>The Book of Secret Knowledge — Shared Study</title>
  <style>
    /* Page sizing for print/PDF: US Letter */
    @page {
      size: Letter;
      margin: 1in;
    }

    /* Basic reset */
    html,body{height:100%;margin:0;padding:0;font-family: "Georgia", "Times New Roman", serif;color:#111;background:#f8f7f3;}
    .book { max-width: 816px; margin: 24px auto; background: #fff; box-shadow: 0 8px 30px rgba(0,0,0,0.08); padding: 48px; }
    header.cover { text-align:center; padding: 48px 24px 64px 24px; border-bottom: 1px solid #eee; }
    header.cover h1 { font-size: 44px; margin: 0 0 8px 0; letter-spacing: 1px; }
    header.cover h2 { font-size: 18px; margin: 0; color: #666; font-weight: normal; }

    nav.toc { margin: 28px 0; padding: 18px; background:#fbfbfb; border:1px solid #eee; }
    nav.toc ul { margin:0; padding:0 0 0 18px; }
    nav.toc a { color:#0b63a8; text-decoration:none; }

    .front-matter, .chapter, .appendix { page-break-after: always; }
    .epigraph { font-style: italic; color:#444; margin: 12px 0 18px 0; border-left: 3px solid #eee; padding-left: 12px; }

    h3.chapter-title { font-size: 22px; margin: 18px 0 6px 0; border-bottom: 1px dashed #e6e6e6; padding-bottom: 6px; }
    .summary { font-weight: bold; margin-bottom: 12px; color:#333; }
    .section { margin: 12px 0 22px 0; line-height:1.55; }
    .note { background:#fffbe6; border-left:4px solid #ffd24d; padding:10px 12px; margin:12px 0; color:#5a4a00; }
    .refs { font-size: 13px; color:#444; margin-top:18px; }

    footer { text-align:center; font-size:12px; color:#888; margin-top:36px; }

    /* Small-screen adjustments */
    @media screen and (max-width:900px) {
      .book { margin: 12px; padding: 28px; }
      header.cover h1 { font-size: 34px; }
    }

    /* Print-friendly tweaks */
    @media print {
      body { background: white; }
      .book { box-shadow:none; margin:0; padding: 0.75in; }
      nav.toc { page-break-after: avoid; }
      footer { page-break-before: always; }
    }
  </style>
</head>
<body>
  <div class="book" role="main">
    <header class="cover" id="cover">
      <h1>The Book of Secret Knowledge</h1>
      <h2>A Shared Study — Repository Edition</h2>
      <p style="margin-top:18px;color:#666;">Curated notes, chapter guides, and collaborative annotations for group study.</p>
      <p style="margin-top:28px;color:#999;font-size:13px;">Maintainers • Contributors • License</p>
      <div style="margin-top:18px;">