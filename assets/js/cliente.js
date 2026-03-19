// cliente.js — Dashboard Exclusivo: CLIENTE FINAL
// Funções: status do projeto, documentos, timeline, suporte, WhatsApp

// Projeto do cliente logado (mock: Residência Costa)
const meuProjeto = mockProjetos.find(p => p.id === 'SOL-002') || mockProjetos[0];

document.addEventListener('DOMContentLoaded', initCliente);

function initCliente() {
    if (typeof USE_MOCK_DATA === 'undefined') return;

    document.querySelectorAll('.display-user-name').forEach(el => {
        el.innerText = meuProjeto.cliente;
    });

    _cliRenderKPIs();
    _cliRenderTimeline();
    _cliRenderDocumentos();
}

// ====== KPIs DO CLIENTE ======
function _cliRenderKPIs() {
    const p = meuProjeto;
    const geracao   = (p.potencia_kwp * 110).toFixed(0);   // estimativa kWh/mês
    const economia  = p.potencia_kwp * 110 * 0.85;          // em R$/mês a 0,85/kWh
    const payback   = Math.round(p.valor_total / (economia * 12));

    set('kpiCliSistema',   p.potencia_kwp + ' kWp');
    set('kpiCliStatus',    p.status);
    set('kpiCliValor',     formatCurrency(p.valor_total));
    set('kpiCliGeracao',   geracao + ' kWh/mês*');
    set('kpiCliEconomia',  formatCurrency(economia) + '/mês*');
    set('kpiCliPayback',   payback + ' anos*');
}

// ====== TIMELINE VISUAL ======
function _cliRenderTimeline() {
    const fases = ['Venda', 'Projeto', 'Instalação', 'Homologação', 'Concluído'];
    const ci    = fases.indexOf(meuProjeto.status);

    document.querySelectorAll('.timeline-step').forEach((step, i) => {
        step.classList.remove('completed', 'active', 'pending');
        if (meuProjeto.status === 'Concluído' || i < ci) {
            step.classList.add('completed');
        } else if (i === ci) {
            step.classList.add('active');
        } else {
            step.classList.add('pending');
        }
    });

    const desc = document.getElementById('cliDesc');
    if (desc) {
        const msgs = {
            'Venda':       'Contrato assinado! Aguardando início do projeto elétrico.',
            'Projeto':     'Nossa equipe está elaborando o projeto elétrico do seu sistema.',
            'Instalação':  'Os painéis e inversores estão sendo instalados! Em breve você estará gerando energia.',
            'Homologação': 'Instalação concluída. Aguardando vistoria e aprovação da concessionária.',
            'Concluído':   '🎉 Sistema ativo! Você já está gerando energia solar.',
        };
        desc.innerText = msgs[meuProjeto.status] || '';
    }
}

// ====== LISTA DE DOCUMENTOS ======
function _cliRenderDocumentos() {
    const tbody = document.getElementById('cliDocsBody');
    if (!tbody) return;

    tbody.innerHTML = mockDocumentos.map(d => `
        <tr class="${d.disponivel ? '' : 'doc-indisponivel'}">
            <td><i class="ph-fill ph-file-pdf" style="color:var(--danger-color);margin-right:.4rem;"></i>${d.nome}</td>
            <td>${d.tipo}</td>
            <td>${d.data}</td>
            <td>
                ${d.disponivel
                    ? `<button class="btn btn-sm btn-ghost" onclick="cliBaixar('${d.id}','${d.nome}')" title="Download"><i class="ph ph-download-simple"></i> Baixar</button>`
                    : `<span style="color:var(--text-light);font-size:.8rem;"><i class="ph ph-clock"></i> Aguardando</span>`
                }
            </td>
        </tr>`).join('');
}

// ====== DOWNLOAD ======
function cliBaixar(id, nome) {
    alert(`⬇️ Download iniciado!\n\nArquivo: ${nome}\n\nO arquivo será baixado em instantes.\n(Em produção, o arquivo virá do Supabase Storage.)`);
}

// ====== WHATSAPP ======
function cliWhatsApp(numero, nome) {
    const msg  = encodeURIComponent(`Olá ${nome}, sou ${meuProjeto.cliente}. Tenho uma dúvida sobre meu projeto ${meuProjeto.id}.`);
    const link = `https://wa.me/55${numero.replace(/\D/g,'')}?text=${msg}`;
    window.open(link, '_blank');
}

// ====== ABRIR CHAMADO ======
function cliAbrirChamado() { openModal('modalChamado'); }

function cliEnviarChamado() {
    const assunto = document.getElementById('chamadoAssunto')?.value;
    const msg     = document.getElementById('chamadoMsg')?.value?.trim();
    if (!assunto || !msg) { alert('Preencha assunto e mensagem!'); return; }

    const ticket = 'SOL-TKT-' + Math.floor(Math.random() * 90000 + 10000);
    alert(`✅ Chamado registrado!\n\nNúmero: ${ticket}\nAssunto: ${assunto}\n\nRetorno em até 24 horas úteis.\nUm e-mail de confirmação foi enviado.`);
    closeModal('modalChamado');
    const el = document.getElementById('chamadoMsg');
    if (el) el.value = '';
}

// ====== AVALIAÇÃO DO SERVIÇO ======
function cliAvaliar(nota) {
    const msgs = { 5:'⭐⭐⭐⭐⭐ Ótimo! Obrigado pela avaliação!', 4:'⭐⭐⭐⭐ Muito obrigado!', 3:'⭐⭐⭐ Obrigado! Vamos melhorar.', 2:'⭐⭐ Obrigado. Já abrimos um chamado interno.', 1:'⭐ Lamentamos! Uma equipe entrará em contato urgentemente.' };
    alert(msgs[nota] || 'Avaliação recebida!');
}

// ====== SIMULAR CONSUMO ======
function cliSimularConsumo() {
    const el = document.getElementById('inputConsumo');
    const kwh = parseFloat(el?.value);
    if (!kwh || kwh <= 0) { alert('Informe seu consumo mensal em kWh.'); return; }
    const tarifa = 0.85;
    const economiaTotal  = meuProjeto.potencia_kwp * 110; // kWh gerados/mês
    const economiaValor  = Math.min(kwh, economiaTotal) * tarifa;
    const restoConsumo   = Math.max(0, kwh - economiaTotal);
    const contaRestante  = restoConsumo * tarifa;
    alert(`☀️ SIMULAÇÃO DE ECONOMIA\n\n` +
        `Seu consumo mensal: ${kwh} kWh\n` +
        `Geração estimada  : ${economiaTotal.toFixed(0)} kWh/mês\n\n` +
        `Energia compensada: ${Math.min(kwh, economiaTotal).toFixed(0)} kWh\n` +
        `Economia em R$    : ${formatCurrency(economiaValor)}/mês\n` +
        `Restante na conta : ${formatCurrency(contaRestante)}/mês\n\n` +
        `* Estimativa baseada em 110 kWh/mês por kWp instalado.`);
}
