// assets/js/dashboardLogic.js
// Load this BEFORE authSetup.js so USE_MOCK_DATA is available

const USE_MOCK_DATA = true; // Set false when Supabase is configured

// ===================== MOCK DATA =====================
const mockProjetos = [
    { id: 'uuid-1', cliente: { full_name: 'Supermercado Silva' },    responsavel: { full_name: 'Eng. Roberto' }, potencia_kwp: 45,  valor_total: 145000, concessionaria: 'Enel SP', status: 'Venda',       created_at: '2026-03-01' },
    { id: 'uuid-2', cliente: { full_name: 'Residência Costa' },      responsavel: { full_name: 'Eng. Roberto' }, potencia_kwp: 6.5, valor_total: 25000,  concessionaria: 'Enel SP', status: 'Instalação',  created_at: '2026-02-10' },
    { id: 'uuid-3', cliente: { full_name: 'Clínica Médica Vida' },   responsavel: { full_name: 'Eng. Marcos' },  potencia_kwp: 15,  valor_total: 52000,  concessionaria: 'CPFL',    status: 'Venda',       created_at: '2026-03-05' },
    { id: 'uuid-4', cliente: { full_name: 'Indústria APEX' },        responsavel: { full_name: 'Equipe A' },     potencia_kwp: 75,  valor_total: 210000, concessionaria: 'CPFL',    status: 'Instalação',  created_at: '2026-01-15' },
    { id: 'uuid-5', cliente: { full_name: 'Padaria Central' },       responsavel: { full_name: 'Eng. Marcos' },  potencia_kwp: 22,  valor_total: 78000,  concessionaria: 'Enel SP', status: 'Homologação', created_at: '2025-12-20' },
    { id: 'uuid-6', cliente: { full_name: 'Fazenda Sol Nascente' },  responsavel: { full_name: 'Eng. Ana' },     potencia_kwp: 150, valor_total: 450000, concessionaria: 'Cemig',   status: 'Concluído',   created_at: '2025-08-10' },
    { id: 'uuid-7', cliente: { full_name: 'Escola Esperança' },      responsavel: { full_name: 'Eng. Roberto' }, potencia_kwp: 30,  valor_total: 105000, concessionaria: 'Enel SP', status: 'Projeto',     created_at: '2026-02-28' },
];

const mockColaboradores = [
    { id: 1, nome: 'Eng. Roberto',  cargo: 'Engenheiro', email: 'roberto@solaris.com' },
    { id: 2, nome: 'Eng. Marcos',   cargo: 'Engenheiro', email: 'marcos@solaris.com' },
    { id: 3, nome: 'Eng. Ana',      cargo: 'Engenheira', email: 'ana@solaris.com' },
    { id: 4, nome: 'João Silva',    cargo: 'Vendedor',   email: 'joao@solaris.com' },
];
// =====================================================

// ============== GLOBAL UTILITIES ==============
const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

function set(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

function openModal(id)  { const el = document.getElementById(id); if (el) el.classList.add('active'); }
function closeModal(id) { const el = document.getElementById(id); if (el) el.classList.remove('active'); }

// ============== COMMON INIT (every dashboard page) ==============
document.addEventListener('DOMContentLoaded', () => {

    // Mock user name
    if (USE_MOCK_DATA) {
        document.querySelectorAll('.display-user-name').forEach(el => { el.innerText = 'Usuário Teste'; });
    }

    // Mobile sidebar toggle
    const menuBtn = document.getElementById('mobileMenuToggle');
    const sidebar  = document.getElementById('sidebar');
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('open') &&
                !sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    // Theme toggle
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        const update = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (icon) { icon.className = isDark ? 'ph ph-moon' : 'ph ph-sun'; }
        };
        update();
        themeBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) document.documentElement.removeAttribute('data-theme');
            else        document.documentElement.setAttribute('data-theme', 'dark');
            update();
        });
    }

    // Route to specific dashboard
    const path = window.location.pathname;
    if      (path.includes('dashboard-admin.html'))      initAdminDashboard();
    else if (path.includes('dashboard-comercial.html'))  initComercialDashboard();
    else if (path.includes('dashboard-engenharia.html')) initEngenhariaDashboard();
    else if (path.includes('dashboard-cliente.html'))    initClienteDashboard();
});


// =================================================================
// ==================== ADMIN DASHBOARD ============================
// =================================================================
async function initAdminDashboard() {
    let projetos = USE_MOCK_DATA ? mockProjetos : await fetchSupabase('projetos', '*');
    if (!projetos) return;

    let totalFat = 0, totalKwp = 0, ativos = 0;
    const funil = { Venda:{c:0,k:0,v:0}, Projeto:{c:0,k:0,v:0}, 'Instalação':{c:0,k:0,v:0}, 'Homologação':{c:0,k:0,v:0}, 'Concluído':{c:0,k:0,v:0} };

    projetos.forEach(p => {
        const val = parseFloat(p.valor_total) || 0;
        const kwp = parseFloat(p.potencia_kwp) || 0;
        totalFat += val; totalKwp += kwp;
        if (p.status !== 'Concluído') ativos++;
        if (funil[p.status]) { funil[p.status].c++; funil[p.status].k += kwp; funil[p.status].v += val; }
    });

    set('adminFaturamento', formatCurrency(totalFat));
    set('adminMwp', (totalKwp / 1000).toFixed(2) + ' MWp');
    set('adminAtivos', ativos);
    set('adminTicket', formatCurrency(projetos.length ? totalFat / projetos.length : 0));

    const tbody = document.getElementById('adminFunilBody');
    if (tbody) {
        tbody.innerHTML = Object.entries(funil).filter(([k]) => k !== 'Concluído').map(([status, d]) => {
            const bClass = 'badge-' + status.toLowerCase().replace('ç','c').replace('ã','a');
            return `<tr>
                <td><span class="badge ${bClass}">${status}</span></td>
                <td>${d.c}</td>
                <td>${d.k.toFixed(1)} kWp</td>
                <td>${formatCurrency(d.v)}</td>
            </tr>`;
        }).join('');
    }
}

// --- Admin button actions ---
function adminNovoColaborador()   { openModal('modalNovoColaborador'); }
function adminConfiguracoes()     { openModal('modalConfiguracoes'); }

function adminVerColaboradores() {
    let txt = '=== EQUIPE SOLARIS ===\n\n';
    mockColaboradores.forEach(c => { txt += `• ${c.nome} — ${c.cargo} (${c.email})\n`; });
    alert(txt);
}

function adminExportarRelatorio() {
    const fat = mockProjetos.reduce((s, p) => s + (parseFloat(p.valor_total) || 0), 0);
    const kwp = mockProjetos.reduce((s, p) => s + (parseFloat(p.potencia_kwp) || 0), 0);
    const ativos = mockProjetos.filter(p => p.status !== 'Concluído').length;
    let r = '=== RELATÓRIO DRE — SOLARIS ===\n\n';
    r += `Faturamento Total   : ${formatCurrency(fat)}\n`;
    r += `Potência Total       : ${kwp.toFixed(1)} kWp\n`;
    r += `Projetos Ativos      : ${ativos}\n`;
    r += `Projetos Concluídos  : ${mockProjetos.length - ativos}\n`;
    r += `Ticket Médio          : ${formatCurrency(fat / mockProjetos.length)}\n\n`;
    r += '--- Detalhes ---\n';
    mockProjetos.forEach(p => { r += `• ${p.cliente.full_name} | ${p.potencia_kwp}kWp | ${formatCurrency(p.valor_total)} | ${p.status}\n`; });
    alert(r);
}

function adminSalvarColaborador() {
    const nome  = document.getElementById('colabNome')?.value?.trim();
    const cargo = document.getElementById('colabCargo')?.value;
    const email = document.getElementById('colabEmail')?.value?.trim();
    if (!nome || !email) { alert('Preencha todos os campos!'); return; }
    mockColaboradores.push({ id: Date.now(), nome, cargo, email });
    alert(`Colaborador "${nome}" (${cargo}) cadastrado!`);
    closeModal('modalNovoColaborador');
    ['colabNome','colabEmail'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
}

function adminSalvarConfiguracoes() {
    alert('Configurações salvas com sucesso!');
    closeModal('modalConfiguracoes');
}


// =================================================================
// =================== COMERCIAL DASHBOARD =========================
// =================================================================
async function initComercialDashboard() {
    let projetos = USE_MOCK_DATA
        ? [...mockProjetos].sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
        : await fetchSupabase('projetos', '*, cliente:clientes(full_name)');
    if (!projetos) return;

    window._comProjetos = projetos;  // store for filtering
    _renderComercialTable(projetos);
}

function _renderComercialTable(projetos) {
    let propostas = 0, contratos = 0, kwpTotal = 0;
    projetos.forEach(p => {
        kwpTotal += parseFloat(p.potencia_kwp) || 0;
        if (p.status === 'Venda') propostas++; else contratos++;
    });

    set('comPropostas', propostas);
    set('comKwp', kwpTotal.toFixed(1));
    set('comContratos', contratos);

    const rows = projetos.slice(0, 8).map(p => {
        const bc = 'badge-' + p.status.toLowerCase().replace('ç','c').replace('ã','a');
        return `<tr>
            <td>${p.cliente?.full_name || '—'}</td>
            <td>${p.potencia_kwp} kWp</td>
            <td>${formatCurrency(p.valor_total || 0)}</td>
            <td><span class="badge ${bc}">${p.status}</span></td>
            <td>${p.responsavel?.full_name || '—'}</td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="comercialVerDetalhes('${p.id}')" title="Ver"><i class="ph ph-eye"></i></button>
                <button class="btn btn-sm btn-ghost" onclick="comercialEditarProjeto('${p.id}')" title="Editar"><i class="ph ph-pencil"></i></button>
            </td>
        </tr>`;
    }).join('');

    const tbody = document.getElementById('tabelaProjetosComercial');
    if (tbody) tbody.innerHTML = rows || `<tr><td colspan="6" style="text-align:center">Nenhum resultado.</td></tr>`;
}

// --- Comercial button actions ---
function comercialFiltrar() {
    const q = (document.getElementById('comercialBusca')?.value || '').toLowerCase().trim();
    if (!window._comProjetos) return;
    const filtered = q
        ? window._comProjetos.filter(p =>
            (p.cliente?.full_name || '').toLowerCase().includes(q) ||
            (p.status || '').toLowerCase().includes(q) ||
            (p.concessionaria || '').toLowerCase().includes(q))
        : window._comProjetos;
    _renderComercialTable(filtered);
}

function comercialVerDetalhes(id) {
    const p = mockProjetos.find(x => x.id === id);
    if (!p) return;
    alert(`DETALHES DO PROJETO\n\nCliente       : ${p.cliente.full_name}\nResponsável   : ${p.responsavel.full_name}\nPotência      : ${p.potencia_kwp} kWp\nValor         : ${formatCurrency(p.valor_total)}\nConcessionária: ${p.concessionaria}\nStatus        : ${p.status}\nData          : ${p.created_at}`);
}

function comercialEditarProjeto(id) {
    const p = mockProjetos.find(x => x.id === id);
    if (!p) return;
    window._editingProjectId = id;
    const setVal = (elId, val) => { const el = document.getElementById(elId); if(el) el.value = val; };
    setVal('editClientName', p.cliente.full_name);
    setVal('editKwp', p.potencia_kwp);
    setVal('editValor', p.valor_total);
    setVal('editStatus', p.status);
    openModal('modalEditarProjeto');
}

function comercialSalvarEdicao() {
    const id = window._editingProjectId;
    const p  = mockProjetos.find(x => x.id === id);
    if (!p) return;
    const get = (elId) => document.getElementById(elId)?.value;
    p.cliente.full_name = get('editClientName') || p.cliente.full_name;
    p.potencia_kwp      = parseFloat(get('editKwp'))   || p.potencia_kwp;
    p.valor_total       = parseFloat(get('editValor')) || p.valor_total;
    p.status            = get('editStatus') || p.status;
    alert(`Projeto de "${p.cliente.full_name}" atualizado!`);
    closeModal('modalEditarProjeto');
    initComercialDashboard();
}

function salvarNovoNegocio() {
    const nome  = document.getElementById('clientName')?.value?.trim();
    const kwp   = parseFloat(document.getElementById('projectKwp')?.value);
    const valor = parseFloat(document.getElementById('projectValor')?.value);
    const conc  = document.getElementById('projectConcessionaria')?.value;
    if (!nome || !kwp || !valor) { alert('Preencha todos os campos!'); return; }

    mockProjetos.unshift({ id:'uuid-'+Date.now(), cliente:{full_name:nome}, responsavel:{full_name:'Vendedor'}, potencia_kwp:kwp, valor_total:valor, concessionaria:conc, status:'Venda', created_at:new Date().toISOString() });
    alert(`Negócio cadastrado!\n\n${nome} — ${kwp}kWp — ${formatCurrency(valor)}`);
    closeModal('modalNovoCliente');
    initComercialDashboard();
}


// =================================================================
// ================== ENGENHARIA DASHBOARD =========================
// =================================================================
async function initEngenhariaDashboard() {
    const todos = USE_MOCK_DATA ? mockProjetos : await fetchSupabase('projetos','*');
    if (!todos) return;

    const projetos = todos.filter(p => ['Projeto','Instalação','Homologação','Concluído'].includes(p.status));
    window._engProjetos = projetos;
    _renderEngenhariaTable(projetos);
}

function _renderEngenhariaTable(projetos) {
    let cp=0, ci=0, ch=0, cc=0;
    const obras = projetos.filter(p => {
        if (p.status==='Projeto')     { cp++; return true; }
        if (p.status==='Instalação')  { ci++; return true; }
        if (p.status==='Homologação') { ch++; return true; }
        if (p.status==='Concluído')   { cc++; return false; } // exclude from table but count
        return true;
    });

    set('engProjeto',    cp);
    set('engInstalacao', ci);
    set('engHomologacao',ch);
    set('engConcluido',  cc);

    const rows = obras.map(p => {
        const bc = 'badge-' + p.status.toLowerCase().replace('ç','c').replace('ã','a');
        return `<tr>
            <td><strong>#${p.id.slice(-4)}</strong> — ${p.cliente?.full_name||'N/A'}</td>
            <td>${p.potencia_kwp} kWp</td>
            <td>${p.concessionaria}</td>
            <td><span class="badge ${bc}">${p.status}</span></td>
            <td>${p.responsavel?.full_name||'Não alocado'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="engenhariaUploadDoc('${p.id}')" title="Upload doc"><i class="ph ph-upload-simple"></i></button>
                <button class="btn btn-sm btn-ghost" onclick="engenhariaAvancarFase('${p.id}')" title="Avançar fase"><i class="ph ph-arrow-right"></i></button>
            </td>
        </tr>`;
    }).join('');

    const tbody = document.getElementById('tabelaProjetosEngenharia');
    if (tbody) tbody.innerHTML = rows || `<tr><td colspan="6" style="text-align:center">Nenhuma obra encontrada.</td></tr>`;
}

// --- Engenharia button actions ---
function engenhariaFiltrarStatus() {
    const val = document.getElementById('engenhariaFiltroStatus')?.value || 'Todos';
    if (!window._engProjetos) return;
    const filtered = (val === 'Todos') ? window._engProjetos : window._engProjetos.filter(p => p.status === val);
    _renderEngenhariaTable(filtered);
}

function engenhariaUploadDoc(id) {
    window._engProjetoId = id;
    const p = mockProjetos.find(x => x.id === id);
    set('uploadProjetoLabel', p ? `Projeto: ${p.cliente.full_name} — ${p.potencia_kwp}kWp` : 'Projeto selecionado');
    openModal('modalUploadDocs');
}

function engenhariaAvancarFase(id) {
    const fases = ['Venda', 'Projeto', 'Instalação', 'Homologação', 'Concluído'];
    const p = mockProjetos.find(x => x.id === id);
    if (!p) return;
    const idx = fases.indexOf(p.status);
    if (idx >= fases.length - 1) { alert('Projeto já está concluído.'); return; }
    const nova = fases[idx + 1];
    if (confirm(`Avançar "${p.cliente.full_name}" de "${p.status}" → "${nova}"?`)) {
        p.status = nova;
        alert(`Status atualizado para: ${nova}`);
        initEngenhariaDashboard();
    }
}

function engenhariaEnviarArquivo() {
    const tipo = document.getElementById('docType')?.value;
    const p    = mockProjetos.find(x => x.id === window._engProjetoId);
    alert(`Upload concluído!\nTipo: ${tipo}\nProjeto: ${p?.cliente?.full_name || '—'}`);
    closeModal('modalUploadDocs');
}


// =================================================================
// ==================== CLIENTE DASHBOARD ==========================
// =================================================================
async function initClienteDashboard() {
    const todos = USE_MOCK_DATA ? mockProjetos : await fetchSupabase('projetos','*');
    const p = todos?.find(x => x.cliente.full_name === 'Residência Costa') || todos?.[0];
    if (!p) return;

    // Metrics
    set('clienteKwp', p.potencia_kwp + ' kWp');
    set('clienteStatus', p.status);
    set('clienteValor', formatCurrency(p.valor_total));

    // Timeline
    const statuses = ['Venda', 'Projeto', 'Instalação', 'Homologação', 'Concluído'];
    const ci = statuses.indexOf(p.status);
    document.querySelectorAll('.timeline-step').forEach((step, i) => {
        step.classList.remove('completed', 'active');
        if (p.status === 'Concluído' || i < ci) step.classList.add('completed');
        else if (i === ci)                       step.classList.add('active');
    });

    // Desc
    const desc = document.getElementById('clienteProjetoDesc');
    if (desc) desc.innerText = `Sistema de ${p.potencia_kwp}kWp — ${p.concessionaria}. Fase atual: ${p.status}.`;

    // User name
    document.querySelectorAll('.display-user-name').forEach(el => { el.innerText = p.cliente.full_name; });
}

// --- Cliente button actions ---
function clienteBaixarDocumento(tipo) {
    alert(`Download de "${tipo}" iniciado!\nO arquivo será baixado em instantes.`);
}
function clienteWhatsApp(numero) {
    window.open('https://wa.me/55' + numero.replace(/\D/g,''), '_blank');
}
function clienteSuporte() {
    alert('Chamado aberto!\n\nNúmero: #' + Math.floor(Math.random()*90000+10000) + '\nUm representante entrará em contato em até 24h.');
}
function clienteVerDocumentos() {
    document.querySelector('.doc-list')?.scrollIntoView({ behavior:'smooth' });
}
function clienteVerContato() {
    document.querySelector('.contact-card')?.scrollIntoView({ behavior:'smooth' });
}


// =================================================================
// ================== SUPABASE HELPER ==============================
// =================================================================
async function fetchSupabase(table, select) {
    try {
        if (!window.supabaseClient) return null;
        const { data, error } = await window.supabaseClient.from(table).select(select);
        if (error) { console.error(error); return null; }
        return data;
    } catch(e) { console.error(e); return null; }
}
