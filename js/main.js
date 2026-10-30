// Blakitch — core interactions (nav, dropdown, mobile menu, forms).
// Written to work even if GSAP fails to load — this file owns all
// functionality; animations.js only adds motion on top of it.

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     Footer year
  --------------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------------------------------------------------------
     Desktop "Our Services" dropdown
  --------------------------------------------------------------- */
  const navItem = document.querySelector('.nav-item');
  const trigger = document.querySelector('.dropdown-trigger');

  if (navItem && trigger) {
    const closeDropdown = () => {
      navItem.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    };
    const openDropdown = () => {
      navItem.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    };

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      navItem.classList.contains('open') ? closeDropdown() : openDropdown();
    });

    document.addEventListener('click', (e) => {
      if (!navItem.contains(e.target)) closeDropdown();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDropdown();
    });

    navItem.addEventListener('mouseenter', openDropdown);
    navItem.addEventListener('mouseleave', closeDropdown);
  }

  /* ---------------------------------------------------------------
     Mobile full-page menu
  --------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    const setOpen = (isOpen) => {
      navToggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (window.blakitchAnimateMenuOpen) window.blakitchAnimateMenuOpen();
      } else {
        document.body.style.overflow = '';
        if (window.blakitchAnimateMenuClose) {
          window.blakitchAnimateMenuClose(() => mobileMenu.classList.remove('open'));
        } else {
          mobileMenu.classList.remove('open');
        }
      }
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      setOpen(!isOpen);
    });

    mobileMenu.querySelectorAll('.mobile-menu-links > li > a').forEach(link => {
      link.addEventListener('click', () => setOpen(false));
    });

    // Mobile accordion for "Our Services"
    const accordion = mobileMenu.querySelector('.mobile-accordion');
    if (accordion) {
      const accTrigger = accordion.querySelector('.mobile-accordion-trigger');
      accTrigger.addEventListener('click', () => {
        accordion.classList.toggle('open');
      });
      accordion.querySelectorAll('.mobile-accordion-panel a').forEach(link => {
        link.addEventListener('click', () => setOpen(false));
      });
    }
  }

  /* ---------------------------------------------------------------
     Contact form — static site, no backend yet.
     Swap this for a real endpoint (Formspree, Getform, a serverless
     function, etc.) when ready — see README.
  --------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const contactNote = document.getElementById('contactNote');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactNote.textContent = 'Thanks — we read every message and reply within a day or two.';
      contactForm.reset();
    });
  }

  document.querySelectorAll('.joinlist-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('.form-note');
      if (note) note.textContent = "You're on the list — welcome.";
      form.reset();
    });
  });

});
