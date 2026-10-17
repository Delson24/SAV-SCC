/**
 * SAV-SCC — Interação Acessível do Formulário de Contacto
 * Nota: Operação em modo de preparação, sem simulação falsa de envio.
 */

export function initContactForm() {
  const form = document.querySelector('#contact-form');
  const submitBtn = document.querySelector('#btn-submit-contact');
  const statusContainer = document.querySelector('#form-status-message');

  if (!form || !submitBtn) return;

  submitBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const nameInput = form.querySelector('#contact-name');
    const contactInput = form.querySelector('#contact-info');
    const serviceInput = form.querySelector('#contact-service');
    const messageInput = form.querySelector('#contact-message');

    // Validação acessível dos campos obrigatórios
    let isValid = true;
    let firstInvalidInput = null;

    [nameInput, contactInput, serviceInput, messageInput].forEach((input) => {
      if (!input) return;
      if (!input.value.trim()) {
        input.setAttribute('aria-invalid', 'true');
        input.style.borderColor = 'var(--color-error)';
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
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: var(--space-3); border-radius: var(--radius-md); font-size: var(--font-size-xs); margin-top: var(--space-3);" role="alert">
            Por favor, preencha todos os campos assinalados com preenchimento obrigatório.
          </div>
        `;
      }
      if (firstInvalidInput) firstInvalidInput.focus();
      return;
    }

    // Caso válido: Informar com transparência e oferecer ligação direta para WhatsApp oficial
    if (statusContainer) {
      statusContainer.innerHTML = `
        <div style="background-color: var(--color-neutral-100); border: 1px solid var(--color-neutral-300); color: var(--color-primary-900); padding: var(--space-4); border-radius: var(--radius-md); font-size: var(--font-size-xs); margin-top: var(--space-3);" role="status">
          <strong>Dados validados com sucesso.</strong>
          <p style="margin: var(--space-2) 0 var(--space-3) 0; color: var(--color-neutral-700);">
            Para resposta imediata da equipa da SAV-SCC, pode contactar-nos diretamente pelo WhatsApp oficial ou efetuar uma chamada telefónica.
          </p>
          <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
            <a href="https://wa.me/258828210526" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-direct" style="padding: 0.5rem 1rem; font-size: var(--font-size-xs);">
              Conversar no WhatsApp &rarr;
            </a>
            <a href="tel:+258828210526" class="btn-call-direct" style="padding: 0.5rem 1rem; font-size: var(--font-size-xs);">
              Ligar: +258 82 821 0526
            </a>
          </div>
        </div>
      `;
    }
  });
}
