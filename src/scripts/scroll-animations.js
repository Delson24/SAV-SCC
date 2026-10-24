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
    document.querySelectorAll('[data-reveal], .section-animate, .hero-m1-bg-media, .hero-m1-pillars-bar, .services-hero-title, .services-hero-lead, .about-hero-title, .about-hero-lead').forEach((el) => {
      el.classList.add('is-revealed', 'is-visible', 'is-settled');
    });
    return;
  }

  // 2. Preparar títulos com P1 (título por linhas) onde aplicável
  prepareLineMasks();

  // 3. Orquestração dos cabeçalhos Hero (Homepage e Páginas Secundárias)
  orchestrateHomepageHero();
  orchestrateSecondaryHero();

  // 4. IntersectionObserver seguro com detecção de scroll
  initSafeRevealObserver();

  // 5. Parallax contínuo no scroll para Desktop (Secção 4 & 9)
  if (isDesktopPointer) {
    initScrollParallax();
  }
}

/**
 * P1 · Lines: Divide títulos com <br> ou data-reveal="lines" em máscaras com overflow: hidden
 */
function prepareLineMasks() {
  document.querySelectorAll('[data-reveal="lines"]').forEach((heading) => {
    if (heading.querySelector('.line-mask')) return; // Já preparado

    const htmlContent = heading.innerHTML;
    const parts = htmlContent.split(/<br\s*\/?>/i);

    if (parts.length > 1) {
      heading.innerHTML = parts
        .map((part, index) => {
          const trimmed = part.trim();
          if (!trimmed) return '';
          return `<span class="line-mask"><span class="line-inner reveal-init" style="transition-delay: ${index * 110}ms;">${trimmed}</span></span>`;
        })
        .join('');
    } else {
      const text = heading.innerHTML.trim();
      heading.innerHTML = `<span class="line-mask"><span class="line-inner reveal-init">${text}</span></span>`;
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

  // Inicializar estados antes da sequência de entrada
  if (eyebrow) eyebrow.classList.add('reveal-init');
  if (title) title.classList.add('reveal-init');
  if (lead) lead.classList.add('reveal-init');
  actions.forEach(btn => btn.classList.add('reveal-init'));
  if (pillarsBar) pillarsBar.classList.add('reveal-init');

  // Passo 1 (60 ms): Imagem de Maputo assenta de 1.05 para 1.0 e etiqueta com linha desenha-se
  setTimeout(() => {
    if (bgMedia) bgMedia.classList.add('is-settled');
    if (eyebrow) eyebrow.classList.add('is-revealed');
  }, 60);

  // Passo 2 (160 ms): Título sobe suavemente por linhas (P1)
  setTimeout(() => {
    if (title) {
      title.classList.add('is-revealed');
      title.querySelectorAll('.line-inner').forEach(l => l.classList.add('is-revealed'));
    }
  }, 160);

  // Passo 3 (400 ms): Subtítulo entra com fade e deslocamento vertical
  setTimeout(() => {
    if (lead) lead.classList.add('is-revealed');
  }, 400);

  // Passo 4 (600 ms): Botões de ação sobem com stagger de 100 ms
  actions.forEach((btn, idx) => {
    setTimeout(() => {
      btn.classList.add('is-revealed');
    }, 600 + idx * 100);
  });

  // Passo 5 (850 ms): Barra das 3 âncoras desenha a linha superior e revela RIGOR, CONFIDENCIALIDADE, PROXIMIDADE
  setTimeout(() => {
    if (pillarsBar) pillarsBar.classList.add('is-revealed');
  }, 850);
}

/**
 * Orquestração dos Heros Secundários (Serviços, Proposta de Valor, Sobre Nós, Contactos)
 */
function orchestrateSecondaryHero() {
  const secHero = document.querySelector('.services-hero-section, .about-hero-section, .contact-hero');
  if (!secHero) return;

  const eyebrow = secHero.querySelector('.mockup-eyebrow, .text-eyebrow');
  const title = secHero.querySelector('h1');
  const lead = secHero.querySelector('.services-hero-lead, .about-hero-lead, p');

  if (eyebrow) eyebrow.classList.add('reveal-init');
  if (title) title.classList.add('reveal-init');

  setTimeout(() => {
    if (eyebrow) eyebrow.classList.add('is-revealed');
  }, 60);

  setTimeout(() => {
    if (title) {
      title.classList.add('is-revealed');
      title.querySelectorAll('.line-inner').forEach(l => l.classList.add('is-revealed'));
    }
  }, 150);

  // Tratamento de Sobre Nós (Typewriter) vs Outras páginas
  if (secHero.classList.contains('about-hero-section') || secHero.querySelector('.about-hero-slogan')) {
    initSobreTypewriter();
  } else if (lead) {
    lead.classList.add('reveal-init');
    setTimeout(() => {
      lead.classList.add('is-revealed');
    }, 320);
  }
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

        // Pausa de 380 ms no fim de cada frase (ponto final)
        const isEndOfSentence = char === '.' && charIndex < fullText.length;
        const delay = isEndOfSentence ? 380 : 26;

        setTimeout(typeNextChar, delay);
      } else {
        // Conclusão: cursor pisca e desaparece suavemente
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
  }, 450);
}

/**
 * Observer seguro de revelações de scroll
 * Garante que elementos acima da dobra NUNCA são escondidos e que elementos abaixo animam ao entrar
 */
function initSafeRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('is-revealed', 'is-visible');

          // Revelar também réguas ou elementos filhos de linha associados
          el.querySelectorAll('.line-inner, .mockup-eyebrow').forEach((child) => {
            child.classList.add('is-revealed');
          });

          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  const candidates = document.querySelectorAll(
    '[data-reveal], .section-animate, .service-band, .service-m2-row, .about-value-row, .compare-cards-wrapper, .pillars-grid-2x2, .services-cta-card, .cta-banner, .value-prop-m3-cards-grid'
  );

  const windowHeight = window.innerHeight;

  candidates.forEach((el) => {
    // Elementos dentro dos cabeçalhos hero são geridos pelas orquestrações dedicadas
    if (el.closest('.hero-m1-section, .services-hero-section, .about-hero-section, .contact-hero')) {
      return;
    }

    const rect = el.getBoundingClientRect();

    // Se o elemento já está na tela ou perto do topo no carregamento inicial, revelar imediatamente
    if (rect.top < windowHeight - 40 && rect.bottom > 0) {
      el.classList.add('is-revealed', 'is-visible');
    } else {
      // Elemento confirmado abaixo da dobra: prepara animação de entrada ao aproximar-se
      el.classList.add('reveal-init');
      observer.observe(el);
    }
  });

  // Salvaguarda fluida de scroll: revela elementos que entrem no campo de visão em scroll acelerado
  let scrollThrottle = false;
  window.addEventListener('scroll', () => {
    if (!scrollThrottle) {
      window.requestAnimationFrame(() => {
        const winH = window.innerHeight;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const isNearBottom = scrollY + winH >= document.documentElement.scrollHeight - 90;

        document.querySelectorAll('.reveal-init:not(.is-revealed)').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (isNearBottom || (r.top < winH - 20 && r.bottom > 0)) {
            el.classList.add('is-revealed', 'is-visible');
            el.querySelectorAll('.line-inner, .mockup-eyebrow').forEach(c => c.classList.add('is-revealed'));
            observer.unobserve(el);
          }
        });

        scrollThrottle = false;
      });
      scrollThrottle = true;
    }
  }, { passive: true });
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
