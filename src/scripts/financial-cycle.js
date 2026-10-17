/**
 * SAV-SCC — Ciclo de Inteligência Financeira Interativo
 * Apresentação compacta etapa por etapa:
 * DADOS -> INFORMAÇÃO -> ANÁLISE -> DECISÃO
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

  containers.forEach((container) => {
    let currentIndex = 0;

    const stageBadge = container.querySelector('.cycle-stage-badge');
    const counter = container.querySelector('.cycle-counter');
    const stageTitle = container.querySelector('.cycle-stage-title');
    const stageDesc = container.querySelector('.cycle-stage-desc');
    const prevBtn = container.querySelector('.cycle-prev-btn');
    const nextBtn = container.querySelector('.cycle-next-btn');
    const stepTabs = container.querySelectorAll('.cycle-step-tab');
    const dots = container.querySelectorAll('.cycle-dot');
    const contentBody = container.querySelector('.cycle-content-body');

    function renderStep(index) {
      if (index < 0 || index >= CYCLE_STEPS.length) return;
      currentIndex = index;
      const step = CYCLE_STEPS[currentIndex];

      // Atualização dos textos com transição suave
      if (contentBody) {
        contentBody.style.opacity = '0';
        contentBody.style.transform = 'translateY(3px)';
        
        setTimeout(() => {
          if (stageBadge) stageBadge.textContent = `Etapa ${step.stepNumber} — ${step.stageName}`;
          if (counter) counter.textContent = `${currentIndex + 1} de ${CYCLE_STEPS.length}`;
          if (stageTitle) stageTitle.textContent = step.title;
          if (stageDesc) stageDesc.textContent = step.description;

          contentBody.style.opacity = '1';
          contentBody.style.transform = 'translateY(0)';
        }, 120);
      } else {
        if (stageBadge) stageBadge.textContent = `Etapa ${step.stepNumber} — ${step.stageName}`;
        if (counter) counter.textContent = `${currentIndex + 1} de ${CYCLE_STEPS.length}`;
        if (stageTitle) stageTitle.textContent = step.title;
        if (stageDesc) stageDesc.textContent = step.description;
      }

      // Estados dos botões Anterior / Seguinte
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

      // Indicadores visuais de pontos (dots)
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentIndex);
      });
    }

    // Eventos dos botões Anterior e Seguinte
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex > 0) {
          renderStep(currentIndex - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex < CYCLE_STEPS.length - 1) {
          renderStep(currentIndex + 1);
        }
      });
    }

    // Clique direto nas abas de etapas
    stepTabs.forEach((tab, i) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        renderStep(i);
      });
    });

    // Renderização inicial
    renderStep(0);
  });
}
