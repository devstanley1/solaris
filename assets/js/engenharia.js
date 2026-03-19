// engenharia.js — Dashboard Exclusivo: ENGENHEIRO
// Funções: painel de obras, upload docs, avançar fase, agendar vistoria, checklist

let _enProjFiltrados = [];
let _enProjetoAtual  = null;

document.addEventListener('DOMContentLoaded', initEngenharia);

function initEngenharia() {
    if (typeof USE_MOCK_DATA === 'undefined') return;

    document.querySelectorAll('.display-user-name').forEach(el => {
        el.innerText = USE_MOCK_DATA ? 'Eng. Roberto Marques' : '...';
    });

    // Apenas obras técnicas (exclui "Venda" — isso é escopo do Comercial)
    _enProjFiltrados = mockProjetos.filter(p => ['Projeto','Instalação','Homologação','Concluído'].includes(p.status));
    _enRenderKPIs(_enProjFiltrados);
    _enRenderObras(_enProjFiltrados);
}

// ====== KPIs DE ENGENHARIA ======
function _enRenderKPIs(lista) {
    const em_proj  = lista.filter(p => p.status === 'Projeto').length;
    const em_inst  = lista.filter(p => p.status === 'Instalação').length;
    const em_homo  = lista.filter(p => p.status === 'Homologação').length;
    const concl    = lista.filter(p => p.status === 'Concluído').length;
    const kwpAtivo = lista.filter(p => p.status !== 'Concluído')
                          .reduce((s, p) => s + p.potencia_kwp, 0);

    set('kpiEnProjeto',    String(em_proj));
    set('kpiEnInstalacao', String(em_inst));
    set('kpiEnHomologacao',String(em_homo));
    set('kpiEnConcluido',  String(concl));
    set('kpiEnKwpAtivo',   kwpAtivo.toFixed(1) + ' kWp');
}

// ====== PAINEL DE OBRAS ======
function _enRenderObras(lista) {
    const tbody = document.getElementById('enObrasBody');
    if (!tbody) return;

    const ativas = lista.filter(p => p.status !== 'Concluído');
    if (!ativas.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-light)">Nenhuma obra ativa.</td></tr>';
        return;
    }

    tbody.innerHTML = ativas.map(p => {
        const bc = badgeClass(p.status);
        return `<tr>
            <td><strong>${p.id}</strong></td>
            <td>${p.cliente}</td>
            <td>${p.potencia_kwp} kWp</td>
            <td>${p.concessionaria}</td>
            <td><span class="badge ${bc}">${p.status}</span></td>
            <td>${p.responsavel}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="enUpload('${p.id}')" title="Upload doc"><i class="ph ph-upload-simple"></i></button>
                <button class="btn btn-sm btn-ghost" onclick="enChecklist('${p.id}')" title="Checklist"><i class="ph ph-check-square"></i></button>
                <button class="btn btn-sm btn-ghost" onclick="enAvancarFase('${p.id}')" title="Avançar fase"><i class="ph ph-arrow-fat-right"></i></button>
            </td>
        </tr>`;
    }).join('');
}

// ====== FILTRO POR FASE ======
function enFiltrar() {
    const fase = document.getElementById('enFiltroFase')?.value || 'Todos';
    const base = mockProjetos.filter(p => ['Projeto','Instalação','Homologação','Concluído'].includes(p.status));
    const res  = fase === 'Todos' ? base : base.filter(p => p.status === fase);
    _enProjFiltrados = res;
    _enRenderKPIs(res);
    _enRenderObras(res);
}

// ====== UPLOAD DE DOCUMENTAÇÃO ======
function enUpload(id) {
    _enProjetoAtual = id;
    const p = mockProjetos.find(x => x.id === id);
    set('uploadLabel', p ? `Projeto: ${p.id} — ${p.cliente} (${p.potencia_kwp}kWp, ${p.concessionaria})` : '—');
    openModal('modalUpload');
}

function enConfirmarUpload() {
    const tipo = document.getElementById('docTipo')?.value;
    const p    = mockProjetos.find(x => x.id === _enProjetoAtual);
    if (!p) return;

    const checklist = {
        'Projeto Unifilar':           { nextStep: 'Gerar ART' },
        'ART assinada':               { nextStep: 'Enviar à concessionária' },
        'Parecer da Concessionária':  { nextStep: 'Agendar instalação' },
        'Fotos da Instalação':        { nextStep: 'Solicitar vistoria' },
        'Termo de Vistoria':          { nextStep: 'Fechar projeto' },
    };
    const info = checklist[tipo] || {};
    alert(`✅ Upload realizado!\n\nDocumento : ${tipo}\nProjeto   : ${p.cliente}\nPróx. passo: ${info.nextStep || '—'}`);
    closeModal('modalUpload');
}

// ====== CHECKLIST TÉCNICO ======
function enChecklist(id) {
    const p = mockProjetos.find(x => x.id === id);
    if (!p) return;
    const docs = {
        'Projeto': ['☐ Projeto Unifilar', '☐ Memorial Descritivo', '☐ ART assinada', '☐ Aprovação da Concessionária'],
        'Instalação': ['✅ Projeto Unifilar', '✅ Memorial Descritivo', '✅ ART assinada', '☐ Fotos da Instalação', '☐ Comissionamento'],
        'Homologação': ['✅ Projeto Unifilar', '✅ ART assinada', '✅ Fotos da Instalação', '☐ Termo de Vistoria da Concessionária'],
        'Concluído': ['✅ Todos os documentos entregues'],
    };
    const itens = docs[p.status] || ['Sem checklist disponível'];
    alert(`📋 CHECKLIST — ${p.id} (${p.status})\nCliente: ${p.cliente}\n\n${itens.join('\n')}`);
}

// ====== AVANÇAR FASE ======
function enAvancarFase(id) {
    const fases = ['Venda', 'Projeto', 'Instalação', 'Homologação', 'Concluído'];
    const p = mockProjetos.find(x => x.id === id);
    if (!p) return;
    const idx = fases.indexOf(p.status);
    if (idx >= fases.length - 1) { alert('Este projeto já está concluído.'); return; }
    const nova = fases[idx + 1];
    if (!confirm(`Confirmar avanço de fase?\n\n"${p.cliente}" (${p.id})\n${p.status} → ${nova}`)) return;
    p.status = nova;
    alert(`✅ Fase atualizada!\n${p.id} agora está em: ${nova}`);
    _enProjFiltrados = mockProjetos.filter(x => ['Projeto','Instalação','Homologação','Concluído'].includes(x.status));
    _enRenderKPIs(_enProjFiltrados);
    _enRenderObras(_enProjFiltrados);
}

// ====== AGENDAR VISTORIA ======
function enAgendarVistoria() { openModal('modalVistoria'); }

function enConfirmarVistoria() {
    const id   = document.getElementById('vistoriaProjeto')?.value;
    const data = document.getElementById('vistoriaData')?.value;
    const hora = document.getElementById('vistoriaHora')?.value;
    if (!id || !data || !hora) { alert('Preencha todos os campos!'); return; }
    const p = mockProjetos.find(x => x.id === id);
    alert(`✅ Vistoria agendada!\n\nProjeto : ${p?.cliente || id}\nData    : ${new Date(data+'T00:00:00').toLocaleDateString('pt-BR')}\nHora    : ${hora}\n\nConfirmação enviada por e-mail.`);
    closeModal('modalVistoria');
}

// ====== RELATÓRIO TÉCNICO ======
function enRelatorioMensal() {
    const base   = mockProjetos.filter(p => ['Projeto','Instalação','Homologação','Concluído'].includes(p.status));
    const concl  = base.filter(p => p.status === 'Concluído');
    const kwpCon = concl.reduce((s, p) => s + p.potencia_kwp, 0);
    let rel = `🔧 RELATÓRIO TÉCNICO MENSAL\n\n`;
    rel += `Data: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    rel += `RESUMO DAS OBRAS\n`;
    rel += `├─ em Projeto Elétrico : ${base.filter(p=>p.status==='Projeto').length}\n`;
    rel += `├─ em Instalação       : ${base.filter(p=>p.status==='Instalação').length}\n`;
    rel += `├─ em Homologação      : ${base.filter(p=>p.status==='Homologação').length}\n`;
    rel += `└─ Concluídas          : ${concl.length}\n\n`;
    rel += `POTÊNCIA INSTALADA\n`;
    rel += `└─ ${kwpCon.toFixed(1)} kWp concluídos\n\n`;
    rel += `OBRAS ABERTAS\n`;
    base.filter(p=>p.status!=='Concluído').forEach(p => {
        rel += `• ${p.id} | ${p.cliente} | ${p.potencia_kwp}kWp | ${p.status}\n`;
    });
    alert(rel);
}
