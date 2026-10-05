
const key = document.body.dataset.module;
const sourceMod = window.EAG_DATA[key];
const STORAGE_KEY = `eag_c1_seen_${key}`;

function getSeen(){
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); }
  catch(e){ return new Set(); }
}
function saveSeen(set){
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}
function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

// Stable IDs per original question position.
const original = sourceMod.questions.map((q,i)=>({...q,_qid:i}));
const seen = getSeen();
let unseen = shuffle(original.filter(q=>!seen.has(q._qid)));
let known = shuffle(original.filter(q=>seen.has(q._qid)));

// If all 50 have been seen, every new session is a fresh complete shuffle.
let questions = unseen.length ? [...unseen, ...known] : shuffle(original);

const mod = {...sourceMod, questions};
let idx = 0, answers = Array(mod.questions.length).fill(null);

function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}

function markSeen(q){
  const s=getSeen();
  s.add(q._qid);
  saveSeen(s);
  updateSeenLabel();
}
function updateSeenLabel(){
  const count=getSeen().size;
  const el=document.getElementById('seenCount');
  if(el) el.textContent=`Schon bearbeitet: ${count}/50`;
}

function render(){
  const q=mod.questions[idx];
  document.getElementById('title').textContent=mod.title;
  document.getElementById('subtitle').textContent=mod.short;
  document.getElementById('count').textContent=`Aufgabe ${idx+1} von ${mod.questions.length}`;
  document.getElementById('bar').style.width=`${((idx+1)/mod.questions.length)*100}%`;
  document.getElementById('prompt').textContent=q.prompt;

  const ctx=document.getElementById('context');
  const hasRichContext = q.context_html && ['visual','planning','accuracy_table'].includes(q.kind);
  if(hasRichContext){
    ctx.innerHTML=q.context_html;
  } else if(q.kind==='accuracy_table'){
    ctx.innerHTML=q.context||'';
  } else {
    ctx.textContent=q.context||'';
  }
  ctx.style.display=(q.context_html||q.context)?'block':'none';

  const opts=document.getElementById('options'); opts.innerHTML='';
  q.options.forEach((o,i)=>{
    const b=document.createElement('button');
    b.className='option';
    if(q.kind==='visual' && Array.isArray(q.option_html)){
      b.classList.add('visual-option');
      b.innerHTML=`<span class="opt-letter">${String.fromCharCode(65+i)}</span>${q.option_html[i]}`;
    } else if(q.kind==='html_options'){
      b.innerHTML=`${String.fromCharCode(65+i)}. ${o}`;
    } else {
      b.innerHTML=`${String.fromCharCode(65+i)}. ${esc(o)}`;
    }
    if(answers[idx]===i) b.classList.add('selected');
    b.onclick=()=>choose(i);
    opts.appendChild(b);
  });

  document.getElementById('feedback').innerHTML='';
  document.getElementById('prev').disabled=idx===0;
  document.getElementById('next').textContent=idx===mod.questions.length-1?'Auswertung':'Nächste';
  updateSeenLabel();
}

function choose(i){
  answers[idx]=i;
  markSeen(mod.questions[idx]);
  [...document.querySelectorAll('.option')].forEach((b,j)=>b.classList.toggle('selected',j===i));
}
function check(){
  if(answers[idx]===null){
    document.getElementById('feedback').innerHTML='<div class="feedback bad">Bitte zuerst eine Antwort auswählen.</div>';
    return;
  }
  const q=mod.questions[idx], good=answers[idx]===q.answer;
  [...document.querySelectorAll('.option')].forEach((b,j)=>{
    if(j===q.answer)b.classList.add('correct');
    if(j===answers[idx]&&!good)b.classList.add('wrong');
  });
  document.getElementById('feedback').innerHTML=`<div class="feedback ${good?'good':'bad'}"><strong>${good?'Richtig':'Nicht richtig'}.</strong> ${esc(q.explanation)}</div>`;
}
function prev(){if(idx>0){idx--;render();}}
function next(){
  if(idx<mod.questions.length-1){idx++;render();}
  else showResults();
}
function showResults(){
  let correct=0, answered=0;
  answers.forEach((a,i)=>{if(a!==null){answered++; if(a===mod.questions[i].answer)correct++;}});
  const pct=answered ? Math.round(correct/answered*100) : 0;
  document.querySelector('main').innerHTML=`<div class="card"><h1>${esc(mod.title)} – Auswertung</h1>
  <div class="score">${correct}/${answered}</div><p>${pct}% der beantworteten Aufgaben richtig.</p>
  <p class="muted">Beim nächsten Einstieg werden noch nicht bearbeitete Aufgaben zuerst und in zufälliger Reihenfolge gezeigt.</p>
  <div class="toolbar"><button class="primary" onclick="location.reload()">Neuer gemischter Durchgang</button><a class="btn secondary" href="index.html">Zur Übersicht</a></div></div>`;
}
document.getElementById('check').onclick=check;
document.getElementById('prev').onclick=prev;
document.getElementById('next').onclick=next;
render();
