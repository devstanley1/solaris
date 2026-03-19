// comercial.js — Dashboard Exclusivo: VENDEDOR / COMERCIAL
// Funções: pipeline, novo negócio, editar projeto, metas, agenda

let _projFiltrados = [...mockProjetos];
let _editandoId = null;

document.addEventListener('DOMContentLoaded', initComercial);

function initComercial() {
    if (typeof USE_MOCK_DATA === 'undefined') return;

    document.querySelectorAll('.display-user-name').forEach(el => {
        el.innerText = USE_MOCK_DATA ? 'João Silva — Comercial' : '...';
    });

    _projFiltrados = [...mockProjetos];
    _comRenderKPIs();
    _comRenderPipeline();
    _comRenderMetas();
}

// ====== KPIs DE VENDAS ======
function _comRenderKPIs() {
    const todos      = mockProjetos;
    const propostas  = todos.filter(p => p.status === 'Venda');
    const fechados   = todos.filter(p => p.status !== 'Venda');
    const kwpVendido = todos.reduce((s, p) => s + p.potencia_kwp, 0);
    const fatMes     = propostas.reduce((s, p) => s + p.valor_total, 0) +
                       fechados.reduce((s, p) => s + p.valor_total, 0);

    set('kpiComPropostas',  String(propostas.length));
    set('kpiComFechados',   String(fechados.length));
    set('kpiComKwp',        kwpVendido.toFixed(1));
    set('kpiComFaturado',   formatCurrency(fatMes));
    set('kpiComConversao',  Math.round((fechados.length / todos.length) * 100) + '%');
}

// ====== PIPELINE DE NEGOCIAÇÕES ======
function _comRenderPipeline() {
    const tbody = document.getElementById('comPipelineBody');
    if (!tbody) return;

    if (!_projFiltrados.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-light)">Nenhum resultado encontrado.</td></tr>';
        return;
    }

    tbody.innerHTML = _projFiltrados.map(p => {
        const bc = badgeClass(p.status);
        return `<tr>
            <td><strong>${p.id}</strong></td>
            <td>${p.cliente}</td>
            <td>${p.potencia_kwp} kWp</td>
            <td>${formatCurrency(p.valor_total)}</td>
            <td>${p.concessionaria}</td>
            <td><span class="badge ${bc}">${p.status}</span></td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="comVerDetalhes('${p.id}')" title="Ver detalhes"><i class="ph ph-eye"></i></button>
                <button class="btn btn-sm btn-ghost" onclick="comAbrirEdicao('${p.id}')" title="Editar"><i class="ph ph-pencil"></i></button>
                <button class="btn btn-sm btn-ghost" onclick="comGerarProposta('${p.id}')" title="Gerar proposta"><i class="ph ph-file-pdf"></i></button>
            </td>
        </tr>`;
    }).join('');
}

// ====== METAS DO MÊS ======
function _comRenderMetas() {
    const metaKwp = 200; // kWp meta do mês
    const metaVal = 700000; // valor meta
    const realKwp = mockProjetos.reduce((s, p) => s + p.potencia_kwp, 0);
    const realVal = mockProjetos.reduce((s, p) => s + p.valor_total, 0);
    const pctKwp  = Math.min(100, Math.round((realKwp / metaKwp) * 100));
    const pctVal  = Math.min(100, Math.round((realVal / metaVal) * 100));

    set('metaKwpReal',  realKwp.toFixed(1));
    set('metaKwpTotal', String(metaKwp));
    set('metaValReal',  formatCurrency(realVal));
    set('metaValTotal', formatCurrency(metaVal));

    const barKwp = document.getElementById('progressKwp');
    const barVal = document.getElementById('progressVal');
    if (barKwp) barKwp.style.width = pctKwp + '%';
    if (barVal) barVal.style.width = pctVal + '%';

    set('pctKwp', pctKwp + '%');
    set('pctVal', pctVal + '%');
}

// ====== BUSCA / FILTRO ======
function comFiltrar() {
    const q = (document.getElementById('comBusca')?.value || '').toLowerCase().trim();
    const s = document.getElementById('comFiltroStatus')?.value || 'Todos';

    _projFiltrados = mockProjetos.filter(p => {
        const matchQ = !q ||
            p.cliente.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q) ||
            p.concessionaria.toLowerCase().includes(q);
        const matchS = (s === 'Todos') || p.status === s;
        return matchQ && matchS;
    });
    _comRenderPipeline();
}

function comLimparFiltro() {
    const busca = document.getElementById('comBusca');
    const sel   = document.getElementById('comFiltroStatus');
    if (busca) busca.value = '';
    if (sel)   sel.value   = 'Todos';
    _projFiltrados = [...mockProjetos];
    _comRenderPipeline();
}

// ====== VER DETALHES ======
function comVerDetalhes(id) {
    const p = mockProjetos.find(x => x.id === id);
    if (!p) return;
    alert(`📋 DETALHES DO PROJETO ${p.id}\n\n` +
        `Cliente         : ${p.cliente}\n` +
        `Potência        : ${p.potencia_kwp} kWp\n` +
        `Valor           : ${formatCurrency(p.valor_total)}\n` +
        `Concessionária  : ${p.concessionaria}\n` +
        `Responsável Eng.: ${p.responsavel}\n` +
        `Status          : ${p.status}\n` +
        `Data cadastro   : ${p.data}`);
}

// ====== EDITAR PROJETO ======
function comAbrirEdicao(id) {
    const p = mockProjetos.find(x => x.id === id);
    if (!p) return;
    _editandoId = id;
    const f = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val; };
    f('editCliente', p.cliente);
    f('editKwp',     p.potencia_kwp);
    f('editValor',   p.valor_total);
    f('editConc',    p.concessionaria);
    f('editStatus',  p.status);
    openModal('modalEditar');
}

function comSalvarEdicao() {
    const p = mockProjetos.find(x => x.id === _editandoId);
    if (!p) return;
    const g = (id) => document.getElementById(id)?.value;
    p.cliente        = g('editCliente')  || p.cliente;
    p.potencia_kwp   = parseFloat(g('editKwp'))   || p.potencia_kwp;
    p.valor_total    = parseFloat(g('editValor')) || p.valor_total;
    p.concessionaria = g('editConc')     || p.concessionaria;
    p.status         = g('editStatus')   || p.status;
    alert(`✅ Projeto "${p.cliente}" atualizado!`);
    closeModal('modalEditar');
    initComercial();
}

// ====== GERAR PROPOSTA ======
function comGerarProposta(id) {
    const p = mockProjetos.find(x => x.id === id);
    if (!p) return;
    alert(`📄 PROPOSTA COMERCIAL\n\n` +
        `Nº: PROP-${p.id}-${new Date().getFullYear()}\n` +
        `Cliente: ${p.cliente}\n\n` +
        `SISTEMA FOTOVOLTAICO\n` +
        `├─ Potência          : ${p.potencia_kwp} kWp\n` +
        `├─ Concessionária    : ${p.concessionaria}\n` +
        `├─ Investimento      : ${formatCurrency(p.valor_total)}\n` +
        `├─ Geração estimada  : ${(p.potencia_kwp * 110).toFixed(0)} kWh/mês\n` +
        `├─ Economia estimada : ${formatCurrency(p.potencia_kwp * 110 * 0.85)}/mês\n` +
        `└─ Payback estimado  : ${Math.round(p.valor_total / (p.potencia_kwp * 110 * 0.85 * 12))} anos\n\n` +
        `(Proposta gerada em ${new Date().toLocaleDateString('pt-BR')})`);
}

// ====== NOVO NEGÓCIO ======
function comAbrirNovoNegocio() { openModal('modalNovoNegocio'); }

function comSalvarNovoNegocio() {
    const g = (id) => document.getElementById(id)?.value?.trim();
    const nome    = g('novoCliente');
    const kwp     = parseFloat(g('novoKwp'));
    const valor   = parseFloat(g('novoValor'));
    const conc    = g('novoConc');
    if (!nome || !kwp || !valor) { alert('Preencha todos os campos!'); return; }

    const novoId = 'SOL-' + String(mockProjetos.length + 1).padStart(3, '0');
    mockProjetos.unshift({
        id: novoId, cliente: nome, responsavel: 'João Silva',
        potencia_kwp: kwp, valor_total: valor, concessionaria: conc,
        status: 'Venda', data: new Date().toLocaleDateString('pt-BR')
    });
    alert(`✅ Novo negócio cadastrado!\n${novoId} — ${nome} — ${kwp}kWp — ${formatCurrency(valor)}`);
    closeModal('modalNovoNegocio');
    ['novoCliente','novoKwp','novoValor'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
    initComercial();
}

// ====== AGENDA (simulada) ======
function comVerAgenda() {
    const agenda = [
        { hora: '09:00', ativ: 'Visita — Supermercado Silva (proposta 45kWp)' },
        { hora: '11:00', ativ: 'Reunião interna — apresentação metas Q1' },
        { hora: '14:30', ativ: 'Ligação — Clínica Médica Vida (follow-up)' },
        { hora: '16:00', ativ: 'Proposta — Condomínio Vista Mar (60kWp)' },
    ];
    let txt = `📅 AGENDA — ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    agenda.forEach(a => { txt += `${a.hora}  ${a.ativ}\n`; });
    alert(txt);
}
