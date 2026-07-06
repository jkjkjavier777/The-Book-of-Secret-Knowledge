# The-Book-of-Secret-Knowledge

<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>The Book of Secret Knowledge — Shared Study</title>
<style>
  @page { size: Letter; margin: 1in; }
  html,body{margin:0;padding:0;background:#f3f2ef;font-family:Georgia,serif;color:#111;}
  .book{max-width:816px;margin:20px auto;background:#fff;padding:48px;box-shadow:0 8px 24px rgba(0,0,0,.06);}
  header.cover{text-align:center;border-bottom:1px solid #eee;padding-bottom:28px}
  header.cover h1{font-size:40px;margin:6px 0}
  header.cover p{color:#666;margin:6px 0}
  nav.toc{background:#fbfbfb;border:1px solid #eee;padding:14px;margin:20px 0}
  nav.toc a{color:#0b63a8;text-decoration:none}
  .page{page-break-after:always}
  .epigraph{font-style:italic;color:#444;border-left:3px solid #eee;padding-left:12px;margin:12px 0}
  h3.chapter-title{font-size:20px;margin:12px 0 6px 0}
  .summary{font-weight:600;color:#333;margin-bottom:12px}
  .section{line-height:1.6;margin:10px 0}
  .note{background:#fffbe6;border-left:4px solid #ffd24d;padding:10px;margin:12px 0;color:#5a4a00}
  footer{font-size:12px;color:#888;text-align:center;margin-top:28px}
  @media print{.book{box-shadow:none;margin:0;padding:.75in}}
</style>
</head>
<body>
  <div class="book" role="main">
    <header class="cover" id="cover">
      <h1>The Book of Secret Knowledge</h1>
      <p>A Shared Study — Repository Edition</p>
      <p>Curated notes, chapter guides, and collaborative annotations.</p>
    </header>

    <section class="page" id="front-matter">
      <nav class="toc" aria-label="Table of contents">
        <strong>Table of Contents</strong>
        <ul>
          <li><a href="#preface">Preface</a></li>
          <li><a href="#how-to-use">How to Use This Book</a></li>
          <li><a href="#chapter-1">Chapter 1 Introduction</a></li>
          <li><a href="#chapter-2">Chapter 2 Foundations</a></li>
          <li><a href="#appendix">Appendix</a></li>
        </ul>
      </nav>

      <article id="preface">
        <h3 class="chapter-title">Preface</h3>
        <p class="summary">Purpose and collaborative workflow for this shared study.</p>
        <div class="section">This repository is structured to read like a single scrollable book. Use the chapters folder for modular edits and /notes for session logs.</div>
      </article>
    </section>

    <section class="page" id="chapter-1">
      <h3 class="chapter-title">Chapter 1 Introduction to the Secret Knowledge</h3>
      <div class="epigraph">To know is to begin; to practice is to become.</div>
      <p class="summary">Central themes and study questions.</p>
      <div class="section">
        <h4>Origins and Context</h4>
        <p>Extract practical methods and modern applications from the text.</p>
        <div class="note"><strong>Note:</strong> Add unfamiliar terms to the glossary file.</div>
      </div>
    </section>

    <section class="page" id="appendix">
      <h3 class="chapter-title">Appendix Glossary Contributors</h3>
      <div class="section">Maintain glossary in /appendix/glossary.md. Contributors listed in CONTRIBUTORS.md.</div>
      <footer>MIT License • Maintainers: add names • Contact: open an issue</footer>
    </section>
  </div>
</body>
</html>

#!/usr/bin/env python3
from pathlib import Path
from weasyprint import HTML
import sys

def render(input_html='book_readme.html', output_pdf='The-Book-of-Secret-Knowledge_Letter.pdf'):
    html = Path(input_html)
    if not html.exists():
        raise SystemExit(f"Input file not found: {html}")
    HTML(filename=str(html)).write_pdf(output_pdf)
    print(f"Saved PDF: {output_pdf}")

if __name__ == '__main__':
    if len(sys.argv) >= 3:
        render(sys.argv[1], sys.argv[2])
    elif len(sys.argv) == 2:
        render(sys.argv[1])
    else:
        render()