// comercial.js — Dashboard Exclusivo: VENDEDOR / COMERCIAL

let _projFiltrados = [...mockProjetos];
let _editandoId = null;

document.addEventListener('DOMContentLoaded', initComercial);

function initComercial() {
    if (typeof USE_MOCK_DATA === 'undefined') return;
    document.querySelectorAll('.display-user-name').forEach(el => { el.innerText = 'João Silva'; });
    _projFiltrados = [...mockProjetos];
    _comRenderKPIs();
    _comRenderPipeline();
    _comRenderMetas();
    _comRenderAgenda();
}

function _comRenderKPIs() {
    const propostas  = mockProjetos.filter(p => p.status === 'Venda').length;
    const fechados   = mockProjetos.filter(p => p.status !== 'Venda').length;
    const kwp        = mockProjetos.reduce((s,p) => s+p.potencia_kwp, 0);
    const fat        = mockProjetos.reduce((s,p) => s+p.valor_total, 0);
    const conversao  = Math.round((fechados / mockProjetos.length) * 100);
    set('kpiComPropostas', String(propostas));
    set('kpiComFechados',  String(fechados));
    set('kpiComKwp',       kwp.toFixed(1));
    set('kpiComFaturado',  formatCurrency(fat));
    set('kpiComConversao', conversao + '%');
}

function _comRenderPipeline() {
    const tbody = document.getElementById('comPipelineBody');
    if (!tbody) return;
    if (!_projFiltrados.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-light)">Nenhum resultado.</td></tr>';
        return;
    }
    tbody.innerHTML = _projFiltrados.map(p => `
        <tr>
            <td><strong>${p.id}</strong></td>
            <td>${p.cliente}</td>
            <td>${p.potencia_kwp} kWp</td>
            <td>${formatCurrency(p.valor_total)}</td>
            <td>${p.concessionaria}</td>
            <td><span class="badge ${badgeClass(p.status)}">${p.status}</span></td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="comVerDetalhes('${p.id}')" title="Ver"><i class="ph ph-eye"></i></button>
                <button class="btn btn-sm btn-ghost" onclick="comAbrirEdicao('${p.id}')" title="Editar"><i class="ph ph-pencil"></i></button>
                <button class="btn btn-sm btn-ghost" onclick="comGerarProposta('${p.id}')" title="Proposta PDF"><i class="ph ph-file-pdf"></i></button>
            </td>
        </tr>`).join('');
}

function _comRenderMetas() {
    const metaKwp = 200, metaVal = 700000;
    const realKwp = mockProjetos.reduce((s,p) => s+p.potencia_kwp, 0);
    const realVal = mockProjetos.reduce((s,p) => s+p.valor_total, 0);
    const pctK = Math.min(100, Math.round(realKwp/metaKwp*100));
    const pctV = Math.min(100, Math.round(realVal/metaVal*100));

    set('metaKwpReal',  realKwp.toFixed(1));
    set('metaKwpTotal', String(metaKwp));
    set('metaValReal',  formatCurrency(realVal));
    set('metaValTotal', formatCurrency(metaVal));
    set('pctKwp',       pctK + '% da meta');
    set('pctVal',       pctV + '% da meta');

    const bK = document.getElementById('progressKwp');
    const bV = document.getElementById('progressVal');
    if (bK) bK.style.width = pctK + '%';
    if (bV) bV.style.width = pctV + '%';
}

function _comRenderAgenda() {
    const hoje = new Date();
    set('dataHoje', hoje.toLocaleDateString('pt-BR', {weekday:'long',day:'2-digit',month:'long'}));

    const compromissos = [
        { hora:'09:00', desc:'Visita — Supermercado Silva (proposta 45kWp)', tipo:'visita' },
        { hora:'11:00', desc:'Reunião interna — metas Q1 2026',              tipo:'reuniao' },
        { hora:'14:30', desc:'Ligação — Clínica Médica Vida (follow-up)',     tipo:'ligacao' },
        { hora:'16:00', desc:'Apresentação — Condomínio Vista Mar (60kWp)',   tipo:'apresentacao' },
    ];
    const icons = { visita:'ph-map-pin', reuniao:'ph-users', ligacao:'ph-phone', apresentacao:'ph-presentation' };
    const agDiv = document.getElementById('agendaHoje');
    if (agDiv) agDiv.innerHTML = compromissos.map(c => `
        <div style="display:flex;gap:.75rem;padding:.6rem 0;border-bottom:1px solid var(--border-color);align-items:center;">
            <span style="font-weight:700;font-size:.8rem;color:var(--secondary-color);min-width:42px;">${c.hora}</span>
            <i class="ph ${icons[c.tipo]||'ph-calendar'}" style="color:var(--text-light);font-size:1rem;"></i>
            <span style="font-size:.85rem;">${c.desc}</span>
        </div>`).join('');

    const followup = [
        { cliente:'Clínica Médica Vida',   dias:3,  valor:52000 },
        { cliente:'Padaria Central',       dias:7,  valor:78000 },
        { cliente:'Condomínio Vista Mar',  dias:1,  valor:195000 },
    ];
    const fDiv = document.getElementById('agendaFollowup');
    if (fDiv) fDiv.innerHTML = followup.map(f => `
        <div class="info-row">
            <span>${f.cliente}</span>
            <span style="color:${f.dias<=2?'var(--danger-color)':'var(--warning-color)'}">
                ${f.dias <= 2 ? '🔴' : '🟡'} ${f.dias}d — ${formatCurrency(f.valor)}
            </span>
        </div>`).join('');
}

// ====== FILTRO ======
function comFiltrar() {
    const q = (document.getElementById('comBusca')?.value || '').toLowerCase().trim();
    const s = document.getElementById('comFiltroStatus')?.value || 'Todos';
    _projFiltrados = mockProjetos.filter(p => {
        const mq = !q || p.cliente.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.concessionaria.toLowerCase().includes(q);
        const ms = s === 'Todos' || p.status === s;
        return mq && ms;
    });
    _comRenderPipeline();
}

function comLimparFiltro() {
    const b = document.getElementById('comBusca');
    const s = document.getElementById('comFiltroStatus');
    if (b) b.value = ''; if (s) s.value = 'Todos';
    _projFiltrados = [...mockProjetos];
    _comRenderPipeline();
}

// ====== AÇÕES ======
function comVerDetalhes(id) {
    const p = mockProjetos.find(x => x.id === id);
    if (!p) return;
    alert(`📋 DETALHES — ${p.id}\n\nCliente: ${p.cliente}\nkWp: ${p.potencia_kwp}\nValor: ${formatCurrency(p.valor_total)}\nConcessionária: ${p.concessionaria}\nResponsável: ${p.responsavel}\nStatus: ${p.status}\nData: ${p.data}`);
}

function comAbrirEdicao(id) {
    const p = mockProjetos.find(x => x.id === id);
    if (!p) return;
    _editandoId = id;
    const f = (el, v) => { const e = document.getElementById(el); if(e) e.value = v; };
    f('editCliente', p.cliente); f('editKwp', p.potencia_kwp); f('editValor', p.valor_total);
    f('editConc', p.concessionaria); f('editStatus', p.status);
    openModal('modalEditar');
}

function comSalvarEdicao() {
    const p = mockProjetos.find(x => x.id === _editandoId);
    if (!p) return;
    const g = id => document.getElementById(id)?.value;
    p.cliente = g('editCliente') || p.cliente;
    p.potencia_kwp  = parseFloat(g('editKwp'))   || p.potencia_kwp;
    p.valor_total   = parseFloat(g('editValor')) || p.valor_total;
    p.concessionaria = g('editConc') || p.concessionaria;
    p.status = g('editStatus') || p.status;
    alert(`✅ "${p.cliente}" atualizado!`);
    closeModal('modalEditar');
    initComercial();
}

function comGerarProposta(id) {
    const p = mockProjetos.find(x => x.id === id);
    if (!p) return;
    const eco = p.potencia_kwp * 110 * 0.85;
    const pb  = Math.round(p.valor_total / (eco * 12));
    alert(`📄 PROPOSTA — PROP-${p.id}-2026\n\nCliente: ${p.cliente}\nSistema: ${p.potencia_kwp}kWp\nValor: ${formatCurrency(p.valor_total)}\nGeração: ${(p.potencia_kwp*110).toFixed(0)} kWh/mês\nEconomia: ${formatCurrency(eco)}/mês\nPayback: ~${pb} anos\n\nConcessionária: ${p.concessionaria}`);
}

function comSalvarNovoNegocio() {
    const g  = id => document.getElementById(id)?.value?.trim();
    const nome  = g('novoCliente');
    const kwp   = parseFloat(g('novoKwp'));
    const valor = parseFloat(g('novoValor'));
    const conc  = g('novoConc');
    if (!nome || !kwp || !valor) { alert('Preencha cliente, kWp e valor!'); return; }
    const novoId = 'SOL-' + String(mockProjetos.length+1).padStart(3,'0');
    mockProjetos.unshift({ id:novoId, cliente:nome, responsavel:'João Silva', potencia_kwp:kwp, valor_total:valor, concessionaria:conc, status:'Venda', data:new Date().toLocaleDateString('pt-BR') });
    alert(`✅ Negócio cadastrado!\n${novoId} — ${nome} — ${kwp}kWp — ${formatCurrency(valor)}`);
    ['novoCliente','novoKwp','novoValor','novoTelefone','novoEmail','novoEndereco','novoObs'].forEach(id => { const e=document.getElementById(id); if(e) e.value=''; });
    initComercial();
    showPage('pipeline');
}

function comGerarAgenda() { _comRenderAgenda(); alert('Agenda atualizada!'); }
