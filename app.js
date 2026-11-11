'use strict';
const GROUPS = [
 {name:'Humans only',label:'Nur Menschen',words:[['skin','Haut'],['hair','Haare'],['blood','Blut'],['heart','Herz'],['brain','Gehirn'],['feelings','Gefühle'],['food','Essen'],['water','Wasser'],['eat','essen'],['drink','trinken'],['sleep','schlafen'],['grow','wachsen'],['cry','weinen'],['dream','träumen'],['feel pain','Schmerzen spüren']]},
 {name:'Both',label:'Beide',words:[['head','Kopf'],['arms','Arme'],['hands','Hände'],['legs','Beine'],['feet','Füsse'],['eyes','Augen'],['voice','Stimme'],['body','Körper'],['walk','gehen'],['run','rennen'],['jump','springen'],['dance','tanzen'],['talk','sprechen'],['listen','zuhören'],['see','sehen'],['carry','tragen']]},
 {name:'Robots only',label:'Nur Roboter',words:[['battery','Akku'],['motor','Motor'],['wires','Kabel'],['computer','Computer'],['camera','Kamera'],['sensor','Sensor'],['metal','Metall'],['software','Software'],['charge','aufladen'],['scan','scannen'],['calculate','berechnen'],['record','aufnehmen'],['restart','neu starten'],['update','aktualisieren'],['switch on','einschalten'],['switch off','ausschalten']]}
];
const ALL=GROUPS.flatMap((group,g)=>group.words.map(([en,de],i)=>({id:`${g}-${i}`,en,de,g})));
const $=s=>document.querySelector(s), app=$('#app');
let stage=0, placements={},selected=null,feedback=null, drag=null;
const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
const order=GROUPS.map((g,i)=>shuffle(ALL.filter(w=>w.g===i)));
const finalOrder=shuffle(ALL);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function stepWords(){return stage<3?order[stage]:finalOrder}
function targetFor(id){return placements[id]??'bank'}
function setHead(){
 const labels=['Humans only · Nur Menschen','Both · Beide','Robots only · Nur Roboter','Final challenge · Venn diagram'];
 $('#eyebrow').textContent=stage<3?`LERNRUNDE ${stage+1} VON 3`:'ABSCHLUSSAUFGABE';
 $('#heading').textContent=stage<3?labels[stage]:'Human, robot or both?';
 $('#description').textContent=stage<3?'Ordne die englischen Wortkarten den deutschen Übersetzungen zu. Jede Karte lässt sich wieder verschieben.':'Ordne alle englischen Wörter den drei Bereichen zu: nur Menschen, beide oder nur Roboter.';
 $('#progress').innerHTML=[0,1,2,3].map(i=>`<div class="step ${i<stage?'done':i===stage?'current':''}"></div>`).join('');
}
function wordMarkup(w){return `<button class="word${selected===w.id?' picked':''}" type="button" data-word="${w.id}" aria-label="Wort ${esc(w.en)}">${esc(w.en)}</button>`}
function bankMarkup(words){return words.filter(w=>targetFor(w.id)==='bank').map(wordMarkup).join('')}
function show(){setHead();const ws=stepWords();if(stage===4){app.innerHTML=`<section class="panel completion"><div class="trophy">🏆</div><h2>Well done!</h2><p>Du hast alle Wörter richtig zugeordnet<br>und das Venn-Diagramm geschafft.</p><button class="btn" type="button" id="again">Nochmals spielen</button></section>`;$('#again').addEventListener('click',reset);return}
 const placed=ws.filter(w=>targetFor(w.id)!=='bank').length;
 let inner='';
 if(stage<3){
  const slots=ws.map(w=>`<div class="slot" data-target="${w.id}" tabindex="0" aria-label="Übersetzung ${esc(w.de)}"><span class="translation">${esc(w.de)}</span>${ws.filter(x=>targetFor(x.id)===w.id).map(wordMarkup).join('')||'<span class="placeholder">Hier ablegen</span>'}</div>`).join('');
  inner=`<div class="workspace"><section><div class="subheading">ENGLISH WORDS <span>${ws.length-placed} übrig</span></div><div class="bank" data-target="bank">${bankMarkup(ws)}</div></section><section><div class="subheading">DEUTSCHE ÜBERSETZUNGEN <span>${placed} / ${ws.length}</span></div><div class="slots">${slots}</div></section></div>`;
 }else{
  const areas=[['human','👤 Humans','Nur Menschen','0'],['both','🤝 Both','Beide','1'],['robot','🤖 Robots','Nur Roboter','2']];
  const zones=areas.map(([cls,title,sub,key])=>`<div class="category ${cls}" data-target="${key}" tabindex="0"><h3>${title}</h3><p>${sub}</p><div class="pile">${ws.filter(w=>targetFor(w.id)===key).map(wordMarkup).join('')}</div></div>`).join('');
  inner=`<div class="venn-layout"><div class="venn-visual" aria-label="Venn-Diagramm: Menschen links, Roboter rechts, beide in der Überlappung"><div class="venn-circle h">Humans</div><div class="venn-circle r">Robots</div><div class="venn-center">Both</div></div><p class="venn-instruction">Ziehe jede Karte in die passende Kategorie. Der mittlere Bereich entspricht der Überschneidung im Venn-Diagramm.</p><div class="venn-board">${zones}</div><div class="subheading" style="margin-top:18px">WORTKARTEN <span>${ws.length-placed} übrig</span></div><div class="venn-pool bank" data-target="bank">${bankMarkup(ws)}</div></div>`;
 }
 app.innerHTML=`<section class="panel"><div class="panelhead"><div class="left"><span class="round">${stage===3?'FINALE':`RUNDE ${stage+1}`}</span><h2>${stage===3?'Sortiere alle Wörter':GROUPS[stage].name}</h2></div><span class="count">${placed} von ${ws.length} zugeordnet</span></div>${inner}<div class="panelbottom"><button class="btn" id="check" type="button">Zuordnung prüfen</button>${stage>0?'<button class="btn secondary" id="back" type="button">← Zurück</button>':''}<div class="feedback ${feedback===0?'success':''}" role="status">${feedback===null?'':feedback===0?'✓ Alles richtig!':`${feedback} ${feedback===1?'Fehler':'Fehler'} – versuche es nochmals.`}</div>${feedback===0?'<button class="btn" type="button" id="next">'+(stage===3?'Abschliessen →':'Nächste Runde →')+'</button>':''}<span class="hint">Du erfährst nur die Anzahl Fehler.</span></div></section>`;
 $('#check').addEventListener('click',check);
 $('#back')?.addEventListener('click',()=>{stage--;placements={};feedback=null;selected=null;show()});
 $('#next')?.addEventListener('click',()=>{stage++;placements={};feedback=null;selected=null;show()});
 app.querySelectorAll('[data-word]').forEach(el=>el.addEventListener('pointerdown',pointerDown));
 app.querySelectorAll('[data-target]').forEach(el=>{el.addEventListener('click',onTargetClick);el.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&selected){e.preventDefault();move(selected,el.dataset.target)}})});
}
function check(){const ws=stepWords();let mistakes=0;for(const w of ws){const answer=targetFor(w.id);if(stage===3?answer!==String(w.g):answer!==w.id)mistakes++}feedback=mistakes;selected=null;show()}
function move(id,target){const w=stepWords().find(x=>x.id===id);if(!w)return;if(stage<3&&target!=='bank'){
 if(!stepWords().some(x=>x.id===target))return;
 for(const other of stepWords())if(other.id!==id&&targetFor(other.id)===target)delete placements[other.id];
 }else if(stage===3&&!['bank','0','1','2'].includes(target))return;
 if(target==='bank')delete placements[id];else placements[id]=target;
 feedback=null;selected=null;show();
}
function onTargetClick(e){if(!selected)return;if(e.target.closest('[data-word]'))return;const dest=e.currentTarget.dataset.target;move(selected,dest)}
function pointerDown(e){if(e.button!==0)return;const el=e.currentTarget,id=el.dataset.word,startX=e.clientX,startY=e.clientY;drag={id,startX,startY,active:false,pointerId:e.pointerId};
 const onMove=ev=>{if(!drag||ev.pointerId!==drag.pointerId)return;const dx=ev.clientX-startX,dy=ev.clientY-startY;if(!drag.active&&Math.hypot(dx,dy)>7){drag.active=true;el.classList.add('dragging');$('#drag-float').style.display='block';$('#drag-float').textContent=stepWords().find(x=>x.id===id).en;}
 if(drag.active){ev.preventDefault();const f=$('#drag-float');f.style.left=ev.clientX+'px';f.style.top=ev.clientY+'px';app.querySelectorAll('.ishover').forEach(n=>n.classList.remove('ishover'));const dest=document.elementFromPoint(ev.clientX,ev.clientY)?.closest('[data-target]');if(dest)dest.classList.add('ishover');}};
 const onEnd=ev=>{if(!drag||ev.pointerId!==drag.pointerId)return;window.removeEventListener('pointermove',onMove);window.removeEventListener('pointerup',onEnd);window.removeEventListener('pointercancel',onCancel);const wasActive=drag.active;drag=null;$('#drag-float').style.display='none';el.classList.remove('dragging');if(wasActive){const dest=document.elementFromPoint(ev.clientX,ev.clientY)?.closest('[data-target]');if(dest)move(id,dest.dataset.target);else show();}else{selected=selected===id?null:id;show();}};
 const onCancel=()=>{window.removeEventListener('pointermove',onMove);window.removeEventListener('pointerup',onEnd);window.removeEventListener('pointercancel',onCancel);drag=null;$('#drag-float').style.display='none';show()};
 window.addEventListener('pointermove',onMove,{passive:false});window.addEventListener('pointerup',onEnd);window.addEventListener('pointercancel',onCancel);
}
function reset(){stage=0;placements={};selected=null;feedback=null;for(let i=0;i<3;i++)order[i]=shuffle(ALL.filter(w=>w.g===i));finalOrder.splice(0,finalOrder.length,...shuffle(ALL));show()}
$('#reset').addEventListener('click',reset);
show();
