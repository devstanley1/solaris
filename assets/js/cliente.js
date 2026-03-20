// cliente.js — Dashboard Exclusivo: CLIENTE FINAL

const meuProjeto = mockProjetos.find(p => p.id === 'SOL-002') || mockProjetos[0];

document.addEventListener('DOMContentLoaded', initCliente);

function initCliente() {
    if (typeof USE_MOCK_DATA === 'undefined') return;
    document.querySelectorAll('.display-user-name').forEach(el => { el.innerText = meuProjeto.cliente; });
    _cliRenderKPIs();
    _cliRenderTimeline();
    _cliRenderDetalhes();
    _cliRenderDocumentos();
}

function _cliRenderKPIs() {
    const p        = meuProjeto;
    const geracao  = (p.potencia_kwp * 110).toFixed(0);
    const economia = p.potencia_kwp * 110 * 0.85;
    const payback  = Math.round(p.valor_total / (economia * 12));
    set('kpiCliSistema',  p.potencia_kwp + ' kWp');
    set('kpiCliStatus',   p.status);
    set('kpiCliValor',    formatCurrency(p.valor_total));
    set('kpiCliGeracao',  geracao + ' kWh/mês');
    set('kpiCliEconomia', formatCurrency(economia) + '/mês');
    set('kpiCliPayback',  payback + ' anos');
}

function _cliRenderTimeline() {
    const fases = ['Venda','Projeto','Instalação','Homologação','Concluído'];
    const ci    = fases.indexOf(meuProjeto.status);
    document.querySelectorAll('.timeline-step').forEach((step, i) => {
        step.classList.remove('completed','active','pending');
        if (meuProjeto.status === 'Concluído' || i < ci) step.classList.add('completed');
        else if (i === ci)                                step.classList.add('active');
    });
    const msgs = {
        'Venda':       'Contrato assinado! Aguardando início do projeto elétrico.',
        'Projeto':     'Nossa equipe está elaborando o projeto elétrico do seu sistema.',
        'Instalação':  '🔧 Instalação em andamento! Os painéis estão sendo montados.',
        'Homologação': 'Aguardando vistoria e aprovação da concessionária.',
        'Concluído':   '🎉 Sistema ativo! Você já está gerando energia solar.',
    };
    set('cliDesc', msgs[meuProjeto.status] || '');
}

function _cliRenderDetalhes() {
    const p    = meuProjeto;
    const div  = document.getElementById('cliDetalhes');
    if (!div) return;
    const infoRow = (l,v) => `<div class="info-row"><span>${l}</span><span><strong>${v}</strong></span></div>`;
    div.innerHTML =
        infoRow('Código do Projeto', p.id) +
        infoRow('Potência', p.potencia_kwp + ' kWp') +
        infoRow('Concessionária', p.concessionaria) +
        infoRow('Resp. Técnico', p.responsavel) +
        infoRow('Data do Contrato', p.data) +
        infoRow('Status', p.status);
}

function _cliRenderDocumentos() {
    const tbody = document.getElementById('cliDocsBody');
    if (!tbody) return;
    tbody.innerHTML = mockDocumentos.map(d => `
        <tr class="${d.disponivel?'':'doc-indisponivel'}">
            <td><i class="ph-fill ph-file-pdf" style="color:var(--danger-color);margin-right:.4rem;"></i>${d.nome}</td>
            <td>${d.tipo}</td>
            <td>${d.data}</td>
            <td>${d.disponivel
                ? '<span style="color:var(--success-color);font-size:.8rem;font-weight:600;">✅ Disponível</span>'
                : '<span style="color:var(--text-light);font-size:.8rem;">⏳ Aguardando</span>'}</td>
            <td>${d.disponivel
                ? `<button class="btn btn-sm btn-ghost" onclick="cliBaixar('${d.id}','${d.nome}')"><i class="ph ph-download-simple"></i> Baixar</button>`
                : `<button class="btn btn-sm btn-ghost" disabled><i class="ph ph-lock-key"></i></button>`}</td>
        </tr>`).join('');
}

// ====== SIMULADOR ======
function cliCalcularSimulador() {
    const consumo = parseFloat(document.getElementById('simConsumo')?.value);
    const tarifa  = parseFloat(document.getElementById('simTarifa')?.value) || 0.85;
    const kwp     = parseFloat(document.getElementById('simKwp')?.value)    || meuProjeto.potencia_kwp;
    if (!consumo || consumo <= 0) { alert('Informe o consumo mensal em kWh!'); return; }

    const gerado       = kwp * 110;
    const compensado   = Math.min(consumo, gerado);
    const economiaVal  = compensado * tarifa;
    const resto        = Math.max(0, consumo - gerado);
    const contaResto   = resto * tarifa;
    const paybackAnos  = (meuProjeto.valor_total / (economiaVal * 12)).toFixed(1);

    const box = document.getElementById('simResultado');
    const body = document.getElementById('simResultadoBody');
    if (box)  box.style.display = 'block';
    if (body) {
        const infoRow = (l,v,c) => `<div class="info-row"><span>${l}</span><span style="color:${c||'var(--primary-color)'}"><strong>${v}</strong></span></div>`;
        body.innerHTML =
            infoRow('Consumo mensal',       consumo + ' kWh') +
            infoRow('Geração estimada',     gerado.toFixed(0) + ' kWh/mês') +
            infoRow('Energia compensada',   compensado.toFixed(0) + ' kWh', 'var(--success-color)') +
            infoRow('Economia mensal',      formatCurrency(economiaVal), 'var(--success-color)') +
            infoRow('Restante na conta',    formatCurrency(contaResto)) +
            infoRow('Payback estimado',     paybackAnos + ' anos');
    }

    // Fill retorno table
    const tbody = document.getElementById('simTabelaRetorno');
    if (tbody) {
        const linhas = [[1,'ano'],[2,'anos'],[5,'anos'],[10,'anos'],[15,'anos'],[25,'anos']];
        tbody.innerHTML = linhas.map(([n, label]) => {
            const kwh      = gerado * 12 * n;
            const eco      = economiaVal * 12 * n;
            const retorno  = eco - meuProjeto.valor_total;
            const cor      = retorno >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
            return `<tr>
                <td>${n} ${label}</td>
                <td>${kwh.toFixed(0)} kWh</td>
                <td>${formatCurrency(eco)}</td>
                <td style="color:${cor};font-weight:700">${retorno >= 0 ? '+' : ''}${formatCurrency(retorno)}</td>
            </tr>`;
        }).join('');
    }
}

// ====== DOWNLOAD ======
function cliBaixar(id, nome) {
    alert(`⬇️ Download: "${nome}"\nO arquivo será baixado em instantes.`);
}

// ====== WHATSAPP ======
function cliWhatsApp(numero, nome) {
    const msg = encodeURIComponent(`Olá ${nome}, sou ${meuProjeto.cliente}. Tenho uma dúvida sobre meu projeto ${meuProjeto.id}.`);
    window.open(`https://wa.me/55${numero.replace(/\D/g,'')}?text=${msg}`, '_blank');
}

// ====== CHAMADO ======
function cliEnviarChamado() {
    const assunto = document.getElementById('chamadoAssunto')?.value;
    const msg     = document.getElementById('chamadoMsg')?.value?.trim();
    if (!assunto || !msg) { alert('Preencha assunto e mensagem!'); return; }
    const ticket = 'SOL-TKT-' + Math.floor(Math.random()*90000+10000);
    alert(`✅ Chamado registrado!\n\nNúmero: ${ticket}\nAssunto: ${assunto}\n\nRetorno em até 24 horas úteis.`);
    const el = document.getElementById('chamadoMsg');
    if (el) el.value = '';
}

// ====== AVALIAÇÃO ======
function cliAvaliar(nota) {
    const msgs = { 5:'⭐⭐⭐⭐⭐ Excelente! Muito obrigado!', 4:'⭐⭐⭐⭐ Obrigado pela avaliação!', 3:'⭐⭐⭐ Obrigado! Vamos melhorar.', 2:'⭐⭐ Desculpe! Entraremos em contato.', 1:'⭐ Lamentamos! Você será contatado urgentemente.' };
    alert(msgs[nota] || 'Avaliação recebida!');
}
