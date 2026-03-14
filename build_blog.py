#!/usr/bin/env python3
"""Build blog posts from Markdown sources with LaTeX math support.

Usage:
    pip install markdown pyyaml pygments   # one-time setup
    python build_blog.py                    # build all posts
"""

import datetime
import re
from pathlib import Path

import markdown
import yaml

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent
POSTS_DIR = ROOT / "blog" / "posts"
OUTPUT_DIR = ROOT / "blog"
CSS_DIR = ROOT / "css"

# ---------------------------------------------------------------------------
# Templates
# ---------------------------------------------------------------------------

POST_TEMPLATE = """\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} — Jingwei Zuo</title>
  <meta name="description" content="{summary}">

  <meta property="og:title" content="{title} — Jingwei Zuo">
  <meta property="og:description" content="{summary}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://www.jingweizuo.com/blog/{slug}.html">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Inter:wght@300;400;450;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/pygments.css">

  <!-- KaTeX -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/contrib/auto-render.min.js"
    onload="renderMathInElement(document.body, {{
      delimiters: [
        {{left: '$$', right: '$$', display: true}},
        {{left: '$', right: '$', display: false}}
      ],
      throwOnError: false
    }});"></script>
</head>
<body>

  <!-- Navigation -->
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="nav-inner">
      <a href="../index.html" class="nav-brand">Jingwei Zuo</a>
      <a href="index.html" class="nav-back">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round"
             stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        All Posts
      </a>
    </div>
  </nav>

  <!-- Sticky title bar (shown by blog.js on scroll) -->
  <div class="sticky-title-bar" aria-hidden="true">
    <div class="sticky-title-inner">
      <span class="sticky-title-text">{title}</span>
    </div>
    <div class="reading-progress-bar"></div>
  </div>

  <main>
    <article class="project-page blog-post">
      <div class="container">

        <!-- Table of Contents sidebar (populated by blog.js) -->
        <nav class="blog-toc" aria-label="Table of contents"></nav>

        <div class="blog-post-header">
          <h1>{title}</h1>
          <div class="blog-post-meta">
            <time datetime="{date_iso}">{date_formatted}</time>
            {tags_html}
          </div>
        </div>

        <hr class="project-divider">

        <div class="project-section blog-content">
          {content_html}
        </div>

        <hr class="project-divider">

        <!-- Comments (giscus) -->
        <section class="blog-comments" id="comments">
          <h2 class="comments-heading">Comments</h2>
          <script src="https://giscus.app/client.js"
            data-repo="JingweiZuo/jingweizuo.github.io"
            data-repo-id="MDEwOlJlcG9zaXRvcnkxNTAxNzg1NzI="
            data-category="General"
            data-category-id="DIC_kwDOCPOLDM4C4V3G"
            data-mapping="pathname"
            data-strict="0"
            data-reactions-enabled="1"
            data-emit-metadata="0"
            data-input-position="top"
            data-theme="light"
            data-lang="en"
            data-loading="lazy"
            crossorigin="anonymous"
            async>
          </script>
        </section>

      </div>
    </article>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2026 Jingwei Zuo. All rights reserved.</p>
    </div>
  </footer>

  <script defer src="../js/blog.js"></script>
</body>
</html>
"""

LISTING_TEMPLATE = """\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog — Jingwei Zuo</title>
  <meta name="description" content="Blog posts by Jingwei Zuo on LLMs, hybrid architectures, and AI research.">

  <meta property="og:title" content="Blog — Jingwei Zuo">
  <meta property="og:description" content="Blog posts by Jingwei Zuo on LLMs, hybrid architectures, and AI research.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.jingweizuo.com/blog/">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Inter:wght@300;400;450;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="../css/style.css">
</head>
<body>

  <!-- Navigation -->
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="nav-inner">
      <a href="../index.html" class="nav-brand">Jingwei Zuo</a>
      <a href="../index.html" class="nav-back">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round"
             stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Home
      </a>
    </div>
  </nav>

  <main>
    <section class="projects-page blog-listing">
      <div class="container">
        <h1 class="section-heading projects-page-heading">Blog</h1>
        <div class="blog-posts-list">
          {posts_cards_html}
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2026 Jingwei Zuo. All rights reserved.</p>
    </div>
  </footer>

</body>
</html>
"""

CARD_TEMPLATE = """\
          <article class="blog-card">
            <a href="{slug}.html" class="blog-card-link">
              <div class="blog-card-body">
                <time datetime="{date_iso}" class="blog-card-date">{date_formatted}</time>
                <h2 class="blog-card-title">{title}</h2>
                <p class="blog-card-summary">{summary}</p>
                <div class="blog-card-tags">
                  {tags_html}
                </div>
              </div>
            </a>
          </article>
"""

# ---------------------------------------------------------------------------
# Math protection
# ---------------------------------------------------------------------------

def protect_math(text):
    """Replace math delimiters with placeholders before Markdown processing.

    This prevents the Markdown parser from interpreting LaTeX underscores,
    braces, asterisks, etc. as Markdown formatting.

    Placeholders use only alphanumeric chars to survive HTML escaping.
    """
    math_blocks = []

    # First, protect fenced code blocks so we don't touch math inside them
    code_blocks = []

    def stash_code(m):
        idx = len(code_blocks)
        code_blocks.append(m.group(0))
        return f"\n\nCODEPLACEHOLDER{idx}ENDCODE\n\n"

    text = re.sub(r"```.*?```", stash_code, text, flags=re.DOTALL)

    # Protect display math ($$...$$)
    def stash_display(m):
        idx = len(math_blocks)
        math_blocks.append(("display", m.group(1)))
        return f"\n\nMATHBLOCK{idx}ENDMATH\n\n"

    text = re.sub(r"\$\$(.*?)\$\$", stash_display, text, flags=re.DOTALL)

    # Protect inline math ($...$) — single line, not inside backticks
    def stash_inline(m):
        idx = len(math_blocks)
        math_blocks.append(("inline", m.group(1)))
        return f"MATHINLINE{idx}ENDMATH"

    text = re.sub(r"(?<!\\)\$(?!\$)(.+?)(?<!\\)\$", stash_inline, text)

    # Restore code blocks (Markdown will handle them)
    for i, code in enumerate(code_blocks):
        text = text.replace(f"CODEPLACEHOLDER{i}ENDCODE", code)

    return text, math_blocks


def restore_math(html, math_blocks):
    """Replace placeholders with math markup after Markdown conversion."""
    for i, (kind, expr) in enumerate(math_blocks):
        if kind == "display":
            replacement = f'<div class="math-display">$${expr}$$</div>'
            # Handle both bare and <p>-wrapped placeholders
            html = html.replace(
                f"<p>MATHBLOCK{i}ENDMATH</p>", replacement
            )
            html = html.replace(f"MATHBLOCK{i}ENDMATH", replacement)
        else:
            html = html.replace(
                f"MATHINLINE{i}ENDMATH",
                f'<span class="math-inline">${expr}$</span>',
            )
    return html


# ---------------------------------------------------------------------------
# Heading IDs
# ---------------------------------------------------------------------------

def _slugify_heading(text):
    """Slugify heading plain text for use as an HTML id."""
    text = re.sub(r"<[^>]+>", "", text)  # strip HTML tags
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"\s+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")


def add_heading_ids(html):
    """Add id attributes to h2/h3 elements that lack them."""
    used = {}

    def _replace(m):
        tag, attrs, content, closing = m.group(1), m.group(2), m.group(3), m.group(4)
        if 'id="' in attrs:
            return m.group(0)
        slug = _slugify_heading(content) or "section"
        final = slug
        counter = 1
        while final in used:
            final = f"{slug}-{counter}"
            counter += 1
        used[final] = True
        return f"<{tag}{attrs} id=\"{final}\">{content}</{closing}>"

    return re.sub(r"<(h[23])([^>]*)>(.*?)</(h[23])>", _replace, html)


# ---------------------------------------------------------------------------
# Frontmatter
# ---------------------------------------------------------------------------

def parse_frontmatter(text):
    """Split YAML frontmatter from the Markdown body."""
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)", text, re.DOTALL)
    if not m:
        raise ValueError("No YAML frontmatter found")
    meta = yaml.safe_load(m.group(1))
    body = m.group(2)
    return meta, body


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slug_from_filename(filename):
    """'2026-03-13-attention-math.md' -> 'attention-math'"""
    name = Path(filename).stem
    return re.sub(r"^\d{4}-\d{2}-\d{2}-", "", name)


def format_date(d):
    """date(2026, 3, 13) -> 'March 13, 2026'"""
    return d.strftime("%B %-d, %Y")


def build_tags_html(tags):
    return " ".join(f'<span class="blog-tag">{t}</span>' for t in tags)


def md_to_html(text):
    """Convert Markdown text to HTML."""
    return markdown.markdown(
        text,
        extensions=["fenced_code", "codehilite", "tables", "smarty"],
        extension_configs={
            "codehilite": {
                "css_class": "highlight",
                "use_pygments": True,
                "noclasses": False,
                "guess_lang": False,
            }
        },
    )


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    OUTPUT_DIR.mkdir(exist_ok=True)
    (OUTPUT_DIR / "images").mkdir(exist_ok=True)

    # Collect posts
    md_files = sorted(POSTS_DIR.glob("*.md"))
    if not md_files:
        print("No .md files found in blog/posts/")
        return

    posts = []
    for md_file in md_files:
        raw = md_file.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(raw)

        # Protect math, convert, restore
        body_protected, math_blocks = protect_math(body)
        content_html = md_to_html(body_protected)
        content_html = restore_math(content_html, math_blocks)
        content_html = add_heading_ids(content_html)

        date_obj = meta["date"]
        if isinstance(date_obj, str):
            date_obj = datetime.date.fromisoformat(date_obj)

        slug = slug_from_filename(md_file.name)

        posts.append({
            "title": meta["title"],
            "date": date_obj,
            "date_iso": date_obj.isoformat(),
            "date_formatted": format_date(date_obj),
            "summary": meta.get("summary", ""),
            "tags": meta.get("tags", []),
            "slug": slug,
            "content_html": content_html,
        })

    # Sort newest first
    posts.sort(key=lambda p: p["date"], reverse=True)

    # Generate individual post pages
    for post in posts:
        html = POST_TEMPLATE.format(
            title=post["title"],
            summary=post["summary"],
            slug=post["slug"],
            date_iso=post["date_iso"],
            date_formatted=post["date_formatted"],
            tags_html=build_tags_html(post["tags"]),
            content_html=post["content_html"],
        )
        out_path = OUTPUT_DIR / f"{post['slug']}.html"
        out_path.write_text(html, encoding="utf-8")
        print(f"  Built: {out_path}")

    # Generate listing page
    cards_html = ""
    for post in posts:
        cards_html += CARD_TEMPLATE.format(
            slug=post["slug"],
            date_iso=post["date_iso"],
            date_formatted=post["date_formatted"],
            title=post["title"],
            summary=post["summary"],
            tags_html=build_tags_html(post["tags"]),
        )

    listing_html = LISTING_TEMPLATE.format(posts_cards_html=cards_html)
    listing_path = OUTPUT_DIR / "index.html"
    listing_path.write_text(listing_html, encoding="utf-8")
    print(f"  Built: {listing_path}")

    # Generate Pygments CSS for syntax highlighting
    from pygments.formatters import HtmlFormatter

    pygments_css = HtmlFormatter(style="default").get_style_defs(".highlight")
    css_path = CSS_DIR / "pygments.css"
    css_path.write_text(pygments_css, encoding="utf-8")
    print(f"  Built: {css_path}")

    print(f"\nDone! {len(posts)} post(s) built.")


if __name__ == "__main__":
    main()
