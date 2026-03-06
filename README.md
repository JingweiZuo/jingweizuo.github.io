# jingweizuo.com

Personal academic website for Jingwei Zuo, Principal Researcher at TII.

Static HTML + CSS + JS. No build tools. No frameworks.

## Local Preview

Open `index.html` in any browser — no server required.

Or use a local server for proper path resolution:

```bash
# Python
cd site && python3 -m http.server 8000

# Node
npx serve site
```

## How to Edit

### Update bio or personal info
Edit the `<section id="about">` block in `index.html`.

### Add a project

1. **All-projects page:** Add a new `<article class="project-card">` inside `.projects-list` in `projects/index.html`. Follow the existing pattern (image left, text right, pill links).
2. **Homepage (optional):** If the project should be featured on the homepage, also add a card to `index.html`. The homepage shows only a curated subset; the full list lives at `projects/index.html`.
3. **Project page:** Copy `projects/falcon-h1.html` as a template. Replace the title, authors, venue, links, summary, figures, highlights, and BibTeX.
4. **Image:** Add an 800×400 hero image to `images/projects/` and reference it in both the card and the project page.

### Add a publication

1. Find the correct year group in `<section id="publications">` in `index.html`.
2. Add a new `.pub-item` div following the existing format.
3. If the year doesn't exist yet, add a new `.publications-year` block.

### Add a news item

1. Add a new `.news-item` div at the **top** of `.news-list` in `index.html`.
2. The first 5 items are visible; items beyond that need the `hidden` class.
3. Add `<span class="badge-new">NEW</span>` for recent items.

### Replace placeholder images

Each placeholder is a `<div class="placeholder-img">` with a gradient background and an HTML comment above it indicating the source URL. Replace with:

```html
<img src="images/projects/falcon-h1.png" alt="Falcon-H1 architecture diagram">
```

The avatar placeholder in the hero section should be replaced similarly:

```html
<img src="images/avatar.jpg" alt="Jingwei Zuo">
```

(Remove the `<span class="initials">JZ</span>` when replacing.)

## Deploy

### GitHub Pages
Push to a repo named `jingweizuo.github.io`. The `CNAME` file handles the custom domain. The `.nojekyll` file disables Jekyll processing.

### Netlify
Connect the repo to Netlify. Set publish directory to `site/` (or root if files are moved up). No build command needed.

## Structure

```
site/
├── index.html              ← Homepage (6 sections, 4 featured projects)
├── projects/
│   ├── index.html          ← All-projects listing page (7 projects)
│   ├── falcon-h1.html      ← Fully built project page (template)
│   ├── falcon-h1-tiny.html ← Skeleton
│   ├── falcon-edge.html    ← Skeleton
│   ├── falcon-3.html       ← Skeleton
│   ├── falcon-mamba.html   ← Skeleton
│   ├── learnable-multiplier.html ← Skeleton
│   └── e2lm.html           ← Skeleton
├── css/style.css           ← All styles
├── js/main.js              ← Nav toggle, news expand, scroll spy
├── images/
│   ├── avatar.jpg          ← Replace with headshot
│   └── projects/           ← Project hero images (800×400)
├── posts/                  ← PDFs or documents
├── CNAME                   ← www.jingweizuo.com
├── .nojekyll
└── README.md
```
