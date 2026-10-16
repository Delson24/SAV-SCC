/**
 * SAV-SCC — Animações de Entrada das Secções
 * Utiliza IntersectionObserver para animar secções ao entrarem no viewport.
 * Conteúdo permanece visível se o JavaScript falhar (classe .no-js).
 */

export function initScrollAnimations() {
  // Verificar se o utilizador prefere movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Tornar todos os elementos imediatamente visíveis
    document.querySelectorAll('.section-animate').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  // Verificar suporte para IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.section-animate').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.section-animate').forEach((el) => {
    observer.observe(el);
  });
}
