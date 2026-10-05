const key = document.body.dataset.module;
const sourceMod = window.EAG_DATA && window.EAG_DATA[key];
if(!sourceMod){ document.querySelector('main').innerHTML='<div class="card"><h1>Fehler beim Laden</h1><p>Die Aufgabendaten konnten nicht geladen werden. Bitte die Seite neu laden.</p></div>'; throw new Error('Missing module '+key); }
const STORAGE_KEY=`eag_c1_seen_${key}`;
function getSeen(){try{return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]'));}catch(e){return new Set();}}
function saveSeen(s){try{localStorage.setItem(STORAGE_KEY,JSON.stringify([...s]));}catch(e){}}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const original=sourceMod.questions.map((q,i)=>({...q,_qid:i}));
const seen=getSeen(); const unseen=shuffle(original.filter(q=>!seen.has(q._qid))); const known=shuffle(original.filter(q=>seen.has(q._qid)));
const questions=unseen.length?[...unseen,...known]:shuffle(original); const mod={...sourceMod,questions};
let idx=0,answers=Array(mod.questions.length).fill(null),checked=Array(mod.questions.length).fill(false);
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function markSeen(q){const s=getSeen();s.add(q._qid);saveSeen(s);updateSeenLabel();}
function updateSeenLabel(){const el=document.getElementById('seenCount');if(el)el.textContent=`Schon bearbeitet: ${original.filter(q=>getSeen().has(q._qid)).length}/${original.length}`;}
function renderRichContext(q,el){
  if(q.context_html){el.innerHTML=q.context_html;el.style.display='block';}
  else if(q.context){el.textContent=q.context;el.style.display='block';}
  else {el.innerHTML='';el.style.display='none';}
}
function render(){
 const q=mod.questions[idx];
 document.getElementById('title').textContent=mod.title;document.getElementById('subtitle').textContent=mod.short;document.getElementById('count').textContent=`Aufgabe ${idx+1} von ${mod.questions.length}`;document.getElementById('bar').style.width=`${((idx+1)/mod.questions.length)*100}%`;document.getElementById('prompt').textContent=q.prompt;
 renderRichContext(q,document.getElementById('context'));
 const opts=document.getElementById('options');opts.innerHTML='';
 q.options.forEach((o,i)=>{const b=document.createElement('button');b.className='option';
   if(Array.isArray(q.option_html)&&q.option_html[i]){b.classList.add('visual-option');b.innerHTML=`<span class="opt-letter">${String.fromCharCode(65+i)}</span>${q.option_html[i]}`;}
   else b.textContent=`${String.fromCharCode(65+i)}. ${o}`;
   if(answers[idx]===i)b.classList.add('selected');b.onclick=()=>choose(i);opts.appendChild(b);});
 document.getElementById('feedback').innerHTML='';if(checked[idx])showFeedback();document.getElementById('prev').disabled=idx===0;document.getElementById('next').textContent=idx===mod.questions.length-1?'Auswertung':'Nächste';updateSeenLabel();
}
function choose(i){if(checked[idx])return;answers[idx]=i;markSeen(mod.questions[idx]);document.querySelectorAll('.option').forEach((b,j)=>b.classList.toggle('selected',j===i));}
function check(){if(answers[idx]===null){document.getElementById('feedback').innerHTML='<div class="feedback bad">Bitte zuerst eine Antwort auswählen.</div>';return;}checked[idx]=true;showFeedback();}
function showFeedback(){const q=mod.questions[idx],good=answers[idx]===q.answer;document.querySelectorAll('.option').forEach((b,j)=>{if(j===q.answer)b.classList.add('correct');if(j===answers[idx]&&!good)b.classList.add('wrong');});document.getElementById('feedback').innerHTML=`<div class="feedback ${good?'good':'bad'}"><strong>${good?'Richtig':'Nicht richtig'}.</strong> ${esc(q.explanation)}</div>`;}
function next(){if(idx<mod.questions.length-1){idx++;render();}else showResults();}
function showResults(){let correct=0,answered=0;answers.forEach((a,i)=>{if(a!==null){answered++;if(a===mod.questions[i].answer)correct++;}});const pct=answered?Math.round(correct/answered*100):0;document.querySelector('main').innerHTML=`<div class="card"><h1>${esc(mod.title)} – Auswertung</h1><div class="score">${correct}/${answered}</div><p>${pct}% der beantworteten Aufgaben richtig.</p><p class="muted">Beim nächsten Einstieg erscheinen noch nicht bearbeitete Aufgaben zuerst und zufällig gemischt.</p><div class="toolbar"><button class="primary" onclick="location.reload()">Neuer gemischter Durchgang</button><a class="btn secondary" href="index.html">Zur Übersicht</a></div></div>`;}
document.getElementById('check').onclick=check;document.getElementById('prev').onclick=()=>{if(idx>0){idx--;render();}};document.getElementById('next').onclick=next;render();