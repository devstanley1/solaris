// assets/js/authSetup.js
// Auth setup - works in both MOCK mode and real Supabase mode

document.addEventListener('DOMContentLoaded', () => {
    checkAuthSession();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// =========================================================
// LOGOUT — works in both mock and real Supabase mode
// =========================================================
function logout() {
    // If using mock data, just go back to the login page
    if (typeof USE_MOCK_DATA !== 'undefined' && USE_MOCK_DATA) {
        // Works whether we're in pages/ subfolder or root
        const isInPages = window.location.pathname.includes('/pages/');
        window.location.href = isInPages ? '../index.html' : 'index.html';
        return;
    }
    handleLogout();
}

async function handleLogout() {
    try {
        if (window.supabaseClient) {
            await window.supabaseClient.auth.signOut();
        }
    } catch(e) {
        console.warn('Logout error:', e);
    }
    const isInPages = window.location.pathname.includes('/pages/');
    window.location.href = isInPages ? '../index.html' : 'index.html';
}

// =========================================================
// LOGIN
// =========================================================
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = e.target.querySelector('button[type="submit"]') || e.target.querySelector('button');
    const originalText = btn ? btn.innerText : '';

    if (btn) { btn.innerText = 'Autenticando...'; btn.disabled = true; }

    try {
        if (!window.supabaseClient) throw new Error('Supabase não configurado');
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
        
        if (error) {
            alert('Erro no login: ' + error.message);
            if (btn) { btn.innerText = originalText; btn.disabled = false; }
            return;
        }
        redirectBasedOnRole(data.user.id);

    } catch (err) {
        console.error("Auth error:", err);
        alert('Erro: Supabase não está configurado. Use os botões de acesso rápido.');
        if (btn) { btn.innerText = originalText; btn.disabled = false; }
    }
}

async function redirectBasedOnRole(userId) {
    try {
        const { data: profile, error } = await window.supabaseClient
            .from('profiles').select('role').eq('id', userId).single();
            
        if (error || !profile) {
            window.location.href = 'pages/dashboard-admin.html';
            return;
        }
        
        const roleMap = {
            admin: 'pages/dashboard-admin.html',
            comercial: 'pages/dashboard-comercial.html',
            engenharia: 'pages/dashboard-engenharia.html',
            cliente: 'pages/dashboard-cliente.html',
        };
        window.location.href = roleMap[profile.role] || 'pages/dashboard-admin.html';
    } catch(e) {
        window.location.href = 'pages/dashboard-admin.html';
    }
}

// =========================================================
// SESSION CHECK — non-blocking in mock mode
// =========================================================
async function checkAuthSession() {
    const currentPage = window.location.pathname;
    if (!currentPage.includes('dashboard-')) return; // Not a protected page

    // If mock mode, don't block — just display mock name
    if (typeof USE_MOCK_DATA !== 'undefined' && USE_MOCK_DATA) {
        return; // dashboardLogic.js will handle showing mock name
    }

    // Real Supabase check
    try {
        if (!window.supabaseClient) return;
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) {
            window.location.href = '../index.html';
            return;
        }
        const { data: profile } = await window.supabaseClient
            .from('profiles').select('full_name, role')
            .eq('id', session.user.id).single();
        
        if (profile) {
            document.querySelectorAll('.display-user-name')
                .forEach(el => el.innerText = profile.full_name);
        }
    } catch(e) {
        console.warn('Session check skipped:', e);
    }
}
