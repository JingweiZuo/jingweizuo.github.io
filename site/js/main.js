/* ============================================================
   Jingwei Zuo — Personal Academic Website
   JavaScript: Mobile nav, news expand, project cards, BibTeX, scroll spy
   No dependencies.
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. Mobile Navigation Toggle
     ---------------------------------------------------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile nav on link click
    var links = navLinks.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  /* ----------------------------------------------------------
     2. News Expand / Collapse
     ---------------------------------------------------------- */
  var newsBtn = document.querySelector('.news-toggle');

  if (newsBtn) {
    // Capture the initially-hidden items so we can re-hide them on collapse.
    var collapsible = document.querySelectorAll('.news-item.hidden');

    newsBtn.addEventListener('click', function () {
      var expanded = newsBtn.getAttribute('aria-expanded') === 'true';

      for (var j = 0; j < collapsible.length; j++) {
        if (expanded) {
          collapsible[j].classList.add('hidden');
        } else {
          collapsible[j].classList.remove('hidden');
        }
      }

      if (expanded) {
        newsBtn.textContent = 'Show older';
        newsBtn.setAttribute('aria-expanded', 'false');
      } else {
        newsBtn.textContent = 'Show less';
        newsBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  /* ----------------------------------------------------------
     3. Project Cards — Render from shared data
     ---------------------------------------------------------- */
  if (window.PROJECTS) {
    var citeSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 17c-2 0-3-1-3-3V9c0-2 1-3 3-3h1l1-2h3L9.5 7H6a1 1 0 0 0-1 1v2h4l-1 3H5v1a1 1 0 0 0 1 1"/><path d="M15 17c-2 0-3-1-3-3V9c0-2 1-3 3-3h1l1-2h3l-1.5 3H15a1 1 0 0 0-1 1v2h4l-1 3h-3v1a1 1 0 0 0 1 1"/></svg>';

    var projectSlots = document.querySelectorAll('[data-project]');
    for (var p = 0; p < projectSlots.length; p++) {
      var slot = projectSlots[p];
      var id = slot.getAttribute('data-project');
      var proj = window.PROJECTS[id];
      if (!proj) continue;

      // Read path prefixes from parent .projects-list container
      var listContainer = slot.closest('.projects-list');
      var imgBase  = listContainer ? (listContainer.getAttribute('data-img-base')  || '') : '';
      var pageBase = listContainer ? (listContainer.getAttribute('data-page-base') || '') : '';

      // Build links HTML
      var linksHtml = '';
      for (var li = 0; li < proj.links.length; li++) {
        linksHtml += '<a href="' + proj.links[li].url + '" class="pill-link" target="_blank" rel="noopener">' + proj.links[li].label + '</a>';
      }
      if (proj.hasCite) {
        linksHtml += '<button class="cite-toggle" aria-expanded="false">' + citeSvg + 'Cite</button>';
      }

      var badgeHtml  = proj.badge ? ' <span class="badge-new">' + proj.badge + '</span>' : '';
      var suffixHtml = proj.titleSuffix || '';

      var article = document.createElement('article');
      article.className = 'project-card';
      article.innerHTML =
        '<div class="project-card-image"><img src="' + imgBase + proj.image + '" alt="' + proj.imageAlt + '"></div>' +
        '<div class="project-card-body">' +
          '<h3 class="project-card-title"><a href="' + pageBase + proj.page + '">' + proj.title + '</a>' + badgeHtml + suffixHtml + '</h3>' +
          '<p class="project-card-desc">' + proj.desc + '</p>' +
          '<div class="project-links">' + linksHtml + '</div>' +
        '</div>' +
        (proj.hasCite ? '<div class="card-bibtex" data-bibtex="' + id + '"></div>' : '');

      slot.replaceWith(article);
    }
  }

  /* ----------------------------------------------------------
     4. BibTeX — Inject from shared data, toggle, copy
     ---------------------------------------------------------- */

  // 4a. Auto-populate [data-bibtex] elements from window.BIBTEX
  if (window.BIBTEX) {
    var slots = document.querySelectorAll('[data-bibtex]');
    for (var b = 0; b < slots.length; b++) {
      var key = slots[b].getAttribute('data-bibtex');
      var entry = window.BIBTEX[key];
      if (!entry) continue;

      // Detect container type to pick the right class names
      var isProjectPage = slots[b].classList.contains('bibtex-block');
      var isPub = slots[b].classList.contains('pub-bibtex');
      var innerClass = isProjectPage ? '' : (isPub ? 'pub-bibtex-inner' : 'card-bibtex-inner');
      var copyClass  = isProjectPage ? 'bibtex-copy' : (isPub ? 'pub-bibtex-copy' : 'card-bibtex-copy');

      if (isProjectPage) {
        // Project detail page: bibtex-block with inline copy button
        slots[b].innerHTML = '<button class="' + copyClass + '">Copy</button><code>' + entry + '</code>';
      } else {
        // Card or publication: inner wrapper
        slots[b].innerHTML = '<div class="' + innerClass + '"><button class="' + copyClass + '">Copy</button><code>' + entry + '</code></div>';
      }
    }
  }

  // 4b. Toggle BibTeX panels
  var citeBtns = document.querySelectorAll('.cite-toggle');
  for (var c = 0; c < citeBtns.length; c++) {
    citeBtns[c].addEventListener('click', function () {
      var parent = this.closest('.project-card') || this.closest('.pub-item');
      if (!parent) return;
      var bib = parent.querySelector('.card-bibtex, .pub-bibtex, .bibtex-block');
      if (!bib) return;
      bib.classList.toggle('open');
      this.setAttribute('aria-expanded', bib.classList.contains('open'));
    });
  }

  // 4c. Copy BibTeX to clipboard
  var copyBtns = document.querySelectorAll('.card-bibtex-copy, .pub-bibtex-copy, .bibtex-copy');
  for (var d = 0; d < copyBtns.length; d++) {
    copyBtns[d].addEventListener('click', function () {
      var code = this.parentElement.querySelector('code') ||
                 this.closest('[data-bibtex]').querySelector('code');
      if (!code) return;
      var btn = this;
      navigator.clipboard.writeText(code.textContent.trim()).then(function () {
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      });
    });
  }

  /* ----------------------------------------------------------
     5. Scroll Spy — Active Nav Link + Navbar Shadow
     ---------------------------------------------------------- */
  var navbar     = document.querySelector('.navbar');
  var sections   = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navAnchors.length) return;

  function onScroll() {
    // Shadow on scroll
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }

    // Determine active section
    var scrollPos = window.scrollY + 120;
    var active = '';

    for (var k = 0; k < sections.length; k++) {
      var top    = sections[k].offsetTop;
      var height = sections[k].offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        active = sections[k].getAttribute('id');
      }
    }

    // Map sub-sections that don't have their own nav link
    // (none in current layout, but keep for future-proofing)

    for (var m = 0; m < navAnchors.length; m++) {
      var href = navAnchors[m].getAttribute('href').substring(1);
      if (href === active) {
        navAnchors[m].classList.add('active');
      } else {
        navAnchors[m].classList.remove('active');
      }
    }
  }

  // Throttle via rAF
  var raf;
  window.addEventListener('scroll', function () {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(onScroll);
  }, { passive: true });

  // Initial run
  onScroll();

})();
