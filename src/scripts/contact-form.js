/**
 * SAV-SCC, SU, LDA. — Interação e Submissão Real do Formulário de Contacto
 * Validação de acessibilidade, envio para /api/contact e tratamento robusto de sucesso e erro.
 */

export function initContactForm() {
  const form = document.querySelector('#contact-form');
  const submitBtn = document.querySelector('#btn-submit-contact');
  const statusContainer = document.querySelector('#form-status-message');

  if (!form || !submitBtn) return;

  // Pré-seleção inteligente do serviço a partir de parâmetros de URL (ex.: ?servico=contabilidade)
  const serviceSelect = form.querySelector('#contact-service');
  if (serviceSelect) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const servicoParam = urlParams.get('servico');
      if (servicoParam) {
        const paramLower = servicoParam.toLowerCase();
        for (let i = 0; i < serviceSelect.options.length; i++) {
          const opt = serviceSelect.options[i];
          const valLower = opt.value.toLowerCase();
          if (
            valLower.includes(paramLower) ||
            (paramLower.includes('contab') && valLower.includes('contabilidade')) ||
            (paramLower.includes('fisc') && valLower.includes('fiscalidade')) ||
            ((paramLower.includes('finan') || paramLower.includes('gestao-finan')) && (valLower.includes('financeira') || valLower.includes('gestao financeira'))) ||
            ((paramLower.includes('org') || paramLower.includes('empresarial')) && valLower.includes('organizacao'))
          ) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
    } catch {
      // Degradação graciosa
    }
  }

  // Tratador de envio unificado (suporta clique no botão e submit via tecla Enter)
  const handleFormSubmit = async (event) => {
    if (event) event.preventDefault();

    const nameInput = form.querySelector('#contact-name');
    const companyInput = form.querySelector('#contact-company');
    const contactInput = form.querySelector('#contact-info');
    const serviceInput = form.querySelector('#contact-service');
    const messageInput = form.querySelector('#contact-message');
    const honeypotInput = form.querySelector('input[name="website_url_hp"]');

    // Validação acessível dos campos obrigatórios
    let isValid = true;
    let firstInvalidInput = null;

    [nameInput, contactInput, serviceInput, messageInput].forEach((input) => {
      if (!input) return;
      if (!input.value.trim()) {
        input.setAttribute('aria-invalid', 'true');
        input.style.borderColor = 'var(--color-error, #ef4444)';
        if (!firstInvalidInput) firstInvalidInput = input;
        isValid = false;
      } else {
        input.setAttribute('aria-invalid', 'false');
        input.style.borderColor = '';
      }
    });

    if (!isValid) {
      if (statusContainer) {
        statusContainer.innerHTML = `
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); font-size: var(--font-size-xs); margin-top: var(--space-4); line-height: 1.5;" role="alert">
            <strong>Campos incompletos:</strong> Por favor, preencha todos os campos assinalados com preenchimento obrigatório.
          </div>
        `;
      }
      if (firstInvalidInput) firstInvalidInput.focus();
      return;
    }

    // Limpar mensagens de erro anteriores
    if (statusContainer) {
      statusContainer.innerHTML = '';
    }

    const payload = {
      nome: nameInput.value.trim(),
      empresa: companyInput ? companyInput.value.trim() : '',
      contacto: contactInput.value.trim(),
      servico: serviceInput.value,
      mensagem: messageInput.value.trim(),
      website_url_hp: honeypotInput ? honeypotInput.value.trim() : '',
    };

    // Estado visual de envio no botão
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span style="display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        A registar pedido...
      </span>
    `;

    // Preparar URL de WhatsApp com mensagem pré-formatada para contingência
    const encodedWhatsappText = encodeURIComponent(
      `Olá SAV-SCC, o meu nome é ${payload.nome}${payload.empresa ? ` da empresa ${payload.empresa}` : ''}. ` +
      `Gostaria de agendar uma reunião comercial sobre ${payload.servico}.\n\nDescrição: ${payload.mensagem}`
    );
    const whatsappFallbackUrl = `https://wa.me/258828210526?text=${encodedWhatsappText}`;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        // Sucesso real confirmado pelo endpoint
        form.reset();
        if (statusContainer) {
          statusContainer.innerHTML = `
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: var(--space-4); border-radius: var(--radius-md); font-size: var(--font-size-sm); margin-top: var(--space-4);" role="status">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #16a34a; flex-shrink: 0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <strong style="font-size: var(--font-size-base); color: #14532d;">Pedido de Reunião Enviado com Sucesso!</strong>
              </div>
              <p style="margin: 0; color: #166534; font-size: var(--font-size-xs); line-height: 1.5;">
                Obrigado pelo seu contacto. A equipa da SAV-SCC analisará os dados da sua empresa e responderá com brevidade através do contacto indicado.
              </p>
            </div>
          `;
        }
      } else {
        // Falha no envio ou credenciais de email pendentes de ativação no ambiente
        const errorMessage = data.error || 'Não foi possível processar o envio automático neste momento.';
        if (statusContainer) {
          statusContainer.innerHTML = `
            <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; color: #001a33; padding: var(--space-4); border-radius: var(--radius-md); font-size: var(--font-size-xs); margin-top: var(--space-4);" role="alert">
              <strong style="display: block; font-size: var(--font-size-sm); color: #001a33; margin-bottom: 4px;">
                A sua mensagem está pronta a ser atendida pela nossa equipa
              </strong>
              <p style="margin: 0 0 var(--space-3) 0; color: #475569; line-height: 1.5;">
                ${errorMessage}<br>
                Pode enviar os dados preenchidos diretamente para o nosso WhatsApp oficial ou efetuar uma chamada telefónica imediata:
              </p>
              <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
                <a href="${whatsappFallbackUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-direct" style="padding: 0.55rem 1rem; font-size: var(--font-size-xs); text-decoration: none;">
                  Enviar via WhatsApp &rarr;
                </a>
                <a href="tel:+258828210526" class="btn-call-direct" style="padding: 0.55rem 1rem; font-size: var(--font-size-xs); text-decoration: none;">
                  Ligar: +258 82 821 0526
                </a>
              </div>
            </div>
          `;
        }
      }
    } catch (networkError) {
      console.error('[SAV-SCC Form] Erro de rede:', networkError);
      if (statusContainer) {
        statusContainer.innerHTML = `
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: var(--space-4); border-radius: var(--radius-md); font-size: var(--font-size-xs); margin-top: var(--space-4);" role="alert">
            <strong style="display: block; font-size: var(--font-size-sm); margin-bottom: 4px;">
              Falha na ligação à rede
            </strong>
            <p style="margin: 0 0 var(--space-3) 0; color: #7f1d1d; line-height: 1.5;">
              Não foi possível estabelecer ligação com o servidor. Pode encaminhar o seu pedido diretamente via WhatsApp:
            </p>
            <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
              <a href="${whatsappFallbackUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-direct" style="padding: 0.55rem 1rem; font-size: var(--font-size-xs); text-decoration: none;">
                Enviar via WhatsApp &rarr;
              </a>
              <a href="tel:+258828210526" class="btn-call-direct" style="padding: 0.55rem 1rem; font-size: var(--font-size-xs); text-decoration: none;">
                Ligar: +258 82 821 0526
              </a>
            </div>
          </div>
        `;
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  };

  form.addEventListener('submit', handleFormSubmit);
}
