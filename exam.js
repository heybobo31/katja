
const order=["abstract","verbal","numerical","planning","accuracy","customer","cooperation"];
const perSection=8; // 56 Aufgaben insgesamt; bewusst als realistische Simulation gewählt.
let exam=[];
order.forEach(key=>{
  const arr=[...window.EAG_DATA[key].questions];
  // deterministic selection to keep same exam
  exam.push(...arr.slice(0,perSection).map(q=>({...q,section:key})));
});
let idx=0, answers=Array(exam.length).fill(null), finished=false;
let seconds=120*60;

function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function fmt(sec){const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}
const tick=setInterval(()=>{if(finished)return; seconds--; document.getElementById('timer').textContent=fmt(seconds); if(seconds<=0){clearInterval(tick);finishExam();}},1000);

function renderNav(){
  const n=document.getElementById('qnav'); n.innerHTML='';
  exam.forEach((q,i)=>{const x=document.createElement('div');x.className='qnav'+(answers[i]!==null?' answered':'')+(i===idx?' current':'');x.textContent=i+1;x.onclick=()=>{idx=i;render();};n.appendChild(x);});
}
function render(){
  const q=exam[idx], mod=window.EAG_DATA[q.section];
  document.getElementById('section').textContent=mod.title;
  document.getElementById('count').textContent=`Aufgabe ${idx+1} von ${exam.length}`;
  document.getElementById('bar').style.width=`${((idx+1)/exam.length)*100}%`;
  document.getElementById('prompt').textContent=q.prompt;
  const c=document.getElementById('context'); if(q.context_html){c.innerHTML=q.context_html;c.style.display='block';}else{c.textContent=q.context||'';c.style.display=q.context?'block':'none';}
  const opts=document.getElementById('options'); opts.innerHTML='';
  q.options.forEach((o,i)=>{
    const b=document.createElement('button');b.className='option';if(q.option_html){b.classList.add('visual-option');b.innerHTML=`<span class="opt-letter">${String.fromCharCode(65+i)}</span>${q.option_html[i]}`;}else{b.textContent=`${String.fromCharCode(65+i)}. ${o}`;}
    if(answers[idx]===i)b.classList.add('selected');
    b.onclick=()=>{answers[idx]=i;render();}; opts.appendChild(b);
  });
  document.getElementById('prev').disabled=idx===0;
  document.getElementById('next').disabled=idx===exam.length-1;
  renderNav();
}
function finishExam(){
  finished=true; clearInterval(tick);
  let total=0, by={};
  order.forEach(k=>by[k]={ok:0,n:0});
  exam.forEach((q,i)=>{by[q.section].n++; if(answers[i]===q.answer){total++;by[q.section].ok++;}});
  const pct=Math.round(total/exam.length*100);
  let rows=order.map(k=>{
    const m=window.EAG_DATA[k],r=by[k],p=Math.round(r.ok/r.n*100);
    return `<tr><td>${esc(m.title)}</td><td>${r.ok}/${r.n}</td><td>${p}%</td></tr>`;
  }).join('');
  document.querySelector('main').innerHTML=`<div class="card"><h1>Prüfung beendet</h1><div class="score">${total}/${exam.length}</div><p>${pct}% richtige Antworten.</p>
  <div class="tablewrap"><table class="data-table"><tr><th>Bereich</th><th>Richtig</th><th>Quote</th></tr>${rows}</table></div>
  <div class="notice"><strong>Keine offizielle EAG-Bewertung:</strong> Die echte Prüfung verwendet standardisierte Stanine-Werte. Diese Simulation zeigt deshalb bewusst nur Trainingsquoten.</div>
  <div class="toolbar"><button class="primary" onclick="location.reload()">Prüfung wiederholen</button><a class="btn secondary" href="index.html">Zur Übersicht</a></div></div>`;
}
document.getElementById('prev').onclick=()=>{if(idx>0){idx--;render();}};
document.getElementById('next').onclick=()=>{if(idx<exam.length-1){idx++;render();}};
document.getElementById('finish').onclick=()=>{if(confirm('Prüfung wirklich abgeben?'))finishExam();};
document.getElementById('timer').textContent=fmt(seconds);
render();
