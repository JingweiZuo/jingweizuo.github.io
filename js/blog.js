/* ============================================================
   Blog Post — TOC sidebar, scroll spy, sticky title bar,
   reading progress. No dependencies.
   ============================================================ */

(function () {
  'use strict';

  function init() {
    var blogContent = document.querySelector('.blog-content');
    if (!blogContent) return;

    /* --------------------------------------------------------
       1. Extract headings and ensure IDs
       -------------------------------------------------------- */
    var headings = blogContent.querySelectorAll('h2, h3');
    if (!headings.length) return;

    function slugify(text) {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    var usedIds = {};
    for (var i = 0; i < headings.length; i++) {
      var h = headings[i];
      if (!h.id) {
        var base = slugify(h.textContent) || 'section';
        var id = base;
        var counter = 1;
        while (usedIds[id]) { id = base + '-' + counter; counter++; }
        h.id = id;
      }
      usedIds[h.id] = true;
    }

    /* --------------------------------------------------------
       2. Build TOC
       -------------------------------------------------------- */

    // Get clean text from a heading, stripping KaTeX's hidden MathML layer
    function headingText(el) {
      var clone = el.cloneNode(true);
      var mathml = clone.querySelectorAll('.katex-mathml');
      for (var m = 0; m < mathml.length; m++) mathml[m].remove();
      return clone.textContent.replace(/\s+/g, ' ').trim();
    }

    var tocNav = document.querySelector('.blog-toc');
    var tocAnchors = [];

    if (tocNav) {
      var html = '<div class="blog-toc-title">Contents</div><ol>';
      for (var j = 0; j < headings.length; j++) {
        var level = headings[j].tagName.toLowerCase();
        var text = headingText(headings[j]);
        html += '<li class="toc-' + level + '">';
        html += '<a href="#' + headings[j].id + '" data-target="' + headings[j].id + '">';
        html += text;
        html += '</a></li>';
      }
      html += '</ol>';
      tocNav.innerHTML = html;

      tocAnchors = tocNav.querySelectorAll('a');

      // Smooth scroll on TOC link click
      for (var k = 0; k < tocAnchors.length; k++) {
        tocAnchors[k].addEventListener('click', function (e) {
          e.preventDefault();
          var targetId = this.getAttribute('data-target');
          var target = document.getElementById(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, '', '#' + targetId);
          }
        });
      }
    }

    /* --------------------------------------------------------
       3. References for sticky title + progress
       -------------------------------------------------------- */
    var stickyBar = document.querySelector('.sticky-title-bar');
    var blogHeader = document.querySelector('.blog-post-header');
    var progressBar = document.querySelector('.reading-progress-bar');
    var article = document.querySelector('.blog-post');
    var htmlEl = document.documentElement;

    /* --------------------------------------------------------
       4. Scroll handler — TOC spy + sticky title + progress
       -------------------------------------------------------- */
    var navHeight = 56;
    var stickyH = 40;
    var raf;

    function onScroll() {
      var scrollY = window.scrollY;

      // --- Sticky title bar ---
      if (stickyBar && blogHeader) {
        var headerBottom = blogHeader.offsetTop + blogHeader.offsetHeight;
        if (scrollY > headerBottom) {
          stickyBar.classList.add('visible');
          htmlEl.classList.add('has-sticky-title');
          if (tocNav) tocNav.classList.add('toc-shifted');
        } else {
          stickyBar.classList.remove('visible');
          htmlEl.classList.remove('has-sticky-title');
          if (tocNav) tocNav.classList.remove('toc-shifted');
        }
      }

      // --- Reading progress ---
      if (progressBar && article) {
        var articleTop = article.offsetTop;
        var articleHeight = article.offsetHeight;
        var winH = window.innerHeight;
        var progress = Math.max(0, Math.min(1,
          (scrollY - articleTop) / (articleHeight - winH)
        ));
        progressBar.style.width = (progress * 100) + '%';
      }

      // --- TOC scroll spy ---
      if (!tocAnchors.length) return;

      var spyOffset = scrollY + navHeight + stickyH + 20;
      var activeId = '';

      for (var m = 0; m < headings.length; m++) {
        if (headings[m].offsetTop <= spyOffset) {
          activeId = headings[m].id;
        }
      }

      for (var n = 0; n < tocAnchors.length; n++) {
        if (tocAnchors[n].getAttribute('data-target') === activeId) {
          tocAnchors[n].classList.add('active');
        } else {
          tocAnchors[n].classList.remove('active');
        }
      }
    }

    window.addEventListener('scroll', function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onScroll);
    }, { passive: true });

    window.addEventListener('resize', function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onScroll);
    }, { passive: true });

    // Initial run
    onScroll();

    // Handle URL hash after IDs are assigned
    if (window.location.hash) {
      var hashTarget = document.getElementById(window.location.hash.substring(1));
      if (hashTarget) {
        setTimeout(function () {
          hashTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    }
  }

  // Wait for DOM + KaTeX to finish rendering math in headings
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(init, 100);
    });
  } else {
    setTimeout(init, 100);
  }

})();
