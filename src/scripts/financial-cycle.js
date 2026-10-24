/**
 * SAV-SCC, SU, LDA. — Ciclo de Inteligência Financeira
 * Apresentação por etapas: DADOS -> INFORMAÇÃO -> ANÁLISE -> DECISÃO
 * Implementa rigorosamente a Secção 5.1 de docs/Direção de Motion Design — SAV-SCC.md
 */

const CYCLE_STEPS = [
  {
    stepNumber: '01',
    stageName: 'DADOS',
    title: 'Dados financeiros',
    description: 'Reunimos e organizamos os dados contabilísticos, financeiros e administrativos relevantes para compreender a realidade do negócio.'
  },
  {
    stepNumber: '02',
    stageName: 'INFORMAÇÃO',
    title: 'Informação organizada',
    description: 'Transformamos os dados em informação financeira estruturada, clara e útil para acompanhar a atividade da empresa.'
  },
  {
    stepNumber: '03',
    stageName: 'ANÁLISE',
    title: 'Análise financeira',
    description: 'Interpretamos a informação para compreender custos, receitas, desempenho e possíveis riscos, apoiando uma visão mais clara do negócio.'
  },
  {
    stepNumber: '04',
    stageName: 'DECISÃO',
    title: 'Decisões mais seguras',
    description: 'A informação analisada ajuda o empresário a avaliar opções, planear ações e tomar decisões com maior segurança.'
  }
];

export function initFinancialCycle() {
  const containers = document.querySelectorAll('.cycle-interactive-container');
  if (!containers.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  containers.forEach((container) => {
    let currentIndex = 0;
    let isTransitioning = false;

    const stageBadge = container.querySelector('.cycle-stage-badge');
    const counter = container.querySelector('.cycle-counter');
    const stageTitle = container.querySelector('.cycle-stage-title');
    const stageDesc = container.querySelector('.cycle-stage-desc');
    const prevBtn = container.querySelector('.cycle-prev-btn');
    const nextBtn = container.querySelector('.cycle-next-btn');
    const stepTabs = container.querySelectorAll('.cycle-step-tab');
    const dots = container.querySelectorAll('.cycle-dot');
    const contentBody = container.querySelector('.cycle-content-body');
    const displayCard = container.querySelector('.cycle-display-card');

    if (displayCard) {
      displayCard.setAttribute('aria-live', 'polite');
      displayCard.setAttribute('tabindex', '0');
    }

    function renderStep(newIndex) {
      if (newIndex < 0 || newIndex >= CYCLE_STEPS.length) return;
      if (newIndex === currentIndex && contentBody && contentBody.dataset.initialized) return;

      const direction = newIndex >= currentIndex ? 1 : -1;
      const isInitial = !contentBody || !contentBody.dataset.initialized;
      currentIndex = newIndex;
      const step = CYCLE_STEPS[currentIndex];

      if (isInitial || prefersReduced) {
        if (stageBadge) stageBadge.textContent = `ETAPA ${step.stepNumber} · ${step.stageName}`;
        if (counter) counter.textContent = `${currentIndex + 1} de ${CYCLE_STEPS.length}`;
        if (stageTitle) stageTitle.textContent = step.title;
        if (stageDesc) stageDesc.textContent = step.description;
        if (contentBody) {
          contentBody.style.opacity = '1';
          contentBody.style.transform = 'none';
          contentBody.dataset.initialized = 'true';
        }
        updateControls();
        return;
      }

      if (isTransitioning) return;
      isTransitioning = true;

      // 1. Saída do conteúdo atual em 180 ms (deslocação de 12 px no sentido oposto ao movimento)
      const exitShift = direction > 0 ? -12 : 12;
      contentBody.style.transition = 'opacity 180ms cubic-bezier(0.22, 1, 0.36, 1), transform 180ms cubic-bezier(0.22, 1, 0.36, 1)';
      contentBody.style.opacity = '0';
      contentBody.style.transform = `translateX(${exitShift}px)`;

      setTimeout(() => {
        // Atualizar textos no DOM
        if (stageBadge) stageBadge.textContent = `ETAPA ${step.stepNumber} · ${step.stageName}`;
        if (counter) counter.textContent = `${currentIndex + 1} de ${CYCLE_STEPS.length}`;
        if (stageTitle) stageTitle.textContent = step.title;
        if (stageDesc) stageDesc.textContent = step.description;

        // 2. Preparar posição de entrada (deslocação de 24 px no sentido do movimento)
        const enterStart = direction > 0 ? 24 : -24;
        contentBody.style.transition = 'none';
        contentBody.style.transform = `translateX(${enterStart}px)`;
        contentBody.style.opacity = '0';

        // Forçar reflow para ativar transição
        void contentBody.offsetWidth;

        // 3. Entrada em 360 ms com ease-out
        contentBody.style.transition = 'opacity 360ms cubic-bezier(0.22, 1, 0.36, 1), transform 360ms cubic-bezier(0.22, 1, 0.36, 1)';
        contentBody.style.opacity = '1';
        contentBody.style.transform = 'translateX(0)';

        // Escalonamento interno subtil
        if (stageTitle) {
          stageTitle.style.transition = 'transform 360ms cubic-bezier(0.22, 1, 0.36, 1) 60ms';
        }
        if (stageDesc) {
          stageDesc.style.transition = 'transform 360ms cubic-bezier(0.22, 1, 0.36, 1) 120ms';
        }

        setTimeout(() => {
          isTransitioning = false;
        }, 360);
      }, 180);

      updateControls();
    }

    function updateControls() {
      // Estado dos botões Anterior e Seguinte
      if (prevBtn) {
        prevBtn.disabled = (currentIndex === 0);
        prevBtn.setAttribute('aria-disabled', currentIndex === 0 ? 'true' : 'false');
      }

      if (nextBtn) {
        nextBtn.disabled = (currentIndex === CYCLE_STEPS.length - 1);
        nextBtn.setAttribute('aria-disabled', (currentIndex === CYCLE_STEPS.length - 1) ? 'true' : 'false');
      }

      // Destaque das abas superiores
      stepTabs.forEach((tab, i) => {
        const isActive = (i === currentIndex);
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Indicadores visuais de pontos (dots): ativo alarga de 8 px para 28 px
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentIndex);
      });

      // Linha de progresso preenche até ao nó ativo em 500 ms (Secção 5.1)
      const progressPct = (currentIndex / (CYCLE_STEPS.length - 1)) * 100;
      container.style.setProperty('--cycle-progress', `${progressPct}%`);
    }

    // Eventos de clique nos botões
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex > 0) renderStep(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex < CYCLE_STEPS.length - 1) renderStep(currentIndex + 1);
      });
    }

    // Clique direto nas abas de etapas
    stepTabs.forEach((tab, i) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        renderStep(i);
      });
    });

    // Acessibilidade por teclado (Setas Esquerda e Direita)
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        if (currentIndex < CYCLE_STEPS.length - 1) {
          e.preventDefault();
          renderStep(currentIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          e.preventDefault();
          renderStep(currentIndex - 1);
        }
      }
    });

    // Renderização inicial
    renderStep(0);
  });
}
