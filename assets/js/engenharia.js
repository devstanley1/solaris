// engenharia.js — Dashboard Exclusivo: ENGENHEIRO

let _enFiltrados = [];
let _enProjetoAtual = null;

document.addEventListener('DOMContentLoaded', initEngenharia);

function initEngenharia() {
    if (typeof USE_MOCK_DATA === 'undefined') return;
    document.querySelectorAll('.display-user-name').forEach(el => { el.innerText = 'Eng. Roberto Marques'; });
    _enFiltrados = mockProjetos.filter(p => ['Projeto','Instalação','Homologação','Concluído'].includes(p.status));
    _enRenderKPIs(_enFiltrados);
    _enRenderObras(_enFiltrados);
    _enRenderChecklist();
    _enRenderRelatorio();
}

function _enRenderKPIs(lista) {
    set('kpiEnProjeto',    String(lista.filter(p=>p.status==='Projeto').length));
    set('kpiEnInstalacao', String(lista.filter(p=>p.status==='Instalação').length));
    set('kpiEnHomologacao',String(lista.filter(p=>p.status==='Homologação').length));
    set('kpiEnConcluido',  String(lista.filter(p=>p.status==='Concluído').length));
    const kwpAtivo = lista.filter(p=>p.status!=='Concluído').reduce((s,p)=>s+p.potencia_kwp,0);
    set('kpiEnKwpAtivo', kwpAtivo.toFixed(1) + ' kWp');
}

function _enRenderObras(lista) {
    const tbody = document.getElementById('enObrasBody');
    if (!tbody) return;
    const ativas = lista.filter(p => p.status !== 'Concluído');
    if (!ativas.length) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-light)">Nenhuma obra ativa.</td></tr>'; return; }
    tbody.innerHTML = ativas.map(p => `
        <tr>
            <td><strong>${p.id}</strong></td>
            <td>${p.cliente}</td>
            <td>${p.potencia_kwp} kWp</td>
            <td>${p.concessionaria}</td>
            <td><span class="badge ${badgeClass(p.status)}">${p.status}</span></td>
            <td>${p.responsavel}</td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="showPage('documentacao')" title="Documentação"><i class="ph ph-folder-open"></i></button>
                <button class="btn btn-sm btn-ghost" onclick="enChecklist('${p.id}')" title="Checklist"><i class="ph ph-check-square"></i></button>
                <button class="btn btn-sm btn-ghost" onclick="enAvancarFase('${p.id}')" title="Avançar fase"><i class="ph ph-arrow-fat-right"></i></button>
            </td>
        </tr>`).join('');
}

function _enRenderChecklist() {
    const tbody = document.getElementById('checklistBody');
    if (!tbody) return;
    const obras = mockProjetos.filter(p => ['Projeto','Instalação','Homologação'].includes(p.status));
    const docStages = { 'Projeto': [false,false,false,false], 'Instalação': [true,true,false,false], 'Homologação': [true,true,true,false] };
    const tick = ok => ok ? '<span style="color:var(--success-color)">✅</span>' : '<span style="color:var(--text-light)">☐</span>';
    tbody.innerHTML = obras.map(p => {
        const d = docStages[p.status] || [false,false,false,false];
        return `<tr>
            <td><strong>${p.id}</strong></td>
            <td>${p.cliente}</td>
            <td><span class="badge ${badgeClass(p.status)}">${p.status}</span></td>
            <td style="text-align:center">${tick(d[0])}</td>
            <td style="text-align:center">${tick(d[1])}</td>
            <td style="text-align:center">${tick(d[2])}</td>
            <td style="text-align:center">${tick(d[3])}</td>
        </tr>`;
    }).join('');
}

function _enRenderRelatorio() {
    const base = mockProjetos.filter(p => ['Projeto','Instalação','Homologação','Concluído'].includes(p.status));
    const infoRow = (l, v) => `<div class="info-row"><span>${l}</span><span><strong>${v}</strong></span></div>`;

    const fDiv = document.getElementById('relatorioFases');
    if (fDiv) fDiv.innerHTML =
        infoRow('Projeto Elétrico', base.filter(p=>p.status==='Projeto').length + ' obras') +
        infoRow('Em Instalação',    base.filter(p=>p.status==='Instalação').length + ' obras') +
        infoRow('Homologação',      base.filter(p=>p.status==='Homologação').length + ' obras') +
        infoRow('Concluídos',       base.filter(p=>p.status==='Concluído').length + ' obras');

    const kwpAtivo = base.filter(p=>p.status!=='Concluído').reduce((s,p)=>s+p.potencia_kwp,0);
    const kwpCon   = base.filter(p=>p.status==='Concluído').reduce((s,p)=>s+p.potencia_kwp,0);
    const pDiv = document.getElementById('relatorioPotencia');
    if (pDiv) pDiv.innerHTML =
        infoRow('kWp em obras',   kwpAtivo.toFixed(1) + ' kWp') +
        infoRow('kWp concluídos', kwpCon.toFixed(1) + ' kWp') +
        infoRow('kWp total',      (kwpAtivo+kwpCon).toFixed(1) + ' kWp');

    const resps = {};
    base.forEach(p => { resps[p.responsavel] = (resps[p.responsavel] || 0) + 1; });
    const rDiv = document.getElementById('relatorioResponsaveis');
    if (rDiv) rDiv.innerHTML = Object.entries(resps).map(([n,c]) => infoRow(n, c + ' obra(s)')).join('');

    const tbody = document.getElementById('relatorioObrasBody');
    if (tbody) tbody.innerHTML = base.map((p,i) => `
        <tr>
            <td>${p.id}</td>
            <td>${p.cliente}</td>
            <td>${p.potencia_kwp} kWp</td>
            <td>${p.concessionaria}</td>
            <td><span class="badge ${badgeClass(p.status)}">${p.status}</span></td>
            <td>${p.responsavel}</td>
        </tr>`).join('');
}

// ====== FILTRO ======
function enFiltrar() {
    const fase = document.getElementById('enFiltroFase')?.value || 'Todos';
    const base = mockProjetos.filter(p => ['Projeto','Instalação','Homologação','Concluído'].includes(p.status));
    _enFiltrados = fase === 'Todos' ? base : base.filter(p => p.status === fase);
    _enRenderKPIs(_enFiltrados);
    _enRenderObras(_enFiltrados);
}

// ====== AVANÇAR FASE ======
function enAvancarFase(id) {
    const fases = ['Venda','Projeto','Instalação','Homologação','Concluído'];
    const p = mockProjetos.find(x => x.id === id);
    if (!p) return;
    const idx = fases.indexOf(p.status);
    if (idx >= fases.length - 1) { alert('Projeto já concluído.'); return; }
    const nova = fases[idx+1];
    if (!confirm(`Avançar "${p.cliente}"?\n${p.status} → ${nova}`)) return;
    p.status = nova;
    alert(`✅ ${p.id} agora está em: ${nova}`);
    initEngenharia();
}

// ====== CHECKLIST ALERT ======
function enChecklist(id) {
    const p = mockProjetos.find(x => x.id === id);
    if (!p) return;
    const docs = {
        'Projeto':     ['☐ Projeto Unifilar', '☐ Memorial Descritivo', '☐ ART assinada', '☐ Aprovação Conc.'],
        'Instalação':  ['✅ Projeto Unifilar', '✅ Memorial Descritivo', '✅ ART assinada', '☐ Fotos Instalação', '☐ Comissionamento'],
        'Homologação': ['✅ Projeto Unifilar', '✅ ART assinada', '✅ Fotos', '☐ Termo de Vistoria'],
    };
    alert(`📋 CHECKLIST — ${p.id}\nCliente: ${p.cliente}\nFase: ${p.status}\n\n${(docs[p.status]||['✅ Tudo concluído']).join('\n')}`);
}

// ====== UPLOAD (Página Documentação) ======
function enConfimarUploadDocPag() {
    const tipo    = document.getElementById('docTipo')?.value;
    const projeto = document.getElementById('docProjeto')?.value;
    const p = mockProjetos.find(x => x.id === projeto);
    const proximo = {
        'Projeto Unifilar':'Gerar ART', 'ART assinada':'Enviar à concessionária',
        'Parecer da Concessionária':'Agendar instalação', 'Fotos da Instalação':'Solicitar vistoria',
        'Termo de Vistoria':'Fechar projeto'
    };
    alert(`✅ Upload realizado!\nDocumento : ${tipo}\nProjeto   : ${p?.cliente || projeto}\nPróx. passo: ${proximo[tipo] || '—'}`);
}

// ====== AGENDAR VISTORIA ======
function enConfirmarVistoria() {
    const id   = document.getElementById('vistoriaProjeto')?.value;
    const data = document.getElementById('vistoriaData')?.value;
    const hora = document.getElementById('vistoriaHora')?.value;
    if (!data || !hora) { alert('Preencha data e hora!'); return; }
    const p = mockProjetos.find(x => x.id === id);
    const dataFmt = new Date(data+'T00:00:00').toLocaleDateString('pt-BR');
    alert(`✅ Vistoria agendada!\nProjeto : ${p?.cliente || id}\nData    : ${dataFmt}\nHora    : ${hora}`);

    // Append to agendadas list
    const lista = document.getElementById('listaVistorias');
    if (lista) {
        const div = document.createElement('div');
        div.className = 'info-row';
        div.innerHTML = `<span>${id} — ${p?.cliente||'—'}</span><span>${dataFmt} • ${hora}</span>`;
        lista.appendChild(div);
    }
}

// ====== RELATÓRIO EXPORT ======
function enRelatorioMensal() {
    const base = mockProjetos.filter(p => ['Projeto','Instalação','Homologação','Concluído'].includes(p.status));
    let r = `🔧 RELATÓRIO TÉCNICO — ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    ['Projeto','Instalação','Homologação','Concluído'].forEach(f => {
        const g = base.filter(p=>p.status===f);
        r += `${f}: ${g.length} obras\n`;
    });
    r += `\nkWp concluído: ${base.filter(p=>p.status==='Concluído').reduce((s,p)=>s+p.potencia_kwp,0).toFixed(1)} kWp\n\n`;
    base.forEach(p => { r += `• ${p.id} | ${p.cliente} | ${p.potencia_kwp}kWp | ${p.status}\n`; });
    alert(r);
}
