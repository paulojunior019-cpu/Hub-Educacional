let QUESTIONS=[];
const KEY='biouece-progress-v1';
let progress=JSON.parse(localStorage.getItem(KEY)||'{}');
let state={view:location.hash.slice(1)||'inicio',selectedId:null,filters:{edition:'todas',status:'todas',search:''},sessionIds:[],sessionIndex:0,answeredInSession:{}};

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const save=()=>localStorage.setItem(KEY,JSON.stringify(progress));
const answeredCount=()=>Object.keys(progress).length;
const correctCount=()=>Object.values(progress).filter(x=>x.correct).length;
const wrongCount=()=>Object.values(progress).filter(x=>!x.correct).length;
const pct=(a,b)=>b?Math.round(a/b*100):0;
function findQ(id){return QUESTIONS.find(q=>q.id===id)}
function ensureSelected(){if(!state.selectedId||!findQ(state.selectedId)) state.selectedId=QUESTIONS[0]?.id}
function render(){
  document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.dataset.view===state.view));
  const app=document.getElementById('app');
  if(state.view==='questoes') app.innerHTML=renderQuestions();
  else if(state.view==='desempenho') app.innerHTML=renderPerformance();
  else if(state.view==='erros') app.innerHTML=renderErrors();
  else app.innerHTML=renderHome();
  bind();
}
function renderHome(){
 return `<div class="container hub-home">
   <section class="hub-hero">
     <div><div class="eyebrow">Seu espaço de estudos</div><h1>Um só lugar para acompanhar sua preparação.</h1><p>Escolha uma plataforma para continuar estudando. O BioUECE já está pronto; os próximos módulos serão adicionados por aqui.</p></div>
     <div class="hub-hero-mark" aria-hidden="true">H<span>+</span></div>
   </section>
   <div class="section-title hub-section-title"><div><h2>Suas plataformas</h2><p>Comece pelo módulo disponível.</p></div></div>
   <section class="platform-grid" aria-label="Plataformas de estudo">
     <article class="platform-card platform-ready">
       <div class="platform-icon" aria-hidden="true">🧬</div><span class="platform-status">Disponível</span>
       <h3>Biologia UECE</h3><p>Questões da 2ª fase, correção imediata e acompanhamento do desempenho.</p>
       <div class="platform-progress"><strong>${QUESTIONS.length}</strong><span>questões · ${answeredCount()} respondidas</span></div>
       <button class="btn btn-primary" data-go="questoes">Abrir plataforma <span aria-hidden="true">→</span></button>
     </article>
     <article class="platform-card platform-soon">
       <div class="platform-icon" aria-hidden="true">🔬</div><span class="platform-status">Em preparação</span>
       <h3>ProfBio</h3><p>Um espaço para organizar conteúdos e estudos do ProfBio.</p>
       <div class="platform-note">Este módulo será adicionado em uma próxima etapa.</div>
     </article>
     <article class="platform-card platform-soon">
       <div class="platform-icon" aria-hidden="true">📊</div><span class="platform-status">Em preparação</span>
       <h3>SPAECE</h3><p>Materiais e atividades de preparação para o SPAECE.</p>
       <div class="platform-note">Este módulo será adicionado em uma próxima etapa.</div>
     </article>
     <article class="platform-card platform-future">
       <div class="platform-icon" aria-hidden="true">📚</div><span class="platform-status">Futuro módulo</span>
       <h3>Banco de Questões</h3><p>Um espaço geral para reunir questões de diferentes disciplinas e avaliações.</p>
       <div class="platform-note">Planejado para uma próxima etapa.</div>
     </article>
   </section>
   <section class="hub-overview" aria-label="Progresso geral">
     <div class="hub-overview-heading"><div><span class="hub-summary-label">Progresso geral</span><p>Seu histórico de estudos no BioUECE neste dispositivo.</p></div><button class="btn btn-primary" data-continue>Continuar estudando <span aria-hidden="true">→</span></button></div>
     <div class="stats-grid hub-stats"><div class="stat"><div class="value">${answeredCount()}</div><div class="label">Questões respondidas</div></div><div class="stat"><div class="value">${correctCount()}</div><div class="label">Acertos</div></div><div class="stat"><div class="value">${wrongCount()}</div><div class="label">No caderno de erros</div></div><div class="stat"><div class="value">${pct(correctCount(),answeredCount())}%</div><div class="label">Aproveitamento</div></div></div>
   </section>
   <section class="hub-summary" aria-label="Resumo do BioUECE">
     <div><span class="hub-summary-label">Seu BioUECE</span><strong>${pct(correctCount(),answeredCount())}%</strong><span class="hub-summary-caption">de aproveitamento nas questões respondidas</span></div>
     <div class="hub-summary-bar"><div class="progressbar"><span style="width:${pct(answeredCount(),QUESTIONS.length)}%"></span></div><small>${answeredCount()} de ${QUESTIONS.length} questões respondidas</small></div>
     <button class="btn btn-ghost" data-go="desempenho">Ver desempenho</button>
   </section>
   <p class="hub-local-note">Seu progresso fica salvo neste dispositivo.</p>
 </div>`;
}
function filtered(){
 let arr=QUESTIONS.filter(q=>state.filters.edition==='todas'||q.vestibular===state.filters.edition);
 if(state.filters.status==='nao') arr=arr.filter(q=>!progress[q.id]);
 if(state.filters.status==='acertou') arr=arr.filter(q=>progress[q.id]?.correct);
 if(state.filters.status==='errou') arr=arr.filter(q=>progress[q.id]&&!progress[q.id].correct);
 const s=state.filters.search.trim().toLowerCase(); if(s) arr=arr.filter(q=>(q.enunciado+' '+Object.values(q.alternativas).join(' ')).toLowerCase().includes(s));
 return arr;
}
function renderQuestions(){
 const arr=filtered(); if(!arr.find(q=>q.id===state.selectedId)) state.selectedId=arr[0]?.id||null; const q=findQ(state.selectedId);
 return `<div class="container"><div class="section-title"><div><h2>Questões de Biologia</h2><p>${arr.length} questão(ões) no filtro atual.</p></div><button class="btn btn-ghost" id="randomBtn">Questão aleatória</button></div>
 <div class="card filters"><select class="select" id="editionFilter"><option value="todas">Todos os vestibulares</option>${[...new Set(QUESTIONS.map(q=>q.vestibular))].sort().map(e=>`<option ${state.filters.edition===e?'selected':''} value="${e}">${e}</option>`).join('')}</select><select class="select" id="statusFilter"><option value="todas">Todos os status</option><option value="nao" ${state.filters.status==='nao'?'selected':''}>Não respondidas</option><option value="acertou" ${state.filters.status==='acertou'?'selected':''}>Acertadas</option><option value="errou" ${state.filters.status==='errou'?'selected':''}>Erradas</option></select><input class="input" id="searchFilter" placeholder="Buscar no enunciado..." value="${esc(state.filters.search)}"><div class="notice">Gabaritos e textos foram separados dos dados de progresso. Assim, novas provas podem ser adicionadas sem alterar o motor.</div><button class="btn btn-danger" id="resetBtn">Zerar progresso</button></div>
 <div class="question-layout"><aside class="card question-list">${arr.length?arr.map(x=>`<button class="qitem ${x.id===state.selectedId?'active':''} ${progress[x.id]?(progress[x.id].correct?'ok':'bad'):''}" data-qid="${x.id}"><div class="qtop"><span>${x.numero}. ${x.vestibular}</span><span>${progress[x.id]?(progress[x.id].correct?'✓':'×'):''}</span></div><small>Biologia · ${x.fase}</small></button>`).join(''):`<div class="empty">Nenhuma questão encontrada.</div>`}</aside><section class="card question-card">${q?renderQuestion(q):`<div class="empty">Selecione uma questão.</div>`}</section></div></div>`;
}
function renderQuestion(q){
 const p=progress[q.id]; const selected=p?.answer; const answered=!!p;
 return `<div class="q-meta"><span class="tag">UECE ${q.vestibular}</span><span class="tag">Questão ${String(q.numero).padStart(2,'0')}</span><span class="tag">Biologia</span>${q.gabaritoStatus?`<span class="tag">${esc(q.gabaritoStatus)}</span>`:''}</div><div class="progressbar"><span style="width:${pct(Object.keys(progress).length,QUESTIONS.length)}%"></span></div><p style="font-size:11px;color:var(--muted);margin:7px 0 22px">Progresso geral: ${answeredCount()} de ${QUESTIONS.length}</p><h2>${esc(q.enunciado)}</h2><div class="options">${Object.entries(q.alternativas).map(([l,t])=>{let cls='';if(answered&&l===q.gabarito)cls='correct';if(answered&&l===selected&&l!==q.gabarito)cls='wrong';if(answered&&l===selected)cls+=' selected';return `<button class="option ${cls.trim()}" data-answer="${l}" ${answered?'disabled':''}><span class="letter">${l}</span><span>${esc(t)}</span></button>`}).join('')}</div>${answered?`<div class="feedback ${p.correct?'correct':'wrong'}"><strong>${p.correct?'Resposta correta.':'Resposta incorreta.'}</strong>Você marcou <b>${p.answer}</b>. Gabarito oficial: <b>${q.gabarito}</b>.</div>`:''}<div class="question-actions"><button class="btn btn-ghost" id="prevBtn">← Anterior</button>${answered?`<button class="btn btn-primary" id="nextBtn">Próxima →</button>`:`<span></span>`}</div><div class="source">Fonte: ${esc(q.fonte||'UECE')}</div>`;
}
function renderPerformance(){
 const eds=[...new Set(QUESTIONS.map(q=>q.vestibular))].sort(); return `<div class="container"><div class="section-title"><div><h2>Desempenho</h2><p>O histórico é armazenado localmente no navegador.</p></div></div><div class="stats-grid"><div class="stat"><div class="value">${answeredCount()}</div><div class="label">Respondidas</div></div><div class="stat"><div class="value">${correctCount()}</div><div class="label">Acertos</div></div><div class="stat"><div class="value">${wrongCount()}</div><div class="label">Erros</div></div><div class="stat"><div class="value">${pct(correctCount(),answeredCount())}%</div><div class="label">Aproveitamento</div></div></div><div class="dashboard-grid"><div class="card card-pad"><h3>Por vestibular</h3>${eds.map(ed=>{let qs=QUESTIONS.filter(q=>q.vestibular===ed);let a=qs.filter(q=>progress[q.id]).length,c=qs.filter(q=>progress[q.id]?.correct).length;return `<div class="bar-row"><span>${ed}</span><div class="bar"><i style="width:${pct(c,a)}%"></i></div><b>${pct(c,a)}%</b></div><small style="color:var(--muted)">${c} acertos de ${a} respondidas</small>`}).join('')}</div><div class="card card-pad"><h3>Próximos módulos</h3><div class="notice">Classificação por tema, tempo médio, dificuldade estimada, simulados e login/sincronização entram como camadas do banco, sem mudar a estrutura das questões.</div><p style="font-size:13px;color:var(--muted)">A ideia é simples: acrescentar dados e funcionalidades, não reconstruir o site a cada nova prova.</p></div></div></div>`;
}
function renderErrors(){
 const errs=QUESTIONS.filter(q=>progress[q.id]&&!progress[q.id].correct); return `<div class="container"><div class="section-title"><div><h2>Caderno de erros</h2><p>${errs.length} questão(ões) para revisar.</p></div><button class="btn btn-ghost" data-go="questoes">Voltar às questões</button></div>${errs.length?`<div class="error-list">${errs.map(q=>`<div class="card error-item"><div><strong>UECE ${q.vestibular} · Questão ${String(q.numero).padStart(2,'0')}</strong><div style="color:var(--muted);font-size:13px;margin-top:3px">${esc(q.enunciado.slice(0,180))}${q.enunciado.length>180?'...':''}</div></div><button class="btn btn-primary" data-review="${q.id}">Revisar</button></div>`).join('')}</div>`:`<div class="card empty">Seu caderno de erros está vazio. A humanidade ainda tem salvação.</div>`}</div>`;
}
function bind(){
 document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{location.hash=b.dataset.go});
 document.querySelectorAll('[data-continue]').forEach(b=>b.onclick=()=>{const next=QUESTIONS.find(q=>!progress[q.id]);state.selectedId=(next||QUESTIONS[0])?.id||null;location.hash='questoes'});
 document.querySelectorAll('[data-qid]').forEach(b=>b.onclick=()=>{state.selectedId=b.dataset.qid;render()});
 document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>answer(b.dataset.answer));
 document.querySelectorAll('[data-review]').forEach(b=>b.onclick=()=>{state.selectedId=b.dataset.review;location.hash='questoes'});
 const ef=document.getElementById('editionFilter'); if(ef)ef.onchange=e=>{state.filters.edition=e.target.value;render()};
 const sf=document.getElementById('statusFilter'); if(sf)sf.onchange=e=>{state.filters.status=e.target.value;render()};
 const search=document.getElementById('searchFilter'); if(search)search.oninput=e=>{state.filters.search=e.target.value;render()};
 const rand=document.getElementById('randomBtn'); if(rand)rand.onclick=()=>{let a=filtered();if(a.length){state.selectedId=a[Math.floor(Math.random()*a.length)].id;render()}};
 const next=document.getElementById('nextBtn'); if(next)next.onclick=()=>move(1);
 const prev=document.getElementById('prevBtn'); if(prev)prev.onclick=()=>move(-1);
 const reset=document.getElementById('resetBtn'); if(reset)reset.onclick=()=>{if(confirm('Zerar todo o progresso deste dispositivo?')){progress={};save();render()}};
}
function answer(letter){const q=findQ(state.selectedId);if(!q||progress[q.id])return;progress[q.id]={answer:letter,correct:letter===q.gabarito,at:new Date().toISOString()};save();render()}
function move(dir){let a=filtered();let i=a.findIndex(q=>q.id===state.selectedId);let ni=i+dir;if(ni>=0&&ni<a.length){state.selectedId=a[ni].id;render()}}
window.addEventListener('hashchange',()=>{state.view=location.hash.slice(1)||'inicio';render()});
fetch('data/questoes.json').then(r=>r.json()).then(data=>{QUESTIONS=data;ensureSelected();render()}).catch(err=>{document.getElementById('app').innerHTML='<div class="container"><div class="card empty">Não foi possível carregar o banco de questões.</div></div>';console.error(err)});
