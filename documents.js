function qs(id){return document.getElementById(id);} 

function loadDocs(){
  return JSON.parse(localStorage.getItem('pengeplan_documents')||'[]');
}
function saveDocs(docs){
  localStorage.setItem('pengeplan_documents', JSON.stringify(docs));
}

function formatBytes(b){ if(!b) return '0 B'; const u=['B','KB','MB','GB']; const i=Math.floor(Math.log(b)/Math.log(1024)); return (b/Math.pow(1024,i)).toFixed(1)+' '+u[i]; }

function render(){
  const grid=qs('fileGrid'); const empty=qs('emptyState');
  const docs=loadDocs();
  grid.innerHTML='';
  if(docs.length===0){ empty.style.display='block'; return; } else empty.style.display='none';
  for(const d of docs){
    const el=document.createElement('div'); el.className='file-card';
    const badge=`<span class="badge ${d.status||'planned'}">${(d.status||'planned')==='planned'?'Planlagt':(d.status==='paid'?'Betalt':'Forfalt')}</span>`;
    const tags=(d.tags||[]).map(t=>`<span class="chip">${t}</span>`).join('');
    el.innerHTML=`<div class="file-meta">${badge}</div>
      <h4>${d.title||d.name}</h4>
      <div class="file-meta">${formatBytes(d.size)} • ${new Date(d.created_at).toLocaleDateString('nb-NO')}</div>
      <div style="margin-top:6px;">${tags}</div>
      <div style="display:flex; gap:8px; margin-top:10px;">
        <button class="secondary-btn" data-open="${d.id}"><span class="btn-icon">👁</span><span>Åpne</span></button>
        <button class="secondary-btn" data-del="${d.id}"><span class="btn-icon">🗑</span><span>Slett</span></button>
      </div>`;
    grid.appendChild(el);
  }
}

function addFiles(files){
  const docs=loadDocs();
  const now=Date.now();
  for(const f of files){
    if(!(f.type.startsWith('image/')||f.type==='application/pdf')){ alert('Kun bilder eller PDF.'); continue; }
    if(f.size>10*1024*1024){ alert('Maks 10MB per fil i gratisversjonen.'); continue; }
    docs.push({ id: crypto.randomUUID(), name: f.name, title: f.name.replace(/\.[^.]+$/,''), size: f.size, mimetype: f.type, created_at: now, status:'planned', tags:[] });
  }
  saveDocs(docs); render();
}

document.addEventListener('DOMContentLoaded', ()=>{
  // Sidebar info
  const email=localStorage.getItem('pengeplan_email')||'din@epost.no';
  const p=JSON.parse(localStorage.getItem('pengeplan_profile')||'{}');
  const sn=document.getElementById('sidebarName'); if(sn) sn.textContent=p.name||'Bruker';
  const se=document.getElementById('sidebarEmail'); if(se) se.textContent=email;
  const logout=document.getElementById('logoutFromDocs'); if(logout) logout.addEventListener('click',(e)=>{e.preventDefault(); localStorage.removeItem('pengeplan_logged_in'); localStorage.removeItem('pengeplan_email'); location.href='index.html';});

  render();
  const input=qs('fileInput');
  qs('uploadBtn').addEventListener('click',()=>input.click());
  input.addEventListener('change',()=>{ addFiles(input.files||[]); input.value=''; });

  const dz=qs('dropzone');
  dz.addEventListener('dragover',(e)=>{ e.preventDefault(); dz.style.background='#f8fafc'; });
  dz.addEventListener('dragleave',()=>{ dz.style.background='transparent'; });
  dz.addEventListener('drop',(e)=>{ e.preventDefault(); dz.style.background='transparent'; const files=[...e.dataTransfer.files]; addFiles(files); });

  qs('fileGrid').addEventListener('click',(e)=>{
    const t=e.target.closest('button'); if(!t) return; const docs=loadDocs();
    if(t.dataset.del){ const id=t.dataset.del; const i=docs.findIndex(x=>x.id===id); if(i>-1){ if(confirm('Slette filen?')){ docs.splice(i,1); saveDocs(docs); render(); } } }
    if(t.dataset.open){ alert('Forhåndsvisning kommer i neste steg.'); }
  });
});


