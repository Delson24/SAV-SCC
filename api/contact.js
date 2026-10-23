/**
 * SAV-SCC, SU, LDA. — Vercel Serverless Function
 * Endpoint: /api/contact
 * Responsabilidade: Validação, sanitização e encaminhamento seguro de pedidos de reunião
 */

export default async function handler(req, res) {
  // Configuração de cabeçalhos
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Método não permitido. Utilize POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ success: false, error: 'Formato de dados inválido.' });
      }
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisição vazio.' });
    }

    const {
      nome = '',
      empresa = '',
      contacto = '',
      servico = '',
      mensagem = '',
      website_url_hp = '', // Campo honeypot anti-spam (deve permanecer vazio)
    } = body;

    // Se o honeypot anti-spam foi preenchido, rejeitar silenciosamente para bots
    if (website_url_hp && String(website_url_hp).trim().length > 0) {
      return res.status(400).json({ success: false, error: 'Submissão inválida detetada.' });
    }

    // Sanitização e validação dos campos obrigatórios
    const cleanNome = String(nome).trim();
    const cleanContacto = String(contacto).trim();
    const cleanServico = String(servico).trim();
    const cleanMensagem = String(mensagem).trim();
    const cleanEmpresa = String(empresa).trim();

    if (!cleanNome || !cleanContacto || !cleanServico || !cleanMensagem) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, preencha todos os campos obrigatórios (Nome, Contacto, Serviço e Descrição).',
      });
    }

    const destinationEmail = process.env.CONTACT_DESTINATION_EMAIL || 'savscclda@gmail.com';
    const resendApiKey = process.env.RESEND_API_KEY;
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

    // Fluxo 1: Envio através da API do Resend (se chave de API estiver configurada no servidor)
    if (resendApiKey) {
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
          <div style="background-color: #001a33; color: #ffffff; padding: 24px 28px;">
            <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #93c5fd;">— SAV-SCC, SU, LDA.</p>
            <h2 style="margin: 6px 0 0 0; font-size: 20px; font-weight: bold; color: #ffffff;">Novo Pedido de Marcação de Reunião</h2>
          </div>
          <div style="padding: 28px;">
            <p style="margin-top: 0; font-size: 14px; color: #475569; line-height: 1.5;">
              Foi submetido um novo pedido através do formulário da página <strong>Contactos</strong> do website oficial:
            </p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; width: 140px; color: #001a33;">Nome:</td>
                <td style="padding: 10px 0; color: #334155;">${escapeHtml(cleanNome)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; color: #001a33;">Empresa / Negócio:</td>
                <td style="padding: 10px 0; color: #334155;">${escapeHtml(cleanEmpresa || 'Não especificada')}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; color: #001a33;">Contacto:</td>
                <td style="padding: 10px 0; color: #334155;">${escapeHtml(cleanContacto)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; color: #001a33;">Área de Interesse:</td>
                <td style="padding: 10px 0; color: #334155;">${escapeHtml(cleanServico)}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding: 18px; background-color: #f8fafc; border-left: 4px solid #001a33; border-radius: 4px;">
              <strong style="color: #001a33; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Descrição da Necessidade:</strong>
              <p style="margin: 10px 0 0 0; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${escapeHtml(cleanMensagem)}</p>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 28px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
              Notificação gerada automaticamente pela infraestrutura web da SAV-SCC, SU, LDA.
            </p>
          </div>
        </div>
      `;

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'SAV-SCC Website <onboarding@resend.dev>',
          to: [destinationEmail],
          reply_to: cleanContacto.includes('@') ? cleanContacto : undefined,
          subject: `Novo Pedido de Reunião: ${cleanNome} [${cleanServico}]`,
          html: emailHtml,
        }),
      });

      if (response.ok) {
        return res.status(200).json({
          success: true,
          message: 'O seu pedido de reunião foi recebido com sucesso. A equipa da SAV-SCC entrará em contacto muito brevemente.',
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('[SAV-SCC API] Erro na API externa Resend:', errorData);
        return res.status(502).json({
          success: false,
          error: 'O serviço de entrega de emails encontrou uma dificuldade pontual. Por favor, utilize o nosso WhatsApp direto (+258 82 821 0526).',
        });
      }
    }

    // Fluxo 2: Envio através de Webhook (se configurado no ambiente)
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origem: 'Website SAV-SCC',
          nome: cleanNome,
          empresa: cleanEmpresa,
          contacto: cleanContacto,
          servico: cleanServico,
          mensagem: cleanMensagem,
          dataEnvio: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        return res.status(200).json({
          success: true,
          message: 'O seu pedido de reunião foi recebido com sucesso. A equipa da SAV-SCC entrará em contacto muito brevemente.',
        });
      }
    }

    // Fluxo 3: Credenciais de envio externo ainda não parametrizadas no ambiente
    // Comunicação transparente: não simular sucesso falso
    return res.status(503).json({
      success: false,
      notConfigured: true,
      error: 'O envio automático de email requer a configuração da chave de serviço (ex.: RESEND_API_KEY) no painel de ambiente do servidor. Para resposta imediata, utilize o botão de WhatsApp oficial (+258 82 821 0526) ou telefone.',
    });

  } catch (err) {
    console.error('[SAV-SCC API] Exceção no processamento do formulário:', err);
    return res.status(500).json({
      success: false,
      error: 'Ocorreu um erro no servidor ao processar o seu pedido. Por favor, utilize o WhatsApp ou telefone.',
    });
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
