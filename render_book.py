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