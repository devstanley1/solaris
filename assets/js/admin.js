// admin.js — Dashboard Exclusivo: DIRETOR / ADMIN
// Funções: visão executiva, funil completo, gestão de equipe, DRE, configurações

document.addEventListener('DOMContentLoaded', initAdmin);

function initAdmin() {
    if (typeof USE_MOCK_DATA === 'undefined') return;

    // Nome do usuário
    document.querySelectorAll('.display-user-name').forEach(el => {
        el.innerText = USE_MOCK_DATA ? 'Administrador' : '...';
    });

    _adminRenderKPIs();
    _adminRenderFunil();
}

// ====== KPIs EXECUTIVOS ======
function _adminRenderKPIs() {
    const p = mockProjetos;
    const totalFat  = p.reduce((s, x) => s + x.valor_total, 0);
    const totalKwp  = p.reduce((s, x) => s + x.potencia_kwp, 0);
    const ativos    = p.filter(x => x.status !== 'Concluído').length;
    const concluido = p.filter(x => x.status === 'Concluído').length;
    const ticket    = totalFat / p.length;

    set('kpiAdminFat',    formatCurrency(totalFat));
    set('kpiAdminMwp',    (totalKwp / 1000).toFixed(3) + ' MWp');
    set('kpiAdminAtivos', String(ativos));
    set('kpiAdminTicket', formatCurrency(ticket));
    set('kpiAdminConcluidos', String(concluido));
    set('kpiAdminColabs',     String(mockColaboradores.length));
}

// ====== FUNIL DE PROJETOS (todas as fases) ======
function _adminRenderFunil() {
    const fases = ['Venda', 'Projeto', 'Instalação', 'Homologação', 'Concluído'];
    const tbody = document.getElementById('adminFunilBody');
    if (!tbody) return;

    tbody.innerHTML = fases.map(fase => {
        const grupo = mockProjetos.filter(p => p.status === fase);
        const kwp   = grupo.reduce((s, p) => s + p.potencia_kwp, 0);
        const val   = grupo.reduce((s, p) => s + p.valor_total, 0);
        const bc    = badgeClass(fase);
        return `<tr>
            <td><span class="badge ${bc}">${fase}</span></td>
            <td>${grupo.length}</td>
            <td>${kwp.toFixed(1)} kWp</td>
            <td>${formatCurrency(val)}</td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="adminVerProjetosDaFase('${fase}')">
                    <i class="ph ph-eye"></i> Ver
                </button>
            </td>
        </tr>`;
    }).join('');
}

// ====== GESTÃO DE EQUIPE ======
function adminAbrirEquipe() {
    const tbody = document.getElementById('equipeBody');
    if (!tbody) return;
    tbody.innerHTML = mockColaboradores.map(c => `
        <tr>
            <td>${c.nome}</td>
            <td>${c.cargo}</td>
            <td>${c.email}</td>
            <td>${c.fone}</td>
            <td>${c.cargo.includes('Eng') ? c.obras + ' obras' : '—'}</td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="adminEditarColab(${c.id})"><i class="ph ph-pencil"></i></button>
                <button class="btn btn-sm btn-ghost" style="color:var(--danger-color)" onclick="adminRemoverColab(${c.id})"><i class="ph ph-trash"></i></button>
            </td>
        </tr>`).join('');
    openModal('modalEquipe');
}

function adminNovoColaborador() { openModal('modalNovoColab'); }

function adminSalvarColaborador() {
    const nome  = document.getElementById('colabNome')?.value?.trim();
    const cargo = document.getElementById('colabCargo')?.value;
    const email = document.getElementById('colabEmail')?.value?.trim();
    const fone  = document.getElementById('colabFone')?.value?.trim();
    if (!nome || !email) { alert('Preencha nome e e-mail!'); return; }
    const novoId = Math.max(...mockColaboradores.map(c => c.id)) + 1;
    mockColaboradores.push({ id: novoId, nome, cargo, email, fone: fone || '—', obras: 0 });
    alert(`✅ Colaborador "${nome}" cadastrado com sucesso!`);
    closeModal('modalNovoColab');
    initAdmin();
}

function adminEditarColab(id) {
    const c = mockColaboradores.find(x => x.id === id);
    if (!c) return;
    alert(`👤 EDITAR: ${c.nome}\nCargo: ${c.cargo}\nEmail: ${c.email}\n\n(Formulário de edição em desenvolvimento)`);
}

function adminRemoverColab(id) {
    const c = mockColaboradores.find(x => x.id === id);
    if (!c) return;
    if (!confirm(`Remover "${c.nome}" da equipe?`)) return;
    const idx = mockColaboradores.findIndex(x => x.id === id);
    mockColaboradores.splice(idx, 1);
    alert(`Colaborador removido.`);
    closeModal('modalEquipe');
    adminAbrirEquipe();
    initAdmin();
}

// ====== VER PROJETOS POR FASE ======
function adminVerProjetosDaFase(fase) {
    const lista = mockProjetos.filter(p => p.status === fase);
    let txt = `=== PROJETOS: ${fase.toUpperCase()} (${lista.length}) ===\n\n`;
    lista.forEach(p => {
        txt += `• [${p.id}] ${p.cliente}\n  ${p.potencia_kwp}kWp — ${formatCurrency(p.valor_total)} — ${p.concessionaria} — ${p.responsavel}\n\n`;
    });
    alert(txt || 'Nenhum projeto nesta fase.');
}

// ====== EXPORTAR RELATÓRIO DRE ======
function adminExportarDRE() {
    const fat   = mockProjetos.reduce((s, p) => s + p.valor_total, 0);
    const kwp   = mockProjetos.reduce((s, p) => s + p.potencia_kwp, 0);
    const ativos    = mockProjetos.filter(p => p.status !== 'Concluído').length;
    const concluido = mockProjetos.filter(p => p.status === 'Concluído').length;

    let dre = '╔══════════════════════════════════╗\n';
    dre += '║  RELATÓRIO DRE — SOLARIS SOLAR  ║\n';
    dre += '╚══════════════════════════════════╝\n\n';
    dre += `Data/Hora: ${new Date().toLocaleString('pt-BR')}\n\n`;
    dre += `RECEITAS\n`;
    dre += `├─ Faturamento Total : ${formatCurrency(fat)}\n`;
    dre += `├─ Potência Instalada: ${kwp.toFixed(1)} kWp\n`;
    dre += `└─ Ticket Médio      : ${formatCurrency(fat / mockProjetos.length)}\n\n`;
    dre += `OPERACIONAL\n`;
    dre += `├─ Total de Projetos : ${mockProjetos.length}\n`;
    dre += `├─ Projetos Ativos   : ${ativos}\n`;
    dre += `└─ Concluídos        : ${concluido}\n\n`;
    dre += `EQUIPE\n`;
    dre += `└─ Colaboradores     : ${mockColaboradores.length}\n\n`;
    dre += `────────────────────────────────────\n`;
    dre += `DETALHAMENTO DOS PROJETOS\n\n`;
    mockProjetos.forEach((p, i) => {
        dre += `${String(i+1).padStart(2,'0')}. [${p.id}] ${p.cliente}\n`;
        dre += `    ${p.potencia_kwp}kWp | ${formatCurrency(p.valor_total)} | ${p.status} | ${p.responsavel}\n\n`;
    });
    alert(dre);
}

// ====== CONFIGURAÇÕES DO SISTEMA ======
function adminAbrirConfiguracoes() { openModal('modalConfiguracoes'); }

function adminSalvarConfiguracoes() {
    alert('✅ Configurações salvas com sucesso!');
    closeModal('modalConfiguracoes');
}
