// admin.js — Dashboard Exclusivo: DIRETOR / ADMIN

// ===================== MOCK DATA EXTRA =====================
const mockEquipamentos = {
    paineis: [
        { id:'PA-001', modelo:'Canadian CS6W-555MS',   tipo:'Monocristalino',        potencia:'555 Wp', eficiencia:'21.2%', garantia:'25 anos', fabricante:'Canadian Solar',  preco:890,  estoque:120, minimo:20 },
        { id:'PA-002', modelo:'Risen RSM144-7-540M',   tipo:'Monocristalino',        potencia:'540 Wp', eficiencia:'20.8%', garantia:'25 anos', fabricante:'Risen Energy',    preco:820,  estoque:85,  minimo:15 },
        { id:'PA-003', modelo:'Jinko JKM580M-7RL4',    tipo:'Monocristalino TOPCon', potencia:'580 Wp', eficiencia:'22.0%', garantia:'30 anos', fabricante:'Jinko Solar',     preco:950,  estoque:8,   minimo:20 },
    ],
    inversores: [
        { id:'IV-001', modelo:'Growatt MIN 6000TL-X',  tipo:'String',       potencia:'6 kW',     garantia:'10 anos', fabricante:'Growatt',  preco:3200,  estoque:15, minimo:5 },
        { id:'IV-002', modelo:'SMA Sunny Boy 5.0',     tipo:'String',       potencia:'5 kW',     garantia:'10 anos', fabricante:'SMA',      preco:4800,  estoque:7,  minimo:3 },
        { id:'IV-003', modelo:'Fronius Symo 17.5-3',   tipo:'Trifásico',    potencia:'17.5 kW',  garantia:'10 anos', fabricante:'Fronius',  preco:11500, estoque:3,  minimo:2 },
    ],
    estruturas: [
        { id:'ES-001', modelo:'K2 Colonial Kit 10p',   tipo:'Telhado Colonial', potencia:'—', garantia:'10 anos', fabricante:'K2 Systems', preco:650, estoque:45, minimo:10 },
        { id:'ES-002', modelo:'Schletter Metálico 8p', tipo:'Telhado Metálico', potencia:'—', garantia:'10 anos', fabricante:'Schletter',  preco:720, estoque:30, minimo:8  },
        { id:'ES-003', modelo:'K2 Laje/Flat 6p',       tipo:'Laje',             potencia:'—', garantia:'10 anos', fabricante:'K2 Systems', preco:580, estoque:2,  minimo:8  },
    ],
};
const mockFornecedores = [
    { nome:'Canadian Solar Brasil', contato:'(11) 3000-1111', email:'vendas@canadian.com.br',   prazo:'5–7 dias',   especialidade:'Painéis Solares'  },
    { nome:'Growatt Brasil',        contato:'(11) 3000-2222', email:'suporte@growatt.com.br',    prazo:'3–5 dias',   especialidade:'Inversores'       },
    { nome:'K2 Systems Brasil',     contato:'(11) 3000-3333', email:'vendas@k2systems.com.br',   prazo:'7–10 dias',  especialidade:'Estruturas'       },
    { nome:'Jinko Solar',           contato:'(11) 3000-4444', email:'jinko@solarsupply.com.br',  prazo:'10–15 dias', especialidade:'Painéis Premium'  },
];
const mockOrcamentos = [
    { id:'ORC-001', cliente:'Posto de Gasolina BR',  kwp:55,  valor:178000, status:'Enviada',  data:'05/Mar/2026', validade:'05/Abr/2026' },
    { id:'ORC-002', cliente:'Escola Municipal PE',   kwp:28,  valor:95000,  status:'Aprovada', data:'15/Fev/2026', validade:'15/Mar/2026' },
    { id:'ORC-003', cliente:'Hotel Beira Mar',       kwp:120, valor:385000, status:'Rascunho', data:'20/Mar/2026', validade:'20/Abr/2026' },
    { id:'ORC-004', cliente:'Clínica Médica Vida',   kwp:15,  valor:52000,  status:'Recusada', data:'01/Mar/2026', validade:'01/Abr/2026' },
];
const mockOS = [
    { id:'OS-001', projeto:'SOL-002', cliente:'Residência Costa',      tecnico:'Eng. Roberto', inicio:'24/Fev/2026', previsao:'26/Fev/2026', status:'Concluída'    },
    { id:'OS-002', projeto:'SOL-004', cliente:'Indústria APEX',        tecnico:'Equipe A',     inicio:'20/Jan/2026', previsao:'28/Jan/2026', status:'Em andamento' },
    { id:'OS-003', projeto:'SOL-007', cliente:'Escola Esperança',      tecnico:'Eng. Marcos',  inicio:'10/Mar/2026', previsao:'15/Mar/2026', status:'Aguardando'   },
    { id:'OS-004', projeto:'SOL-008', cliente:'Condomínio Vista Mar',  tecnico:'Eng. Ana',     inicio:'15/Mar/2026', previsao:'22/Mar/2026', status:'Em andamento' },
];
const mockManutencao = [
    { id:'MNT-001', tipo:'Preventiva', cliente:'Fazenda Sol Nascente', projeto:'SOL-006', data:'10/Abr/2026', prazo:'10/Abr/2026', status:'Agendada', sla:'ok'       },
    { id:'MNT-002', tipo:'Corretiva',  cliente:'Residência Costa',     projeto:'SOL-002', data:'18/Mar/2026', prazo:'20/Mar/2026', status:'Aberto',   sla:'ok'       },
    { id:'MNT-003', tipo:'Corretiva',  cliente:'Padaria Central',      projeto:'SOL-005', data:'10/Mar/2026', prazo:'13/Mar/2026', status:'Aberto',   sla:'atrasado' },
    { id:'MNT-004', tipo:'Preventiva', cliente:'Supermercado Silva',   projeto:'SOL-001', data:'05/Abr/2026', prazo:'05/Abr/2026', status:'Agendada', sla:'ok'       },
];
const mockDocLicencas = [
    { id:'DL-001', projeto:'SOL-002', documento:'Projeto Elétrico',        tipo:'PDF', envio:'15/Fev/2026', retEsperado:'01/Mar/2026', retReal:'28/Fev/2026', status:'Aprovado'   },
    { id:'DL-002', projeto:'SOL-002', documento:'ART assinada',             tipo:'PDF', envio:'15/Fev/2026', retEsperado:'22/Fev/2026', retReal:'20/Fev/2026', status:'Aprovado'   },
    { id:'DL-003', projeto:'SOL-004', documento:'Projeto Elétrico',        tipo:'PDF', envio:'18/Jan/2026', retEsperado:'01/Fev/2026', retReal:'—',           status:'Pendente'   },
    { id:'DL-004', projeto:'SOL-005', documento:'Parecer Concessionária',  tipo:'PDF', envio:'10/Jan/2026', retEsperado:'25/Jan/2026', retReal:'—',           status:'Em análise' },
    { id:'DL-005', projeto:'SOL-007', documento:'ART assinada',             tipo:'PDF', envio:'01/Mar/2026', retEsperado:'10/Mar/2026', retReal:'—',           status:'Enviado'    },
];
const mockPermissoes = [
    { id:1, nome:'Administrador Geral',   email:'admin@solaris.com.br', perfil:'Admin',       acesso:'Total',                       ultimo:'21/Mar/2026 22:15' },
    { id:2, nome:'João Silva',            email:'joao@solaris.com',     perfil:'Comercial',   acesso:'Pipeline, Propostas',         ultimo:'21/Mar/2026 18:30' },
    { id:3, nome:'Eng. Roberto Marques',  email:'roberto@solaris.com',  perfil:'Engenheiro',  acesso:'Obras, Docs, Vistorias',      ultimo:'21/Mar/2026 17:45' },
    { id:4, nome:'Maria Santos',          email:'maria@solaris.com',    perfil:'Comercial',   acesso:'Pipeline, Propostas',         ultimo:'20/Mar/2026 16:00' },
    { id:5, nome:'Cliente Costa',         email:'costa@email.com',      perfil:'Cliente',     acesso:'Portal Cliente',              ultimo:'19/Mar/2026 10:22' },
];
const mockLogAcoes = [
    { user:'admin@solaris.com.br', acao:'Exportou relatório DRE',             modulo:'Relatórios', data:'21/Mar/2026 22:10' },
    { user:'joao@solaris.com',     acao:'Criou proposta ORC-003',              modulo:'Orçamentos', data:'21/Mar/2026 20:45' },
    { user:'roberto@solaris.com',  acao:'Avançou fase SOL-007 → Instalação',  modulo:'Projetos',   data:'21/Mar/2026 17:40' },
    { user:'joao@solaris.com',     acao:'Editou projeto SOL-002',              modulo:'Pipeline',   data:'21/Mar/2026 15:30' },
    { user:'admin@solaris.com.br', acao:'Cadastrou colaborador',               modulo:'Equipe',     data:'20/Mar/2026 11:00' },
];

// ===================== ESTADO =====================
let _orcCalcData = null;
let _eqTabAtual  = 'paineis';

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', initAdmin);

function initAdmin() {
    if (typeof USE_MOCK_DATA === 'undefined') return;
    document.querySelectorAll('.display-user-name').forEach(el => { el.innerText = 'Administrador'; });
    _adminRenderKPIs();
    _adminRenderFunil();
    _adminRenderEquipe();
    _adminRenderProjetos();
    _adminRenderOrcamentos();
    _adminRenderOS();
    _adminRenderDocLicencas();
    _adminRenderManutencao();
    _adminRenderEquipamentos('paineis');
    _adminRenderFornecedores();
    _adminRenderDRE();
    _adminRenderPermissoes();
    _adminRenderLog();
}

// ======= PAINEL KPIs =======
function _adminRenderKPIs() {
    const p = mockProjetos;
    set('kpiAdminFat',        formatCurrency(p.reduce((s,x)=>s+x.valor_total,0)));
    set('kpiAdminMwp',        (p.reduce((s,x)=>s+x.potencia_kwp,0)/1000).toFixed(3)+' MWp');
    set('kpiAdminAtivos',     String(p.filter(x=>x.status!=='Concluído').length));
    set('kpiAdminTicket',     formatCurrency(p.reduce((s,x)=>s+x.valor_total,0)/p.length));
    set('kpiAdminConcluidos', String(p.filter(x=>x.status==='Concluído').length));
    set('kpiAdminColabs',     String(mockColaboradores.length));
}

// ======= FUNIL =======
function _adminRenderFunil() {
    const fases=['Venda','Projeto','Instalação','Homologação','Concluído'];
    const tb=document.getElementById('adminFunilBody');
    if(!tb) return;
    tb.innerHTML=fases.map(f=>{
        const g=mockProjetos.filter(p=>p.status===f);
        const k=g.reduce((s,p)=>s+p.potencia_kwp,0);
        const v=g.reduce((s,p)=>s+p.valor_total,0);
        return `<tr><td><span class="badge ${badgeClass(f)}">${f}</span></td><td><strong>${g.length}</strong></td><td>${k.toFixed(1)} kWp</td><td>${formatCurrency(v)}</td>
            <td><button class="btn btn-sm btn-ghost" onclick="adminVerFase('${f}')"><i class="ph ph-eye"></i></button></td></tr>`;
    }).join('');
}

// ======= PROJETOS (página completa) =======
function _adminRenderProjetos(lista) {
    lista = lista || mockProjetos;
    set('kpiProjTotal',     String(lista.length));
    set('kpiProjAtivos',    String(lista.filter(p=>p.status!=='Concluído').length));
    set('kpiProjConcluidos',String(lista.filter(p=>p.status==='Concluído').length));
    set('kpiProjKwp',       lista.reduce((s,p)=>s+p.potencia_kwp,0).toFixed(1)+' kWp');
    const tb=document.getElementById('projetosTableBody');
    if(!tb) return;
    tb.innerHTML=lista.map(p=>`
        <tr>
            <td><strong>${p.id}</strong></td>
            <td>${p.cliente}</td>
            <td>${p.potencia_kwp} kWp</td>
            <td>${formatCurrency(p.valor_total)}</td>
            <td><span class="badge ${badgeClass(p.status)}">${p.status}</span></td>
            <td>${p.responsavel}</td>
            <td style="font-size:.78rem;color:var(--text-light)">${p.data}</td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="adminVerProjeto('${p.id}')" title="Ver"><i class="ph ph-eye"></i></button>
                <button class="btn btn-sm btn-ghost" onclick="adminAvancarFaseAdmin('${p.id}')" title="Avançar fase"><i class="ph ph-arrow-fat-right"></i></button>
            </td>
        </tr>`).join('');
}

function adminFiltrarProjetos() {
    const etapa = document.getElementById('projFiltroEtapa')?.value||'Todos';
    const q     = (document.getElementById('projBusca')?.value||'').toLowerCase();
    _adminRenderProjetos(mockProjetos.filter(p=>{
        const me = etapa==='Todos'||p.status===etapa;
        const mq = !q||p.cliente.toLowerCase().includes(q)||p.id.toLowerCase().includes(q);
        return me&&mq;
    }));
}

function adminVerProjeto(id) {
    const p=mockProjetos.find(x=>x.id===id);
    if(!p) return;
    alert(`📋 ${p.id}\nCliente: ${p.cliente}\nkWp: ${p.potencia_kwp}\nValor: ${formatCurrency(p.valor_total)}\nConc.: ${p.concessionaria}\nResp.: ${p.responsavel}\nStatus: ${p.status}`);
}

function adminSalvarProjeto() {
    const c=document.getElementById('projCliente')?.value?.trim();
    const k=parseFloat(document.getElementById('projKwp')?.value);
    const v=parseFloat(document.getElementById('projValor')?.value);
    const conc=document.getElementById('projConc')?.value;
    const resp=document.getElementById('projResp')?.value;
    if(!c||!k||!v){alert('Preencha os campos obrigatórios!');return;}
    const id='SOL-'+String(mockProjetos.length+1).padStart(3,'0');
    mockProjetos.unshift({id,cliente:c,responsavel:resp,potencia_kwp:k,valor_total:v,concessionaria:conc,status:'Venda',data:new Date().toLocaleDateString('pt-BR')});
    alert(`✅ Projeto ${id} cadastrado!`);
    closeModal('modalNovoProjeto');
    _adminRenderProjetos();
    _adminRenderKPIs();
    _adminRenderFunil();
}

function adminAvancarFaseAdmin(id) {
    const fases=['Venda','Projeto','Instalação','Homologação','Concluído'];
    const p=mockProjetos.find(x=>x.id===id);
    if(!p) return;
    const idx=fases.indexOf(p.status);
    if(idx>=fases.length-1){alert('Projeto já concluído.');return;}
    const nova=fases[idx+1];
    if(!confirm(`Avançar "${p.cliente}"?\n${p.status} → ${nova}`)) return;
    p.status=nova;
    _adminRenderProjetos(); _adminRenderFunil(); _adminRenderKPIs();
    alert(`✅ ${id} → ${nova}`);
}

// ======= ORÇAMENTOS =======
function _adminRenderOrcamentos() {
    const tb=document.getElementById('orcListBody');
    if(!tb) return;
    const cor={Aprovada:'var(--success-color)',Enviada:'var(--secondary-color)',Rascunho:'var(--text-light)',Recusada:'var(--danger-color)'};
    tb.innerHTML=mockOrcamentos.map(o=>`
        <tr>
            <td><strong>${o.id}</strong></td>
            <td>${o.cliente}</td>
            <td>${o.kwp} kWp</td>
            <td>${formatCurrency(o.valor)}</td>
            <td><span class="badge" style="color:${cor[o.status]||'inherit'};background:${cor[o.status]||'inherit'}22">${o.status}</span></td>
            <td>${o.data}</td>
            <td>${o.validade}</td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="adminVerOrc('${o.id}')" title="Ver"><i class="ph ph-eye"></i></button>
                <button class="btn btn-sm btn-ghost" style="color:var(--success-color)" onclick="adminConverterOrcProjeto('${o.id}')" title="→ Projeto"><i class="ph ph-arrow-fat-right"></i></button>
            </td>
        </tr>`).join('');
}

function adminCalcularProposta() {
    const cliente=document.getElementById('orcCliente')?.value?.trim()||'Cliente';
    const kwp=parseFloat(document.getElementById('orcKwp')?.value);
    const tarifa=parseFloat(document.getElementById('orcTarifa')?.value)||0.85;
    const custoKwp=parseFloat(document.getElementById('orcCusto')?.value)||3800;
    const entradaPct=parseFloat(document.getElementById('orcEntrada')?.value)||20;
    const parcelas=parseInt(document.getElementById('orcParcelas')?.value)||60;
    const juros=parseFloat(document.getElementById('orcJuros')?.value)/100||0.0099;
    const conc=document.getElementById('orcConc')?.value;

    if(!kwp||kwp<=0){alert('Informe o kWp do sistema!');return;}

    const valorTotal = kwp*custoKwp;
    const geracaoMes = kwp*110;
    const economiaM  = geracaoMes*tarifa;
    const paybackA   = (valorTotal/(economiaM*12)).toFixed(1);
    const entrada    = valorTotal*(entradaPct/100);
    const financiado = valorTotal-entrada;
    const parcelaV   = financiado*(juros*Math.pow(1+juros,parcelas))/(Math.pow(1+juros,parcelas)-1);

    _orcCalcData={cliente,kwp,tarifa,custoKwp,valorTotal,geracaoMes,economiaM,paybackA,entrada,financiado,parcelas,parcelaV,conc};

    const infoR=(l,v,c)=>`<div class="info-row"><span>${l}</span><span style="color:${c||'inherit'};font-weight:600">${v}</span></div>`;
    const body=document.getElementById('orcResultBody');
    if(body) body.innerHTML=
        infoR('Sistema',         kwp+' kWp') +
        infoR('Valor Total',     formatCurrency(valorTotal)) +
        infoR('Entrada',         formatCurrency(entrada)+` (${entradaPct}%)`) +
        infoR('Financiado',      formatCurrency(financiado)) +
        infoR(`Parcela (${parcelas}x)`, formatCurrency(parcelaV),'var(--secondary-color)') +
        infoR('Geração Est.',    geracaoMes.toFixed(0)+' kWh/mês') +
        infoR('Economia/mês',    formatCurrency(economiaM),'var(--success-color)') +
        infoR('Payback',         paybackA+' anos');

    const panel=document.getElementById('orcResultPanel');
    if(panel) panel.style.display='block';
}

function adminVerPrevia() {
    if(!_orcCalcData){alert('Calcule primeiro!');return;}
    const d=_orcCalcData;
    const id='PROP-'+Date.now().toString().slice(-5);
    const infoR=(l,v)=>`<div class="info-row"><span>${l}</span><span><strong>${v}</strong></span></div>`;
    const html=`
        <div class="proposta-header">
            <div><div class="proposta-logo">☀️ Solaris</div><div style="font-size:.8rem;color:var(--text-light)">Energia Solar Ltda</div></div>
            <div style="text-align:right;font-size:.8rem;color:var(--text-light)"><strong>${id}</strong><br>Emitida em ${new Date().toLocaleDateString('pt-BR')}</div>
        </div>
        <div class="proposta-section"><h4>Cliente</h4>${infoR('Nome',d.cliente)+infoR('Concessionária',d.conc)}</div>
        <div class="proposta-section"><h4>Sistema Fotovoltaico</h4>
            ${infoR('Potência',d.kwp+' kWp')+infoR('Geração Estimada',d.geracaoMes.toFixed(0)+' kWh/mês')+infoR('Economia Mensal',formatCurrency(d.economiaM))+infoR('Retorno do Investimento',d.paybackA+' anos')}
        </div>
        <div class="proposta-section"><h4>Investimento</h4>
            ${infoR('Valor Total',formatCurrency(d.valorTotal))+infoR('Entrada',formatCurrency(d.entrada))+infoR('Financiamento ('+d.parcelas+'x)',formatCurrency(d.parcelaV)+'/mês')}
        </div>
        <div class="proposta-total"><div style="font-size:.75rem;font-weight:600;text-transform:uppercase;color:var(--text-light);margin-bottom:.25rem">Investimento Total</div><div class="total-valor">${formatCurrency(d.valorTotal)}</div><div style="font-size:.8rem;color:var(--text-light);margin-top:.25rem">Economia estimada em 25 anos: ${formatCurrency(d.economiaM*12*25)}</div></div>
        <p style="font-size:.68rem;color:var(--text-light);margin-top:.75rem;">*Valores estimados. Proposta válida por 30 dias. Sujeito a vistoria técnica.</p>`;
    const pb=document.getElementById('propostaPreviewBody');
    if(pb) pb.innerHTML=html;
    openModal('modalProposta');
}

function adminExportarProposta() {
    const d=_orcCalcData;
    if(!d){alert('Calcule primeiro!');return;}
    const txt=`PROPOSTA COMERCIAL — SOLARIS ENERGIA SOLAR\n${'='.repeat(46)}\nCliente  : ${d.cliente}\nData     : ${new Date().toLocaleDateString('pt-BR')}\n\nSISTEMA\nPotência : ${d.kwp} kWp\nGeração  : ${d.geracaoMes.toFixed(0)} kWh/mês\nEconomia : ${formatCurrency(d.economiaM)}/mês\nPayback  : ${d.paybackA} anos\n\nINVESTIMENTO\nTotal      : ${formatCurrency(d.valorTotal)}\nEntrada    : ${formatCurrency(d.entrada)}\n${d.parcelas}x de   : ${formatCurrency(d.parcelaV)}\n\n* Proposta válida por 30 dias.\n* Sujeito a vistoria técnica.\n\nSolaris Energia Solar — contato@solaris.com.br`;
    const blob=new Blob([txt],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=`Proposta-${d.cliente.replace(/\s/g,'-')}.txt`;a.click();URL.revokeObjectURL(url);
    closeModal('modalProposta');
}

function adminConverterProjeto() {
    if(!_orcCalcData){alert('Calcule uma proposta primeiro!');return;}
    const d=_orcCalcData;
    const id='SOL-'+String(mockProjetos.length+1).padStart(3,'0');
    mockProjetos.unshift({id,cliente:d.cliente,responsavel:'Eng. Roberto Marques',potencia_kwp:d.kwp,valor_total:d.valorTotal,concessionaria:d.conc,status:'Venda',data:new Date().toLocaleDateString('pt-BR')});
    const novoOrc={id:'ORC-'+String(mockOrcamentos.length+1).padStart(3,'0'),cliente:d.cliente,kwp:d.kwp,valor:d.valorTotal,status:'Aprovada',data:new Date().toLocaleDateString('pt-BR'),validade:'—'};
    mockOrcamentos.push(novoOrc);
    alert(`✅ Proposta convertida!\nProjeto ${id} criado com sucesso.`);
    closeModal('modalProposta');
    _adminRenderOrcamentos(); _adminRenderProjetos(); _adminRenderKPIs(); _adminRenderFunil();
    showPage('projetos');
}

function adminConverterOrcProjeto(orcId) {
    const o=mockOrcamentos.find(x=>x.id===orcId);
    if(!o){return;}
    if(!confirm(`Converter ${o.id} — ${o.cliente} em projeto?`)) return;
    const id='SOL-'+String(mockProjetos.length+1).padStart(3,'0');
    mockProjetos.unshift({id,cliente:o.cliente,responsavel:'Eng. Roberto Marques',potencia_kwp:o.kwp,valor_total:o.valor,concessionaria:'—',status:'Venda',data:new Date().toLocaleDateString('pt-BR')});
    o.status='Aprovada';
    alert(`✅ Projeto ${id} criado!`);
    _adminRenderOrcamentos(); _adminRenderProjetos(); _adminRenderKPIs(); _adminRenderFunil();
    showPage('projetos');
}

function adminVerOrc(id) {
    const o=mockOrcamentos.find(x=>x.id===id);
    if(!o) return;
    alert(`📄 ${o.id}\nCliente: ${o.cliente}\nkWp: ${o.kwp}\nValor: ${formatCurrency(o.valor)}\nStatus: ${o.status}\nValidade: ${o.validade}`);
}

// ======= INSTALAÇÃO / OS =======
function _adminRenderOS() {
    set('kpiOSAndamento', String(mockOS.filter(x=>x.status==='Em andamento').length));
    set('kpiOSAguardando',String(mockOS.filter(x=>x.status==='Aguardando').length));
    set('kpiOSConcluidas', String(mockOS.filter(x=>x.status==='Concluída').length));
    set('kpiOSTotal',      String(mockOS.length));
    const tb=document.getElementById('osTableBody');
    if(!tb) return;
    const corStatus={Concluída:'var(--success-color)','Em andamento':'var(--secondary-color)',Aguardando:'var(--text-light)'};
    tb.innerHTML=mockOS.map(os=>`
        <tr>
            <td><strong>${os.id}</strong></td>
            <td>${os.projeto}</td>
            <td>${os.cliente}</td>
            <td>${os.tecnico}</td>
            <td>${os.inicio}</td>
            <td>${os.previsao}</td>
            <td><span style="color:${corStatus[os.status]};font-weight:600;">${os.status}</span></td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="adminVerChecklist('${os.id}')" title="Checklist"><i class="ph ph-list-checks"></i></button>
            </td>
        </tr>`).join('');
}

const checklistItens = ['Fixação estrutura concluída','Cabeamento DC instalado','Inversor fixado e cabeado','Sistema de aterramento','Acionamento e comissionamento','Fotos registradas','Cliente orientado'];

function adminVerChecklist(osId) {
    const os=mockOS.find(x=>x.id===osId);
    if(!os) return;
    const panel=document.getElementById('osChecklistPanel');
    const body=document.getElementById('osChecklistBody');
    const titulo=document.getElementById('osChecklistTitulo');
    if(!panel||!body) return;
    const concl = os.status==='Concluída';
    if(titulo) titulo.innerText=`${os.id} — ${os.cliente}`;
    body.innerHTML=`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:.6rem;margin-top:.5rem;">`+
        checklistItens.map((it,i)=>`
            <label style="display:flex;align-items:center;gap:.6rem;padding:.5rem .75rem;background:var(--bg-card);border-radius:var(--radius-sm);cursor:pointer;">
                <input type="checkbox" ${concl||i<3?'checked':''} style="width:16px;height:16px;accent-color:var(--success-color)">
                <span style="font-size:.85rem;">${it}</span>
            </label>`).join('')+`</div>
        <button class="btn btn-primary btn-sm mt-2" onclick="adminSalvarChecklist('${osId}')"><i class="ph ph-floppy-disk"></i> Salvar Checklist</button>`;
    panel.style.display='block';
    panel.scrollIntoView({behavior:'smooth'});
}

function adminSalvarChecklist(osId) {
    alert(`✅ Checklist da OS ${osId} salvo!`);
}

function adminSalvarOS() {
    const proj=document.getElementById('osProjeto')?.value;
    const tec=document.getElementById('osTecnico')?.value;
    const ini=document.getElementById('osInicio')?.value;
    const prev=document.getElementById('osPrevisao')?.value;
    if(!ini||!prev){alert('Preencha as datas!');return;}
    const p=mockProjetos.find(x=>x.id===proj);
    const id='OS-'+String(mockOS.length+1).padStart(3,'0');
    mockOS.push({id,projeto:proj,cliente:p?.cliente||proj,tecnico:tec,inicio:new Date(ini+'T00:00:00').toLocaleDateString('pt-BR'),previsao:new Date(prev+'T00:00:00').toLocaleDateString('pt-BR'),status:'Aguardando'});
    alert(`✅ OS ${id} criada!`);
    closeModal('modalNovaOS');
    _adminRenderOS();
}

// ======= DOCUMENTAÇÃO & LICENÇAS =======
function _adminRenderDocLicencas(lista) {
    lista=lista||mockDocLicencas;
    const tb=document.getElementById('docLicTableBody');
    if(!tb) return;
    const corStatus={Aprovado:'var(--success-color)',Enviado:'#60A5FA','Em análise':'var(--secondary-color)',Pendente:'var(--text-light)',Reprovado:'var(--danger-color)'};
    tb.innerHTML=lista.map(d=>`
        <tr>
            <td><strong>${d.id}</strong></td>
            <td>${d.projeto}</td>
            <td>${d.documento}</td>
            <td>${d.tipo}</td>
            <td>${d.envio}</td>
            <td>${d.retEsperado}</td>
            <td>${d.retReal}</td>
            <td><span style="color:${corStatus[d.status]};font-weight:600;font-size:.8rem;">${d.status}</span></td>
        </tr>`).join('');

    const stageDocs={Projeto:[false,false,false,false,false],Instalação:[true,true,false,false,false],Homologação:[true,true,true,true,false],Concluído:[true,true,true,true,true]};
    const tick=b=>b?'<span style="color:var(--success-color);font-size:1rem;">✅</span>':'<span style="color:var(--border-color);font-size:1rem;">☐</span>';
    const cb=document.getElementById('docChecklistBody');
    if(!cb) return;
    cb.innerHTML=mockProjetos.filter(p=>['Projeto','Instalação','Homologação','Concluído'].includes(p.status)).map(p=>{
        const d=stageDocs[p.status]||[false,false,false,false,false];
        return `<tr><td><strong>${p.id}</strong></td><td>${p.cliente}</td><td><span class="badge ${badgeClass(p.status)}">${p.status}</span></td>
            ${d.map(b=>`<td style="text-align:center">${tick(b)}</td>`).join('')}</tr>`;
    }).join('');
}

function adminFiltrarDocs() {
    const status=document.getElementById('docFiltroStatus')?.value||'Todos';
    _adminRenderDocLicencas(status==='Todos'?mockDocLicencas:mockDocLicencas.filter(d=>d.status===status));
}

// ====== ARQUIVO SELECIONADO (Admin modal) ======
function adminAtualizarArquivo(input) {
    const label = document.getElementById('adminFileLabel');
    if (label && input.files && input.files.length > 0) {
        label.textContent = 'Arquivo: ' + input.files[0].name;
        label.style.color = 'var(--success-color)';
    }
}

function adminSalvarUpload() {
    const proj=document.getElementById('uploadProjeto')?.value;
    const tipo=document.getElementById('uploadTipo')?.value;
    const fileInput=document.getElementById('fileInputAdmin');
    const p=mockProjetos.find(x=>x.id===proj);
    const id='DL-'+String(mockDocLicencas.length+1).padStart(3,'0');
    const nome=(fileInput&&fileInput.files&&fileInput.files.length>0)?fileInput.files[0].name:'—';
    mockDocLicencas.push({id,projeto:proj,documento:tipo,tipo:'PDF',envio:new Date().toLocaleDateString('pt-BR'),retEsperado:'—',retReal:'—',status:'Enviado'});
    alert(`Documento enviado!\nArquivo: ${nome}\n${tipo} — ${p?.cliente||proj}`);
    closeModal('modalUploadDoc');
    if(fileInput) fileInput.value='';
    const label=document.getElementById('adminFileLabel');
    if(label){label.textContent='PDF, JPG ou PNG — máx 20MB';label.style.color='';}
    _adminRenderDocLicencas();
}

// ======= MANUTENÇÃO O&M =======
function _adminRenderManutencao() {
    set('kpiMntAbertos',    String(mockManutencao.filter(x=>x.status==='Aberto').length));
    set('kpiMntAtrasados',  String(mockManutencao.filter(x=>x.sla==='atrasado').length));
    set('kpiMntAgendados',  String(mockManutencao.filter(x=>x.status==='Agendada').length));
    set('kpiMntConcluidos', '1');
    const tb=document.getElementById('manutencaoTableBody');
    if(!tb) return;
    tb.innerHTML=mockManutencao.map(m=>{
        const slaCls=m.sla==='atrasado'?'sla-atrasado':m.sla==='alerta'?'sla-alerta':'sla-ok';
        const slaIcon=m.sla==='atrasado'
            ?`<span class="sla-atrasado"><i class="ph-fill ph-x-circle"></i> Atrasado</span>`
            :m.sla==='alerta'
            ?`<span class="sla-alerta"><i class="ph-fill ph-warning"></i> Alerta</span>`
            :`<span class="sla-ok"><i class="ph-fill ph-check-circle"></i> OK</span>`;
        return `<tr>
            <td><strong>${m.id}</strong></td>
            <td><span class="badge ${m.tipo==='Corretiva'?'badge-instalacao':'badge-projeto'}">${m.tipo}</span></td>
            <td>${m.cliente}</td>
            <td>${m.projeto}</td>
            <td>${m.data}</td>
            <td>${m.prazo}</td>
            <td><span style="font-size:.8rem;font-weight:600;">${m.status}</span></td>
            <td><span class="${slaCls}">${slaIcon}</span></td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="adminEncerrarChamado('${m.id}')" title="Encerrar"><i class="ph ph-check-circle"></i></button>
            </td>
        </tr>`;
    }).join('');
}

function adminEncerrarChamado(id) {
    const m=mockManutencao.find(x=>x.id===id);
    if(!m||!confirm(`Encerrar ${m.id}?`)) return;
    m.status='Concluído'; m.sla='ok';
    _adminRenderManutencao();
}

function adminSalvarChamado() {
    const tipo=document.getElementById('chamadoTipo')?.value;
    const proj=document.getElementById('chamadoProjeto')?.value;
    const data=document.getElementById('chamadoData')?.value;
    const prazo=document.getElementById('chamadoPrazo')?.value;
    if(!data||!prazo){alert('Preencha datas!');return;}
    const p=mockProjetos.find(x=>x.id===proj)||mockProjetos[0];
    const fmt=d=>new Date(d+'T00:00:00').toLocaleDateString('pt-BR');
    const id='MNT-'+String(mockManutencao.length+1).padStart(3,'0');
    mockManutencao.push({id,tipo,cliente:p.cliente,projeto:proj,data:fmt(data),prazo:fmt(prazo),status:'Aberto',sla:'ok'});
    alert(`✅ Chamado ${id} aberto!`);
    closeModal('modalNovoChamado');
    _adminRenderManutencao();
}

// ======= EQUIPAMENTOS =======
function _adminRenderEquipamentos(cat) {
    _eqTabAtual=cat;
    const estoqueTag=(est,min)=>{
        if(est<=0)         return `<span class="sla-atrasado"><i class="ph-fill ph-prohibit"></i> Zerado (${est})</span>`;
        if(est<min)        return `<span class="sla-atrasado"><i class="ph-fill ph-warning-circle"></i> Critico (${est})</span>`;
        if(est<min*1.5)    return `<span class="sla-alerta"><i class="ph-fill ph-warning"></i> Baixo (${est})</span>`;
        return             `<span class="sla-ok"><i class="ph-fill ph-check-circle"></i> OK (${est})</span>`;
    };
    if(cat==='paineis') {
        const tb=document.getElementById('eqPaineisBody');
        if(tb) tb.innerHTML=mockEquipamentos.paineis.map(e=>`<tr>
            <td><strong>${e.id}</strong></td><td>${e.modelo}</td><td>${e.tipo}</td><td>${e.potencia}</td>
            <td>${e.eficiencia}</td><td>${e.garantia}</td><td>${formatCurrency(e.preco)}</td>
            <td>${e.estoque}</td><td>${estoqueTag(e.estoque,e.minimo)}</td></tr>`).join('');
    } else if(cat==='inversores') {
        const tb=document.getElementById('eqInversoresBody');
        if(tb) tb.innerHTML=mockEquipamentos.inversores.map(e=>`<tr>
            <td><strong>${e.id}</strong></td><td>${e.modelo}</td><td>${e.tipo}</td><td>${e.potencia}</td>
            <td>${e.garantia}</td><td>${e.fabricante}</td><td>${formatCurrency(e.preco)}</td>
            <td>${e.estoque}</td><td>${estoqueTag(e.estoque,e.minimo)}</td></tr>`).join('');
    } else if(cat==='estruturas') {
        const tb=document.getElementById('eqEstruturasBody');
        if(tb) tb.innerHTML=mockEquipamentos.estruturas.map(e=>`<tr>
            <td><strong>${e.id}</strong></td><td>${e.modelo}</td><td>${e.tipo}</td>
            <td>${e.garantia}</td><td>${e.fabricante}</td><td>${formatCurrency(e.preco)}</td>
            <td>${e.estoque}</td><td>${estoqueTag(e.estoque,e.minimo)}</td></tr>`).join('');
    }
}

function _adminRenderFornecedores() {
    const tb=document.getElementById('eqFornecedoresBody');
    if(!tb) return;
    tb.innerHTML=mockFornecedores.map(f=>`<tr><td><strong>${f.nome}</strong></td><td>${f.contato}</td><td>${f.email}</td><td>${f.prazo}</td><td>${f.especialidade}</td></tr>`).join('');
}

function adminEqTab(cat) {
    ['paineis','inversores','estruturas','fornecedores'].forEach(c=>{
        const panel=document.getElementById('eq'+c.charAt(0).toUpperCase()+c.slice(1));
        const btn=document.getElementById('eqTab-'+c);
        if(panel) panel.style.display=(c===cat?'block':'none');
        if(btn)   btn.classList.toggle('active',c===cat);
    });
    if(cat!=='fornecedores') _adminRenderEquipamentos(cat);
}

function adminSalvarEquipamento() {
    const cat=document.getElementById('eqCategoria')?.value;
    const modelo=document.getElementById('eqModelo')?.value?.trim();
    const fab=document.getElementById('eqFabricante')?.value?.trim();
    const preco=parseFloat(document.getElementById('eqPreco')?.value)||0;
    const est=parseInt(document.getElementById('eqEstoque')?.value)||0;
    if(!modelo){alert('Informe o modelo!');return;}
    const key=cat==='Painel'?'paineis':cat==='Inversor'?'inversores':'estruturas';
    const prefix=cat==='Painel'?'PA':cat==='Inversor'?'IV':'ES';
    const id=prefix+'-'+String(mockEquipamentos[key].length+1).padStart(3,'0');
    mockEquipamentos[key].push({id,modelo,tipo:cat,potencia:'—',eficiencia:'—',garantia:'—',fabricante:fab||'—',preco,estoque:est,minimo:5});
    alert(`✅ ${modelo} cadastrado!`);
    closeModal('modalNovoEquipamento');
    _adminRenderEquipamentos(_eqTabAtual);
}

// ======= EQUIPE =======
function _adminRenderEquipe() {
    const tb=document.getElementById('equipeTableBody');
    if(!tb) return;
    tb.innerHTML=mockColaboradores.map(c=>`
        <tr>
            <td><strong>${c.nome}</strong></td>
            <td>${c.cargo}</td>
            <td>${c.email}</td>
            <td>${c.fone}</td>
            <td>${(c.cargo.includes('Eng')||c.cargo.includes('Téc'))?c.obras+' obras':'—'}</td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="adminEditarColab(${c.id})" title="Editar"><i class="ph ph-pencil"></i></button>
                <button class="btn btn-sm btn-ghost" style="color:var(--danger-color)" onclick="adminRemoverColab(${c.id})" title="Remover"><i class="ph ph-trash"></i></button>
            </td>
        </tr>`).join('');
}

function adminSalvarColaborador() {
    const nome=document.getElementById('colabNome')?.value?.trim();
    const cargo=document.getElementById('colabCargo')?.value;
    const email=document.getElementById('colabEmail')?.value?.trim();
    const fone=document.getElementById('colabFone')?.value?.trim();
    if(!nome||!email){alert('Preencha nome e e-mail!');return;}
    mockColaboradores.push({id:Date.now(),nome,cargo,email,fone:fone||'—',obras:0});
    alert(`✅ "${nome}" cadastrado!`);
    closeModal('modalNovoColab');
    _adminRenderEquipe(); _adminRenderKPIs();
}

function adminEditarColab(id) {
    const c=mockColaboradores.find(x=>x.id===id);
    if(!c) return;
    const novo=prompt(`Editando: ${c.nome}\nNovo nome:`,c.nome);
    if(novo){c.nome=novo;_adminRenderEquipe();}
}

function adminRemoverColab(id) {
    const c=mockColaboradores.find(x=>x.id===id);
    if(!c||!confirm(`Remover "${c.nome}"?`)) return;
    mockColaboradores.splice(mockColaboradores.findIndex(x=>x.id===id),1);
    _adminRenderEquipe(); _adminRenderKPIs();
}

// ======= DRE & INDICADORES =======
function _adminRenderDRE() {
    const p=mockProjetos;
    const fat=p.reduce((s,x)=>s+x.valor_total,0);
    const kwp=p.reduce((s,x)=>s+x.potencia_kwp,0);
    const custoEst=fat*0.65;
    const margem=fat-custoEst;
    const margemPct=((margem/fat)*100).toFixed(1);

    // Use standard metric-card/metric-value/metric-title so sizes match every other panel
    const cards=document.getElementById('dreCardsContainer');
    if(cards) cards.innerHTML=`
        <div class="metric-card"><span class="metric-title">Receita Bruta</span><span class="metric-value" style="color:var(--success-color)">${formatCurrency(fat)}</span><span style="font-size:.68rem;color:var(--text-light);margin-top:.15rem;display:block">${p.length} projetos</span></div>
        <div class="metric-card"><span class="metric-title">Custo Estimado (65%)</span><span class="metric-value" style="color:var(--danger-color)">${formatCurrency(custoEst)}</span><span style="font-size:.68rem;color:var(--text-light);margin-top:.15rem;display:block">Equip. + mão de obra</span></div>
        <div class="metric-card"><span class="metric-title">Margem Bruta</span><span class="metric-value" style="color:var(--secondary-color)">${formatCurrency(margem)}</span><span style="font-size:.68rem;color:var(--text-light);margin-top:.15rem;display:block">${margemPct}% de margem</span></div>
        <div class="metric-card"><span class="metric-title">Potência Total</span><span class="metric-value">${kwp.toFixed(1)} kWp</span><span style="font-size:.68rem;color:var(--text-light);margin-top:.15rem;display:block">${(kwp/1000).toFixed(3)} MWp</span></div>`;

    const infoR=(l,v,c)=>`<div class="info-row"><span>${l}</span><span style="color:${c||'inherit'};font-weight:600">${v}</span></div>`;
    const indDiv=document.getElementById('dreIndicadores');
    const orcAprov=mockOrcamentos.filter(o=>o.status==='Aprovada').length;
    const taxaConv=((orcAprov/mockOrcamentos.length)*100).toFixed(0);
    const cac=formatCurrency(fat/p.length*0.15);
    if(indDiv) indDiv.innerHTML=
        infoR('CAC (Est.)',           cac) +
        infoR('Taxa de Conversão',    taxaConv+'%','var(--success-color)') +
        infoR('Ticket Médio',         formatCurrency(fat/p.length)) +
        infoR('kWp Médio/Projeto',    (kwp/p.length).toFixed(1)+' kWp') +
        infoR('Propostas Aprovadas',  orcAprov+' de '+mockOrcamentos.length);

    const top=document.getElementById('dreTopProjetos');
    if(top) top.innerHTML=[...p].sort((a,b)=>b.valor_total-a.valor_total).slice(0,5).map((proj,i)=>{
        const mPct=(35).toFixed(0)+'%';
        return `<div class="info-row"><span>${i+1}. ${proj.cliente}</span><span style="color:var(--secondary-color)">${formatCurrency(proj.valor_total)} <small style="color:var(--text-light)">(~${mPct})</small></span></div>`;
    }).join('');

    const perf=document.getElementById('drePerformance');
    const resp={};
    p.forEach(proj=>{resp[proj.responsavel]=(resp[proj.responsavel]||0)+proj.potencia_kwp;});
    if(perf) perf.innerHTML=Object.entries(resp).sort((a,b)=>b[1]-a[1]).map(([n,k])=>
        `<div class="info-row"><span>${n}</span><span style="font-weight:600">${k.toFixed(1)} kWp</span></div>`).join('');

    // Gráfico de barras CSS
    const meses=[{m:'Out',v:32},{m:'Nov',v:45},{m:'Dez',v:38},{m:'Jan',v:62},{m:'Fev',v:84},{m:'Mar',v:143}];
    const max=Math.max(...meses.map(x=>x.v));
    const chart=document.getElementById('dreBarChart');
    if(chart) chart.innerHTML=meses.map(m=>`
        <div class="bar-col">
            <div class="bar-value" style="font-size:.65rem;font-weight:700;">${m.v}</div>
            <div class="bar-fill bar-amber" style="height:${(m.v/max)*100}px;"></div>
            <div class="bar-label">${m.m}</div>
        </div>`).join('');

    const tb=document.getElementById('dreProjetosBody');
    if(tb) tb.innerHTML=p.map((proj,i)=>{
        const marg=(proj.valor_total*0.35);
        return `<tr><td>${i+1}</td><td>${proj.cliente}</td><td>${proj.potencia_kwp} kWp</td>
            <td>${formatCurrency(proj.valor_total)}</td><td>${formatCurrency(proj.valor_total*0.65)}</td>
            <td style="color:var(--success-color);font-weight:600">${formatCurrency(marg)} (35%)</td>
            <td><span class="badge ${badgeClass(proj.status)}">${proj.status}</span></td>
            <td style="font-size:.8rem">${proj.responsavel}</td></tr>`;
    }).join('');
}

function adminExportarDRE() {


    const fat=mockProjetos.reduce((s,p)=>s+p.valor_total,0);
    const kwp=mockProjetos.reduce((s,p)=>s+p.potencia_kwp,0);
    const custo=fat*0.65; const mg=fat-custo;
    let txt=`DRE — SOLARIS ENERGIA SOLAR\n${'='.repeat(40)}\nData: ${new Date().toLocaleDateString('pt-BR')}\n\nRECEITAS\nFaturamento Bruto : ${formatCurrency(fat)}\nTicket Médio      : ${formatCurrency(fat/mockProjetos.length)}\n\nCUSTOS\nCusto Estimado (65%): ${formatCurrency(custo)}\n\nRESULTADO\nMargem Bruta : ${formatCurrency(mg)}\nMargem %     : ${((mg/fat)*100).toFixed(1)}%\n\nOPERACIONAL\nTotal Projetos : ${mockProjetos.length}\nkWp Total      : ${kwp.toFixed(1)}\nMWp Total      : ${(kwp/1000).toFixed(3)}\n\nDETALHAMENTO\n`;
    mockProjetos.forEach((p,i)=>{txt+=`${i+1}. [${p.id}] ${p.cliente} — ${p.potencia_kwp}kWp — ${formatCurrency(p.valor_total)} — ${p.status}\n`;});
    const blob=new Blob([txt],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=`DRE-Solaris-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url);
}

// ======= PERMISSÕES =======
function _adminRenderPermissoes() {
    const tb=document.getElementById('permTableBody');
    if(tb) tb.innerHTML=mockPermissoes.map(u=>{
        const cor={Admin:'var(--secondary-color)',Comercial:'#60A5FA',Engenheiro:'#A78BFA',Cliente:'var(--text-light)'};
        return `<tr>
            <td><strong>${u.nome}</strong></td>
            <td style="font-size:.8rem">${u.email}</td>
            <td><span style="color:${cor[u.perfil]};font-weight:600;">${u.perfil}</span></td>
            <td style="font-size:.78rem;color:var(--text-light)">${u.acesso}</td>
            <td style="font-size:.78rem">${u.ultimo}</td>
            <td><button class="btn btn-sm btn-ghost" onclick="adminEditarUsuario(${u.id})" title="Editar"><i class="ph ph-pencil"></i></button></td>
        </tr>`;
    }).join('');
}

function _adminRenderLog() {
    const tb=document.getElementById('logTableBody');
    if(tb) tb.innerHTML=mockLogAcoes.map(l=>`
        <tr>
            <td style="font-size:.8rem">${l.user}</td>
            <td>${l.acao}</td>
            <td><span class="badge badge-projeto">${l.modulo}</span></td>
            <td style="font-size:.78rem;color:var(--text-light)">${l.data}</td>
        </tr>`).join('');
}

function adminEditarUsuario(id) {
    const u=mockPermissoes.find(x=>x.id===id);
    if(!u) return;
    alert(`✏️ Editando: ${u.nome}\nPerfil atual: ${u.perfil}\nFuncionalidade de edição em implementação.`);
}

function adminSalvarUsuario() {
    const nome=document.getElementById('uNome')?.value?.trim();
    const email=document.getElementById('uEmail')?.value?.trim();
    const perfil=document.getElementById('uPerfil')?.value;
    if(!nome||!email){alert('Preencha nome e e-mail!');return;}
    const acessos={Admin:'Total',Comercial:'Pipeline, Propostas',Engenheiro:'Obras, Docs',Cliente:'Portal Cliente'};
    mockPermissoes.push({id:Date.now(),nome,email,perfil,acesso:acessos[perfil]||'—',ultimo:'Nunca'});
    mockLogAcoes.unshift({user:'admin@solaris.com.br',acao:`Adicionou usuário ${nome}`,modulo:'Permissões',data:new Date().toLocaleString('pt-BR')});
    alert(`✅ "${nome}" adicionado!`);
    closeModal('modalNovoUsuario');
    _adminRenderPermissoes(); _adminRenderLog();
}

// ======= MISC =======
function adminVerFase(fase) {
    const lista=mockProjetos.filter(p=>p.status===fase);
    let txt=`${fase.toUpperCase()} — ${lista.length} projetos\n\n`;
    lista.forEach(p=>{txt+=`• [${p.id}] ${p.cliente} — ${p.potencia_kwp}kWp — ${formatCurrency(p.valor_total)}\n`;});
    alert(txt||'Nenhum projeto nesta fase.');
}

function adminSalvarConfiguracoes() {
    mockLogAcoes.unshift({user:'admin@solaris.com.br',acao:'Salvou configurações do sistema',modulo:'Config',data:new Date().toLocaleString('pt-BR')});
    alert('✅ Configurações salvas!');
}
