/**
 * SAV-SCC — Controlo de Navegação e Acessibilidade do Menu
 */

export function initNavigation() {
  const header = document.querySelector('#site-header');
  const navToggle = document.querySelector('#nav-toggle');
  const navMenu = document.querySelector('#nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navToggle || !navMenu) return;

  // Alternar abertura do menu mobile
  function toggleMenu(forceClose = false) {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    const shouldOpen = forceClose ? false : !isExpanded;

    navToggle.setAttribute('aria-expanded', String(shouldOpen));
    navMenu.classList.toggle('is-open', shouldOpen);

    if (shouldOpen) {
      document.body.style.overflow = 'hidden';
      // Mover foco para o primeiro link navegável
      const firstLink = navMenu.querySelector('a');
      if (firstLink) firstLink.focus();
    } else {
      document.body.style.overflow = '';
      navToggle.focus();
    }
  }

  navToggle.addEventListener('click', () => toggleMenu());

  // Fechar menu com a tecla Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
      toggleMenu(true);
    }
  });

  // Fechar menu ao clicar num link de navegação
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('is-open')) {
        toggleMenu(true);
      }
    });
  });

  // Adicionar sombra sutil no cabeçalho ao fazer scroll
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
}
