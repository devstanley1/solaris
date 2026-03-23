// dashboardBase.js — Compartilhado por todos os dashboards

const USE_MOCK_DATA = true;

// ===================== MOCK DATA =====================
const mockProjetos = [
    { id: 'SOL-001', cliente: 'Supermercado Silva',   responsavel: 'Eng. Roberto', potencia_kwp: 45,  valor_total: 145000, concessionaria: 'Enel SP', status: 'Venda',       data: '01/Mar/2026' },
    { id: 'SOL-002', cliente: 'Residência Costa',     responsavel: 'Eng. Roberto', potencia_kwp: 6.5, valor_total: 25000,  concessionaria: 'Enel SP', status: 'Instalação',  data: '10/Fev/2026' },
    { id: 'SOL-003', cliente: 'Clínica Médica Vida',  responsavel: 'Eng. Marcos',  potencia_kwp: 15,  valor_total: 52000,  concessionaria: 'CPFL',    status: 'Venda',       data: '05/Mar/2026' },
    { id: 'SOL-004', cliente: 'Indústria APEX',       responsavel: 'Equipe A',     potencia_kwp: 75,  valor_total: 210000, concessionaria: 'CPFL',    status: 'Instalação',  data: '15/Jan/2026' },
    { id: 'SOL-005', cliente: 'Padaria Central',      responsavel: 'Eng. Marcos',  potencia_kwp: 22,  valor_total: 78000,  concessionaria: 'Enel SP', status: 'Homologação', data: '20/Dez/2025' },
    { id: 'SOL-006', cliente: 'Fazenda Sol Nascente', responsavel: 'Eng. Ana',     potencia_kwp: 150, valor_total: 450000, concessionaria: 'Cemig',   status: 'Concluído',   data: '10/Ago/2025' },
    { id: 'SOL-007', cliente: 'Escola Esperança',     responsavel: 'Eng. Roberto', potencia_kwp: 30,  valor_total: 105000, concessionaria: 'Enel SP', status: 'Projeto',     data: '28/Fev/2026' },
    { id: 'SOL-008', cliente: 'Condomínio Vista Mar', responsavel: 'Eng. Ana',     potencia_kwp: 60,  valor_total: 195000, concessionaria: 'CPFL',    status: 'Projeto',     data: '02/Mar/2026' },
];

const mockColaboradores = [
    { id: 1, nome: 'Eng. Roberto Marques', cargo: 'Engenheiro Sênior',       email: 'roberto@solaris.com',  fone: '(11) 98888-1111', obras: 3 },
    { id: 2, nome: 'Eng. Marcos Lima',     cargo: 'Engenheiro Pleno',        email: 'marcos@solaris.com',   fone: '(11) 97777-2222', obras: 2 },
    { id: 3, nome: 'Eng. Ana Ferreira',    cargo: 'Engenheira Pleno',        email: 'ana@solaris.com',      fone: '(11) 96666-3333', obras: 2 },
    { id: 4, nome: 'João Silva',           cargo: 'Representante Comercial', email: 'joao@solaris.com',     fone: '(11) 99999-0000', obras: 0 },
    { id: 5, nome: 'Maria Santos',         cargo: 'Representante Comercial', email: 'maria@solaris.com',    fone: '(11) 95555-4444', obras: 0 },
];

const mockDocumentos = [
    { id: 'd1', nome: 'Contrato de Instalação',   tipo: 'PDF', data: '10/02/2026', disponivel: true  },
    { id: 'd2', nome: 'Projeto Unifilar',          tipo: 'PDF', data: '18/02/2026', disponivel: true  },
    { id: 'd3', nome: 'ART do Engenheiro',         tipo: 'PDF', data: '18/02/2026', disponivel: true  },
    { id: 'd4', nome: 'Parecer da Concessionária', tipo: 'PDF', data: '—',          disponivel: false },
    { id: 'd5', nome: 'Termo de Vistoria',         tipo: 'PDF', data: '—',          disponivel: false },
];

// ===================== UTILITÁRIOS =====================
const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

function set(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

function openModal(id)  { const el = document.getElementById(id); if (el) el.classList.add('active'); }
function closeModal(id) { const el = document.getElementById(id); if (el) el.classList.remove('active'); }

function badgeClass(status) {
    return 'badge-' + status.toLowerCase()
        .replace(/ç/g, 'c').replace(/ã/g, 'a').replace(/ó/g, 'o').replace(/é/g, 'e').replace(/\s/g, '-');
}

// ===================== PAGE ROUTER =====================
// Each dashboard uses <section class="page-section" id="page-XXX"> elements.
// showPage('XXX') hides all sections and shows the requested one,
// and marks the matching nav-item as active.
function showPage(pageId) {
    // Hide all page sections
    document.querySelectorAll('.page-section').forEach(s => {
        s.style.display = 'none';
        s.classList.remove('page-active');
    });

    // Show the target section
    const target = document.getElementById('page-' + pageId);
    if (target) {
        target.style.display = 'block';
        target.classList.add('page-active');
    }

    // Update nav-item active state
    document.querySelectorAll('.nav-item').forEach(a => {
        const linked = a.getAttribute('data-page');
        a.classList.toggle('active', linked === pageId);
    });

    // Close sidebar on mobile after navigation
    const sidebar = document.getElementById('sidebar');
    if (sidebar && window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }

    // Store current page for refreshes
    window._currentPage = pageId;
}

// ===================== COMMON INIT =====================
document.addEventListener('DOMContentLoaded', () => {
    // Mock user name — overridden by role JS
    document.querySelectorAll('.display-user-name').forEach(el => {
        if (USE_MOCK_DATA) el.innerText = 'Usuário';
    });

    // Initialize first page section (first nav-item's data-page)
    const firstNav = document.querySelector('.nav-item[data-page]');
    if (firstNav) {
        showPage(firstNav.getAttribute('data-page'));
    }

    // --- Mobile sidebar toggle ---
    const menuBtn = document.getElementById('mobileMenuToggle');
    const sidebar  = document.getElementById('sidebar');
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
        // Overlay click to close
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 &&
                sidebar.classList.contains('open') &&
                !sidebar.contains(e.target) &&
                !menuBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    // --- Theme toggle ---
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        // Dark mode is :root default. Light mode uses [data-theme="light"].
        // On load, remove any stale data-theme="dark" attribute (just use :root)
        const savedTheme = localStorage.getItem('solaris-theme');
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        const sync = () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            if (icon) icon.className = isLight ? 'ph ph-moon' : 'ph ph-sun';
        };
        sync();
        themeBtn.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            if (isLight) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('solaris-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('solaris-theme', 'light');
            }
            sync();
        });
    }
});
