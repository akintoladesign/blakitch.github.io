// Blakitch — small interactions, no dependencies.

document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile nav after choosing a link
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Contact form: this is a static GitHub Pages site with no backend,
// so we confirm the message locally. Swap this for a real endpoint
// (Formspree, Getform, a serverless function, etc.) when ready.
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formNote.textContent = 'Thanks — we read every message and reply within a day or two.';
  form.reset();
});
