// Simple profile settings using localStorage (Supabase-ready later)

function qs(id) { return document.getElementById(id); }

function readProfile() {
  const email = localStorage.getItem('pengeplan_email') || '';
  const p = JSON.parse(localStorage.getItem('pengeplan_profile') || '{}');
  return { email, ...p };
}

function writeProfile(p) {
  const { email, ...rest } = p;
  localStorage.setItem('pengeplan_profile', JSON.stringify(rest));
}

function initials(name) {
  if (!name) return 'PP';
  return name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();
}

function hydrate() {
  const p = readProfile();
  qs('pfEmail').value = p.email || '';
  qs('pfName').value = p.name || '';
  qs('pfMunicipality').value = p.kommune || '';
  qs('pfHousehold').value = p.husholdning || '';
  qs('pfNotifyEmail').checked = !!p.notifyEmail;
  qs('pfNotifySms').checked = !!p.notifySms;
  qs('pfWeeklyTips').checked = !!p.weeklyTips;
  qs('pfBillsReminder').checked = !!p.billsReminder;
  qs('pfBeta').checked = !!p.beta;
  qs('sidebarEmail').textContent = p.email || 'din@epost.no';
  qs('sidebarName').textContent = p.name || 'Bruker';
  qs('avatarPreview').textContent = initials(p.name);
}

function save() {
  const next = {
    name: qs('pfName').value.trim(),
    kommune: qs('pfMunicipality').value.trim(),
    husholdning: qs('pfHousehold').value.trim(),
    notifyEmail: qs('pfNotifyEmail').checked,
    notifySms: qs('pfNotifySms').checked,
    weeklyTips: qs('pfWeeklyTips').checked,
    billsReminder: qs('pfBillsReminder').checked,
    beta: qs('pfBeta').checked,
  };
  writeProfile(next);
  alert('Profil lagret');
  hydrate();
}

function exportData() {
  const profile = JSON.parse(localStorage.getItem('pengeplan_profile') || '{}');
  const docs = JSON.parse(localStorage.getItem('pengeplan_documents') || '[]');
  const blob = new Blob([JSON.stringify({ profile, documents: docs }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'pengeplan-eksport.json'; a.click();
  URL.revokeObjectURL(url);
}

function deleteAccount() {
  if (!confirm('Skriv SLETT for å bekrefte (skriv nøyaktig):')) return;
  const phrase = prompt('Skriv SLETT for å bekrefte sletting:');
  if (phrase !== 'SLETT') return;
  localStorage.clear();
  location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  hydrate();
  qs('saveProfilePage').addEventListener('click', save);
  qs('cancelProfilePage').addEventListener('click', () => history.back());
  qs('exportData').addEventListener('click', exportData);
  qs('deleteAccount').addEventListener('click', deleteAccount);
  const logout = document.getElementById('logoutFromProfile');
  if (logout) logout.addEventListener('click', (e) => { e.preventDefault(); localStorage.removeItem('pengeplan_logged_in'); localStorage.removeItem('pengeplan_email'); location.href='index.html'; });

  const avatarInput = qs('avatarInput');
  const uploadAvatar = qs('uploadAvatar');
  const removeAvatar = qs('removeAvatar');
  uploadAvatar.addEventListener('click', () => avatarInput.click());
  removeAvatar.addEventListener('click', () => { localStorage.removeItem('pengeplan_avatar'); qs('avatarPreview').style.backgroundImage=''; alert('Avatar fjernet'); });
  avatarInput.addEventListener('change', async () => {
    const file = avatarInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Kun bilder tillatt'); return; }
    const max = 512;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const side = Math.min(img.width, img.height);
      canvas.width = canvas.height = Math.min(max, side);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const sx = (img.width - side) / 2;
      const sy = (img.height - side) / 2;
      ctx.drawImage(img, sx, sy, side, side, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/webp', 0.9);
      localStorage.setItem('pengeplan_avatar', dataUrl);
      qs('avatarPreview').style.backgroundImage = `url(${dataUrl})`;
      qs('avatarPreview').textContent = '';
    };
    img.src = URL.createObjectURL(file);
  });
});


