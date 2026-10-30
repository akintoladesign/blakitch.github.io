// Blakitch — motion layer, built on GSAP + ScrollTrigger.
// Everything here is additive: main.js already makes the page fully
// functional without this file, in case GSAP fails to load from
// assets/vendor/gsap/.

(function () {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Web fonts swapping in after ScrollTrigger's initial measurement can
  // reflow text and shift every trigger position below the fold. Refresh
  // once fonts are actually ready, plus a couple of safety-net refreshes
  // for slow connections / older browsers without the Font Loading API.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener('load', () => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 1200);

  /* ---------------------------------------------------------------
     Split hero headline into words for a staggered reveal.
     Runs once on load; skipped entirely if reduced motion is set.
  --------------------------------------------------------------- */
  function splitIntoWords(el) {
    const text = el.textContent.trim();
    el.textContent = '';
    text.split(' ').forEach((word, i, arr) => {
      const span = document.createElement('span');
      span.className = 'split-word';
      span.textContent = word + (i < arr.length - 1 ? '\u00A0' : '');
      el.appendChild(span);
    });
    return el.querySelectorAll('.split-word');
  }

  document.querySelectorAll('[data-split]').forEach((el) => {
    if (reduceMotion) return;
    const words = splitIntoWords(el);
    gsap.set(words, { opacity: 0, y: '0.9em' });
    gsap.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.045,
      delay: 0.15,
    });
  });

  /* ---------------------------------------------------------------
     Generic scroll reveal for anything flagged .reveal
  --------------------------------------------------------------- */
  gsap.utils.toArray('.reveal').forEach((el, i) => {
    if (reduceMotion) {
      el.classList.add('is-visible');
      return;
    }
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => el.classList.add('is-visible'),
      once: true,
    });
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      }
    );
  });

  /* ---------------------------------------------------------------
     Marquee tracks — infinite horizontal loop, GSAP-driven.
     Track markup is duplicated in HTML so -50% is a seamless loop.
  --------------------------------------------------------------- */
  document.querySelectorAll('[data-marquee]').forEach((track) => {
    const speed = parseFloat(track.dataset.speed) || 40;
    const tween = gsap.to(track, {
      xPercent: -50,
      duration: speed,
      ease: 'none',
      repeat: -1,
    });
    track.addEventListener('mouseenter', () => tween.timeScale(0.25));
    track.addEventListener('mouseleave', () => tween.timeScale(1));
  });

  /* ---------------------------------------------------------------
     Topbar text ticker (same mechanism, different track selector)
  --------------------------------------------------------------- */
  document.querySelectorAll('[data-ticker]').forEach((track) => {
    gsap.to(track, { xPercent: -50, duration: 18, ease: 'none', repeat: -1 });
  });

  /* ---------------------------------------------------------------
     Our Process — scroll-scrubbed progress line across the 4 steps
  --------------------------------------------------------------- */
  document.querySelectorAll('.process').forEach((process) => {
    const progress = process.querySelector('.process-progress');
    if (!progress || window.innerWidth < 900) return;
    gsap.to(progress, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: process,
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: 0.6,
      },
    });
  });

  /* ---------------------------------------------------------------
     Hero photo parallax (subtle scrub-tied drift)
  --------------------------------------------------------------- */
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    if (reduceMotion) return;
    gsap.to(el, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  /* ---------------------------------------------------------------
     Decorative morphing blob behind hero photography.
     Cycles between three organic path shapes (equal point count,
     so a plain attr tween morphs smoothly without a paid plugin).
     Purely decorative — never sits behind or distorts real content.
  --------------------------------------------------------------- */
  const blobPaths = [
    'M43.4,-58.5C54.4,-49.9,60,-33.9,63.6,-17.8C67.2,-1.7,68.8,14.5,62.6,27.5C56.4,40.6,42.4,50.5,27.6,58.1C12.8,65.7,-2.8,71,-18.1,68.6C-33.4,66.2,-48.4,56.1,-58.1,42.4C-67.8,28.7,-72.2,11.4,-70.6,-5.2C-69,-21.8,-61.4,-37.7,-49.4,-46.5C-37.4,-55.3,-21,-57,-3.9,-52.1C13.2,-47.1,26.4,-67.1,43.4,-58.5Z',
    'M39.6,-53.7C50.4,-45.2,57.4,-31.9,61.8,-17.4C66.2,-2.9,68,12.8,63.1,26.5C58.2,40.2,46.6,51.9,33.1,58.7C19.6,65.5,4.2,67.4,-11.6,66.1C-27.4,64.8,-43.6,60.3,-54.4,49.5C-65.2,38.7,-70.6,21.6,-70.9,4.5C-71.2,-12.6,-66.4,-29.7,-56.1,-40.9C-45.8,-52.1,-30,-57.4,-14.7,-59.6C0.6,-61.8,15.9,-60.9,39.6,-53.7Z',
    'M46.5,-62.5C58.9,-53.6,66.6,-38.1,69.5,-22.1C72.4,-6.1,70.5,10.4,63.6,24.6C56.7,38.8,44.8,50.7,30.9,58.4C17,66.1,1.1,69.6,-14.9,68.1C-30.9,66.6,-47,60.1,-58.1,48.4C-69.2,36.7,-75.3,19.8,-75.5,2.8C-75.7,-14.2,-70,-31.3,-59,-43.9C-48,-56.5,-31.7,-64.6,-15.2,-66.9C1.3,-69.2,17.5,-71.4,46.5,-62.5Z',
  ];

  document.querySelectorAll('[data-morph-blob]').forEach((path) => {
    if (reduceMotion) {
      path.setAttribute('d', blobPaths[0]);
      return;
    }
    let i = 0;
    path.setAttribute('d', blobPaths[0]);
    gsap.timeline({ repeat: -1 }).to({}, {
      duration: 0,
      repeat: blobPaths.length - 1,
      onRepeat: advance,
    });
    function advance() {
      i = (i + 1) % blobPaths.length;
      gsap.to(path, { attr: { d: blobPaths[i] }, duration: 5, ease: 'sine.inOut' });
    }
    // kick off the loop manually since the timeline above just paces onRepeat
    function loop() {
      advance();
      gsap.delayedCall(5, loop);
    }
    gsap.delayedCall(5, loop);
  });

  /* ---------------------------------------------------------------
     Mobile menu open/close — circular reveal + staggered link entrance.
     Exposed on window so main.js (which owns all state/a11y logic)
     can call it without animations.js needing to know about state.
  --------------------------------------------------------------- */
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    const links = menu.querySelectorAll('.mobile-menu-links > li, .mobile-menu-foot');

    window.blakitchAnimateMenuOpen = function () {
      gsap.killTweensOf(menu);
      gsap.killTweensOf(links);
      gsap.set(menu, { clipPath: 'circle(2% at 92% 4%)' });
      gsap.set(links, { opacity: 0, y: 22 });
      gsap.to(menu, { clipPath: 'circle(160vmax at 92% 4%)', duration: 0.65, ease: 'power3.out' });
      gsap.to(links, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, delay: 0.25, ease: 'power2.out' });
    };

    window.blakitchAnimateMenuClose = function (done) {
      gsap.killTweensOf(menu);
      gsap.to(menu, {
        clipPath: 'circle(2% at 92% 4%)',
        duration: 0.5,
        ease: 'power3.in',
        onComplete: done,
      });
    };
  }
})();
