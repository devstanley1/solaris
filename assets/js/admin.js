// admin.js — Dashboard Exclusivo: DIRETOR / ADMIN

document.addEventListener('DOMContentLoaded', initAdmin);

function initAdmin() {
    if (typeof USE_MOCK_DATA === 'undefined') return;
    document.querySelectorAll('.display-user-name').forEach(el => { el.innerText = 'Administrador'; });
    _adminRenderKPIs();
    _adminRenderFunil();
    _adminRenderEquipe();
    _adminRenderDRE();
}

// ====== KPIs ======
function _adminRenderKPIs() {
    const p      = mockProjetos;
    const fat    = p.reduce((s, x) => s + x.valor_total, 0);
    const kwp    = p.reduce((s, x) => s + x.potencia_kwp, 0);
    const ativos = p.filter(x => x.status !== 'Concluído').length;
    const concl  = p.filter(x => x.status === 'Concluído').length;

    set('kpiAdminFat',        formatCurrency(fat));
    set('kpiAdminMwp',        (kwp/1000).toFixed(3) + ' MWp');
    set('kpiAdminAtivos',     String(ativos));
    set('kpiAdminTicket',     formatCurrency(fat / p.length));
    set('kpiAdminConcluidos', String(concl));
    set('kpiAdminColabs',     String(mockColaboradores.length));
}

// ====== FUNIL ======
function _adminRenderFunil() {
    const fases = ['Venda','Projeto','Instalação','Homologação','Concluído'];
    const tbody = document.getElementById('adminFunilBody');
    if (!tbody) return;
    tbody.innerHTML = fases.map(f => {
        const g = mockProjetos.filter(p => p.status === f);
        const k = g.reduce((s,p) => s+p.potencia_kwp, 0);
        const v = g.reduce((s,p) => s+p.valor_total, 0);
        return `<tr>
            <td><span class="badge ${badgeClass(f)}">${f}</span></td>
            <td><strong>${g.length}</strong></td>
            <td>${k.toFixed(1)} kWp</td>
            <td>${formatCurrency(v)}</td>
            <td><button class="btn btn-sm btn-ghost" onclick="adminVerFase('${f}')"><i class="ph ph-eye"></i></button></td>
        </tr>`;
    }).join('');
}

// ====== EQUIPE TABLE (page-equipe) ======
function _adminRenderEquipe() {
    const tbody = document.getElementById('equipeTableBody');
    if (!tbody) return;
    tbody.innerHTML = mockColaboradores.map(c => `
        <tr>
            <td><strong>${c.nome}</strong></td>
            <td>${c.cargo}</td>
            <td>${c.email}</td>
            <td>${c.fone}</td>
            <td>${c.cargo.includes('Eng') || c.cargo.includes('Téc') ? c.obras + ' obras' : '—'}</td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="adminEditarColab(${c.id})" title="Editar"><i class="ph ph-pencil"></i></button>
                <button class="btn btn-sm btn-ghost" style="color:var(--danger-color)" onclick="adminRemoverColab(${c.id})" title="Remover"><i class="ph ph-trash"></i></button>
            </td>
        </tr>`).join('');
}

// ====== DRE PAGE ======
function _adminRenderDRE() {
    const fat   = mockProjetos.reduce((s,p) => s+p.valor_total, 0);
    const kwp   = mockProjetos.reduce((s,p) => s+p.potencia_kwp, 0);
    const ativos = mockProjetos.filter(p => p.status !== 'Concluído').length;
    const concl  = mockProjetos.filter(p => p.status === 'Concluído').length;

    const infoRow = (lbl, val) =>
        `<div class="info-row"><span>${lbl}</span><span><strong>${val}</strong></span></div>`;

    const rec = document.getElementById('dreReceitas');
    if (rec) rec.innerHTML =
        infoRow('Faturamento Total', formatCurrency(fat)) +
        infoRow('Ticket Médio',      formatCurrency(fat/mockProjetos.length)) +
        infoRow('kWp Total',         kwp.toFixed(1) + ' kWp') +
        infoRow('MWp Total',         (kwp/1000).toFixed(3) + ' MWp');

    const op = document.getElementById('dreOperacional');
    if (op) op.innerHTML =
        infoRow('Total Projetos',    String(mockProjetos.length)) +
        infoRow('Projetos Ativos',   String(ativos)) +
        infoRow('Concluídos',        String(concl)) +
        infoRow('Em Elaboração',     String(mockProjetos.filter(p=>p.status==='Projeto').length)) +
        infoRow('Em Instalação',     String(mockProjetos.filter(p=>p.status==='Instalação').length)) +
        infoRow('Homologação',       String(mockProjetos.filter(p=>p.status==='Homologação').length));

    const eq = document.getElementById('dreEquipe');
    if (eq) eq.innerHTML =
        infoRow('Total Colaboradores', String(mockColaboradores.length)) +
        infoRow('Engenheiros',         String(mockColaboradores.filter(c=>c.cargo.includes('Eng')).length)) +
        infoRow('Técnicos',            String(mockColaboradores.filter(c=>c.cargo.includes('Téc')).length)) +
        infoRow('Comercial',           String(mockColaboradores.filter(c=>c.cargo.includes('Comercial')).length));

    const tbody = document.getElementById('dreProjetosBody');
    if (tbody) tbody.innerHTML = mockProjetos.map((p,i) => `
        <tr>
            <td>${i+1}</td>
            <td>${p.cliente}</td>
            <td>${p.potencia_kwp} kWp</td>
            <td>${formatCurrency(p.valor_total)}</td>
            <td><span class="badge ${badgeClass(p.status)}">${p.status}</span></td>
            <td>${p.responsavel}</td>
        </tr>`).join('');
}

// ====== AÇÕES ADMIN ======
function adminVerFase(fase) {
    const lista = mockProjetos.filter(p => p.status === fase);
    let txt = `PROJETOS — ${fase.toUpperCase()} (${lista.length})\n\n`;
    lista.forEach(p => { txt += `• [${p.id}] ${p.cliente} — ${p.potencia_kwp}kWp — ${formatCurrency(p.valor_total)}\n`; });
    alert(txt || 'Nenhum projeto nesta fase.');
}

function adminSalvarColaborador() {
    const nome  = document.getElementById('colabNome')?.value?.trim();
    const cargo = document.getElementById('colabCargo')?.value;
    const email = document.getElementById('colabEmail')?.value?.trim();
    const fone  = document.getElementById('colabFone')?.value?.trim();
    if (!nome || !email) { alert('Preencha nome e e-mail!'); return; }
    mockColaboradores.push({ id: Date.now(), nome, cargo, email, fone: fone||'—', obras:0 });
    alert(`✅ Colaborador "${nome}" cadastrado!`);
    closeModal('modalNovoColab');
    _adminRenderEquipe();
    _adminRenderKPIs();
}

function adminEditarColab(id) {
    const c = mockColaboradores.find(x => x.id === id);
    if (!c) return;
    const novo = prompt(`Editando: ${c.nome}\nNovo nome:`, c.nome);
    if (novo) { c.nome = novo; _adminRenderEquipe(); }
}

function adminRemoverColab(id) {
    const c = mockColaboradores.find(x => x.id === id);
    if (!c || !confirm(`Remover "${c.nome}"?`)) return;
    const i = mockColaboradores.findIndex(x => x.id === id);
    mockColaboradores.splice(i, 1);
    _adminRenderEquipe();
    _adminRenderKPIs();
}

function adminExportarDRE() {
    const fat = mockProjetos.reduce((s,p) => s+p.valor_total, 0);
    const kwp = mockProjetos.reduce((s,p) => s+p.potencia_kwp, 0);
    let r  = '╔══════════════════════════════════╗\n';
    r += '║  RELATÓRIO DRE — SOLARIS SOLAR  ║\n';
    r += '╚══════════════════════════════════╝\n\n';
    r += `Data: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    r += `Faturamento Total : ${formatCurrency(fat)}\n`;
    r += `Potência Instalada: ${kwp.toFixed(1)} kWp\n`;
    r += `Ticket Médio       : ${formatCurrency(fat/mockProjetos.length)}\n`;
    r += `Projetos           : ${mockProjetos.length} total\n\n`;
    mockProjetos.forEach((p,i) => { r += `${i+1}. [${p.id}] ${p.cliente} — ${p.potencia_kwp}kWp — ${formatCurrency(p.valor_total)} — ${p.status}\n`; });
    alert(r);
}

function adminSalvarConfiguracoes() {
    alert('✅ Configurações salvas!');
}
