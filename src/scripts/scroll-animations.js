/**
 * SAV-SCC, SU, LDA. — Controlador Principal de Motion Design
 * Implementa rigorosamente docs/Direção de Motion Design — SAV-SCC.md
 * Princípio: "Revelar, não animar. O movimento de um relatório bem encadernado a abrir-se."
 * 
 * Arquitetura Content-First:
 * Todo o conteúdo no DOM está 100% visível por omissão.
 * Elementos acima da dobra NUNCA são escondidos.
 * Apenas elementos que se confirmem abaixo da dobra recebem a classe .reveal-init e animam ao entrar.
 */

export function initScrollAnimations() {
  const html = document.documentElement;
  html.classList.add('js-active');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktopPointer = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;

  // 1. Tratamento imediato para redução de movimento
  if (prefersReduced) {
    document.querySelectorAll('[data-reveal], .section-animate, .hero-m1-bg-media, .hero-m1-pillars-bar').forEach((el) => {
      el.classList.add('is-revealed', 'is-visible', 'is-settled');
    });
    return;
  }

  // 2. Preparar títulos com P1 (título por linhas) apenas onde aplicável
  prepareLineMasks();

  // 3. Orquestração da Homepage no carregamento inicial (Secção 4.1)
  orchestrateHomepageHero();

  // 4. Typewriter exclusivo do lema em Sobre Nós (Secção 5.2)
  initSobreTypewriter();

  // 5. IntersectionObserver seguro com detecção de viewport
  initSafeRevealObserver();

  // 6. Parallax contínuo no scroll para Desktop (Secção 4 & 9)
  if (isDesktopPointer) {
    initScrollParallax();
  }

  // 7. Salvaguarda Absoluta: após 1.2s, garante que nada no DOM fica invisível
  setTimeout(() => {
    document.querySelectorAll('[data-reveal], .line-inner, .reveal-init, .service-band, .service-m2-row, .about-value-row, .compare-cards-wrapper, .pillars-grid-2x2, .services-cta-card, .cta-banner, .section-animate, .value-prop-m3-cards-grid').forEach((el) => {
      el.classList.add('is-revealed', 'is-visible');
    });
  }, 1200);
}

/**
 * P1 · Lines: Divide títulos com <br> ou data-reveal="lines" em máscaras com overflow: hidden
 */
function prepareLineMasks() {
  document.querySelectorAll('[data-reveal="lines"]').forEach((heading) => {
    if (heading.querySelector('.line-mask')) return; // Já preparado

    const rect = heading.getBoundingClientRect();
    const isAboveFold = rect.top < window.innerHeight && rect.bottom > 0;

    const htmlContent = heading.innerHTML;
    const parts = htmlContent.split(/<br\s*\/?>/i);

    const initClass = isAboveFold ? '' : ' reveal-init';

    if (parts.length > 1) {
      heading.innerHTML = parts
        .map((part, index) => {
          const trimmed = part.trim();
          if (!trimmed) return '';
          return `<span class="line-mask"><span class="line-inner${initClass}" style="transition-delay: ${index * 90}ms;">${trimmed}</span></span>`;
        })
        .join('');
    } else {
      const text = heading.innerHTML.trim();
      heading.innerHTML = `<span class="line-mask"><span class="line-inner${initClass}">${text}</span></span>`;
    }

    if (isAboveFold) {
      heading.classList.add('is-revealed');
    }
  });
}

/**
 * Orquestração do Hero da Homepage (Secção 4.1)
 */
function orchestrateHomepageHero() {
  const heroSection = document.querySelector('.hero-m1-section');
  if (!heroSection) return;

  const bgMedia = heroSection.querySelector('.hero-m1-bg-media');
  const eyebrow = heroSection.querySelector('.mockup-eyebrow');
  const title = heroSection.querySelector('.hero-m1-title');
  const lead = heroSection.querySelector('.hero-m1-lead');
  const actions = heroSection.querySelectorAll('.hero-m1-actions > *');
  const pillarsBar = heroSection.querySelector('.hero-m1-pillars-bar');

  // Arrancar logo após carregamento do DOM (até 100 ms)
  setTimeout(() => {
    // A imagem assenta de scale 1.06 para 1 em 2400 ms
    if (bgMedia) bgMedia.classList.add('is-settled');

    // Etiqueta com linha (0 ms)
    if (eyebrow) eyebrow.classList.add('is-revealed');

    // Título P1 (150 ms)
    setTimeout(() => {
      if (title) title.classList.add('is-revealed');
    }, 150);

    // Subtítulo (450 ms)
    setTimeout(() => {
      if (lead) lead.classList.add('is-revealed');
    }, 450);

    // Botões sobem 16 px a 650 ms, com 100 ms entre si
    actions.forEach((btn, idx) => {
      setTimeout(() => {
        btn.classList.add('is-revealed');
      }, 650 + idx * 100);
    });

    // Faixa das 3 âncoras (900 ms)
    setTimeout(() => {
      if (pillarsBar) pillarsBar.classList.add('is-revealed');
    }, 900);
  }, 60);
}

/**
 * Typewriter de uso único no lema de Sobre Nós (Secção 5.2)
 */
function initSobreTypewriter() {
  const sloganEl = document.querySelector('.about-hero-slogan');
  if (!sloganEl) return;

  const fullText = sloganEl.getAttribute('data-typewriter') || sloganEl.textContent.trim();
  const alreadyRan = sessionStorage.getItem('sav_scc_typewriter_done');

  // Se já correu na sessão ou se houver preferência de movimento reduzido, mostrar estático
  if (alreadyRan) {
    sloganEl.textContent = fullText;
    const lead = document.querySelector('.about-hero-lead');
    if (lead) lead.classList.add('is-revealed');
    return;
  }

  // Reservar espaço sem salto de layout (CLS = 0)
  sloganEl.setAttribute('aria-label', fullText);
  sloganEl.innerHTML = '<span class="typewriter-text"></span><span class="typewriter-cursor" aria-hidden="true"></span>';

  const textContainer = sloganEl.querySelector('.typewriter-text');
  const cursor = sloganEl.querySelector('.typewriter-cursor');

  // Começa 500 ms depois do título
  setTimeout(() => {
    let charIndex = 0;

    function typeNextChar() {
      if (charIndex < fullText.length) {
        const char = fullText[charIndex];
        textContainer.textContent += char;
        charIndex++;

        // Pausa de 400 ms no fim de cada frase (ponto final)
        const isEndOfSentence = char === '.' && charIndex < fullText.length;
        const delay = isEndOfSentence ? 400 : 28;

        setTimeout(typeNextChar, delay);
      } else {
        // Conclusão: cursor pisca e desaparece após 1,2 s
        sessionStorage.setItem('sav_scc_typewriter_done', 'true');
        setTimeout(() => {
          if (cursor) cursor.classList.add('is-done');
        }, 1200);

        // Revelar a frase seguinte suavemente com fade
        const lead = document.querySelector('.about-hero-lead');
        if (lead) lead.classList.add('is-revealed');
      }
    }

    typeNextChar();
  }, 500);
}

/**
 * Observer seguro de revelações de scroll
 * Garante que elementos acima da dobra NUNCA são escondidos
 */
function initSafeRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed', 'is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.01,
      rootMargin: '0px 0px 50px 0px',
    }
  );

  const candidates = document.querySelectorAll(
    '[data-reveal], .section-animate, .service-band, .service-m2-row, .about-value-row, .compare-cards-wrapper, .pillars-grid-2x2, .services-cta-card, .cta-banner, .value-prop-m3-cards-grid'
  );

  const windowHeight = window.innerHeight;

  candidates.forEach((el) => {
    const rect = el.getBoundingClientRect();

    // Se o elemento já está na tela ou perto do topo, revelar imediatamente
    if (rect.top < windowHeight + 40 && rect.bottom > 0) {
      el.classList.add('is-revealed', 'is-visible');
    } else {
      // Elemento confirmado abaixo da dobra: prepara animação de entrada
      el.classList.add('reveal-init');
      observer.observe(el);
    }
  });
}

/**
 * Parallax contínuo no scroll para Desktop (Secção 4 & 9)
 */
function initScrollParallax() {
  const heroMedia = document.querySelector('.hero-m1-bg-media');
  const secondaryHeros = document.querySelectorAll('.services-hero-bg-media, .about-hero-bg-media');
  const parallaxImages = document.querySelectorAll('.has-parallax-img');

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Parallax da Homepage (0 a +72 px ao longo da altura do hero)
        if (heroMedia) {
          const heroHeight = heroMedia.parentElement.offsetHeight || 600;
          if (scrollY <= heroHeight) {
            const progress = scrollY / heroHeight;
            const yOffset = Math.round(progress * 72);
            heroMedia.style.setProperty('--hero-parallax-y', `${yOffset}px`);
          }
        }

        // Parallax de cabeçalho secundário (até +48 px)
        if (secondaryHeros.length && scrollY <= 500) {
          const yOffset = Math.round((scrollY / 500) * 48);
          secondaryHeros.forEach((media) => {
            media.style.transform = `translateY(${yOffset}px)`;
          });
        }

        // Parallax interior de fotografias selecionadas (±20 px)
        parallaxImages.forEach((img) => {
          const rect = img.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          if (rect.top < windowHeight && rect.bottom > 0) {
            const centerProgress = (rect.top + rect.height / 2 - windowHeight / 2) / (windowHeight / 2);
            const offset = Math.round(centerProgress * -20);
            img.style.transform = `translateY(${offset}px) scale(1.05)`;
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}
