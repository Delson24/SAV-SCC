/**
 * SAV-SCC — Animações de Entrada das Secções e Pilares Assimétricos
 * Utiliza IntersectionObserver nativo para animar secções e pilares.
 * Respeita integralmente prefers-reduced-motion e navegadores sem JS.
 */

export function initScrollAnimations() {
  // Marcar suporte a JavaScript para transições progressivas
  document.documentElement.classList.add('js-active');

  // Verificar se o utilizador prefere movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // Tornar todos os elementos imediatamente visíveis na posição final
    document.querySelectorAll('.section-animate, .pillars-asymmetric-grid').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  // Observer para secções gerais
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.section-animate').forEach((el) => {
    sectionObserver.observe(el);
  });

  // Observer para a grelha de pilares com entrada direcional coordenada
  const pillarObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          pillarObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px',
    }
  );

  document.querySelectorAll('.pillars-asymmetric-grid').forEach((el) => {
    pillarObserver.observe(el);
  });
}
