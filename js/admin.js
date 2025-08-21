import { db } from './db.js';

async function getUsers(){
  try { 
    return await db.getAllUsers(); 
  } catch (err) { 
    console.error('Error getting users:', err);
    return []; 
  }
}

async function setUsers(list){ 
  // This function is kept for compatibility but should be replaced with individual CRUD operations
  console.warn('setUsers is deprecated, use individual CRUD operations instead');
  return list;
}

function el(id){ return document.getElementById(id); }

async function renderUsers(filter=''){
  const tbody = el('usersTbody');
  const allUsers = await getUsers();
  const users = allUsers.filter(u => !filter || (u.full_name?.toLowerCase().includes(filter) || u.email?.toLowerCase().includes(filter)));
  tbody.innerHTML = '';
  
  // Update stats
  el('totalUsers').textContent = allUsers.length;
  el('activeUsers').textContent = allUsers.filter(u => u.status !== 'inactive' && u.status !== 'suspended').length;
  el('adminUsers').textContent = allUsers.filter(u => u.role === 'admin').length;
  
  users.forEach((u, idx) => {
    const tr = document.createElement('tr');
    const fullName = u.full_name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Ukjent';
    const statusClass = u.status === 'active' ? 'status-active' : u.status === 'inactive' ? 'status-inactive' : 'status-suspended';
    const statusText = u.status === 'active' ? 'Aktiv' : u.status === 'inactive' ? 'Inaktiv' : 'Suspender';
    
    tr.innerHTML = `
      <td>
        <div class="user-info">
          <div class="user-avatar">${fullName.charAt(0).toUpperCase()}</div>
          <div>
            <div class="user-name">${fullName}</div>
            <div class="user-email">${u.email || ''}</div>
          </div>
        </div>
      </td>
      <td>
        <div class="contact-info">
          <div>${u.email || ''}</div>
          <div class="contact-phone">${u.phone || ''}</div>
        </div>
      </td>
      <td><span class="role-badge role-${u.role || 'user'}">${u.role || 'user'}</span></td>
      <td><span class="plan-badge plan-${u.plan || 'free'}">${u.plan || 'free'}</span></td>
      <td><span class="status-badge ${statusClass}">${statusText}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-sm" data-edit="${u.id}" title="Rediger">✏️</button>
          <button class="btn-sm" data-view="${u.id}" title="Vis detaljer">👁️</button>
          <button class="btn-sm" data-del="${u.id}" title="Slett" style="background:#fee2e2">🗑️</button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });
}

function openUserModal(user=null, index=null){
  el('userModal').classList.remove('hidden');
  el('userModal').setAttribute('aria-hidden','false');
  el('userModalTitle').textContent = index===null ? 'Ny bruker' : 'Rediger bruker';
  el('saveUser').dataset.index = index===null ? '' : String(index);
  
  if (user) {
    // Parse full_name into first and last name
    const nameParts = user.full_name?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Basic info
    el('userFirstName').value = firstName;
    el('userLastName').value = lastName;
    el('userEmail').value = user.email || '';
    el('userPhone').value = user.phone || '';
    
    // Address
    el('userStreet').value = user.address?.street || '';
    el('userPostalCode').value = user.address?.postal_code || '';
    el('userCity').value = user.address?.city || '';
    el('userMunicipality').value = user.address?.municipality || '';
    
    // Account
    el('userRole').value = user.role || 'user';
    el('userPlan').value = user.plan || 'free';
    el('userStatus').value = user.status || 'active';
    el('userHousehold').value = user.household?.size || '';
    
    // Notifications & consents
    el('userEmailNotif').checked = user.notifications?.email !== false;
    el('userSmsNotif').checked = !!user.notifications?.sms;
    el('userWeeklyTips').checked = user.notifications?.weekly_tips !== false;
    el('userAnalytics').checked = !!user.consents?.analytics;
    el('userMarketing').checked = !!user.consents?.marketing;
    el('userBeta').checked = !!user.beta;
  } else {
    // Clear all fields for new user
    el('userFirstName').value = '';
    el('userLastName').value = '';
    el('userEmail').value = '';
    el('userPhone').value = '';
    el('userStreet').value = '';
    el('userPostalCode').value = '';
    el('userCity').value = '';
    el('userMunicipality').value = '';
    el('userRole').value = 'user';
    el('userPlan').value = 'free';
    el('userStatus').value = 'active';
    el('userHousehold').value = '';
    el('userEmailNotif').checked = true;
    el('userSmsNotif').checked = false;
    el('userWeeklyTips').checked = true;
    el('userAnalytics').checked = false;
    el('userMarketing').checked = false;
    el('userBeta').checked = false;
  }
}
function closeUserModal(){
  el('userModal').classList.add('hidden');
  el('userModal').setAttribute('aria-hidden','true');
}

// Tab switching functions
function switchAdminTab(tabName) {
  // Update sidebar navigation
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelector(`[data-admin="${tabName}"]`).classList.add('active');
  
  // Update main content tabs
  document.querySelectorAll('.admin-tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
  
  const tabBtn = document.querySelector(`[data-target="${tabName}View"]`);
  const tabView = document.getElementById(`${tabName}View`);
  
  if (tabBtn) tabBtn.classList.add('active');
  if (tabView) tabView.classList.add('active');
}

// Tab button events
document.querySelectorAll('.admin-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    const tabName = target.replace('View', '');
    switchAdminTab(tabName);
  });
});

el('addUserBtn').addEventListener('click', ()=> openUserModal());
el('closeUserModal').addEventListener('click', closeUserModal);
el('cancelUser').addEventListener('click', closeUserModal);

el('saveUser').addEventListener('click', async () => {
  const userId = el('saveUser').dataset.index;
  const user = {
    full_name: `${el('userFirstName').value.trim()} ${el('userLastName').value.trim()}`.trim(),
    email: el('userEmail').value.trim(),
    phone: el('userPhone').value.trim(),
    address: {
      street: el('userStreet').value.trim(),
      postal_code: el('userPostalCode').value.trim(),
      city: el('userCity').value.trim(),
      municipality: el('userMunicipality').value.trim()
    },
    role: el('userRole').value,
    plan: el('userPlan').value,
    status: el('userStatus').value,
    household: {
      size: parseInt(el('userHousehold').value) || 1,
      note: ''
    },
    notifications: {
      email: el('userEmailNotif').checked,
      sms: el('userSmsNotif').checked,
      weekly_tips: el('userWeeklyTips').checked,
      bill_reminder_days: 3
    },
    consents: {
      privacy: true,
      analytics: el('userAnalytics').checked,
      marketing: el('userMarketing').checked,
      accepted_at: new Date().toISOString()
    },
    beta: el('userBeta').checked,
  };
  
  if (!user.full_name || !user.email) { 
    alert('❌ Navn og e‑post er påkrevd.'); 
    return; 
  }
  
  try {
    if (userId) {
      await db.updateUser(userId, user);
      alert('✅ Bruker oppdatert!');
    } else {
      await db.createUser(user);
      alert('✅ Ny bruker opprettet!');
    }
    closeUserModal(); 
    await renderUsers(el('searchUsers').value.trim().toLowerCase());
  } catch (err) {
    console.error('Error saving user:', err);
    alert('❌ Feil ved lagring av bruker: ' + err.message);
  }
});

el('usersTbody').addEventListener('click', async (e)=>{
  const edit = e.target.getAttribute('data-edit');
  const del = e.target.getAttribute('data-del');
  const view = e.target.getAttribute('data-view');
  
  if (edit !== null) {
    const users = await getUsers();
    const user = users.find(u => u.id === edit);
    if (user) {
      openUserModal(user, edit);
    }
  } else if (del !== null) {
    const users = await getUsers();
    const user = users.find(u => u.id === del);
    const userName = user?.full_name || user?.firstName || 'brukeren';
    if (confirm(`Er du sikker på at du vil slette ${userName}?`)) { 
      try {
        await db.deleteUser(del);
        await renderUsers(el('searchUsers').value.trim().toLowerCase()); 
        alert('✅ Bruker slettet!');
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('❌ Feil ved sletting av bruker: ' + err.message);
      }
    }
  } else if (view !== null) {
    const users = await getUsers();
    const user = users.find(u => u.id === view);
    if (user) {
      showUserDetails(user);
    }
  }
});

el('searchUsers').addEventListener('input', (e)=>{
  renderUsers(e.target.value.trim().toLowerCase());
});

// Export functionality
el('exportUsers').addEventListener('click', async () => {
  const users = await getUsers();
  const csv = [
    ['Navn', 'E-post', 'Telefon', 'Rolle', 'Plan', 'Status', 'Adresse', 'Husholdning'],
    ...users.map(u => [
      u.full_name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || '',
      u.email || '',
      u.phone || '',
      u.role || 'user',
      u.plan || 'free',
      u.status || 'active',
      `${u.address?.street || ''}, ${u.address?.postal_code || ''} ${u.address?.city || ''}`.trim(),
      u.household?.size || ''
    ])
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pengeplan-brukere.csv';
  a.click();
  URL.revokeObjectURL(url);
});

// User details modal
function showUserDetails(user) {
  const fullName = user.full_name || 'Ukjent';
  const address = `${user.address?.street || ''}, ${user.address?.postal_code || ''} ${user.address?.city || ''}`.trim();
  
  const details = `
Brukerdetaljer: ${fullName}

📧 E-post: ${user.email || 'Ikke satt'}
📱 Telefon: ${user.phone || 'Ikke satt'}
👤 Rolle: ${user.role || 'user'}
💳 Plan: ${user.plan || 'free'}
✅ Status: ${user.status || 'active'}
🏠 Adresse: ${address || 'Ikke satt'}
👨‍👩‍👧‍👦 Husholdning: ${user.household?.size || 'Ikke satt'}

Varsler:
• E-post: ${user.notifications?.email ? '✅' : '❌'}
• SMS: ${user.notifications?.sms ? '✅' : '❌'}
• Ukentlige tips: ${user.notifications?.weekly_tips ? '✅' : '❌'}

Samtykker:
• Analytics: ${user.consents?.analytics ? '✅' : '❌'}
• Markedsføring: ${user.consents?.marketing ? '✅' : '❌'}
• Beta-tilgang: ${user.beta ? '✅' : '❌'}

📅 Opprettet: ${new Date(user.created_at).toLocaleDateString('nb-NO')}
🔄 Sist oppdatert: ${new Date(user.updated_at).toLocaleDateString('nb-NO')}
  `;
  
  alert(details);
}

// Settings functionality
el('saveSettings').addEventListener('click', () => {
  const settings = {
    appName: el('appName').value,
    defaultPlan: el('defaultPlan').value
  };
  localStorage.setItem('pengeplan_settings', JSON.stringify(settings));
  alert('✅ Innstillinger lagret!');
});

// API functionality
el('saveApis').addEventListener('click', () => {
  const apis = {
    managedAiUrl: el('managedAiUrl').value,
    managedAiToken: el('managedAiToken').value
  };
  localStorage.setItem('pengeplan_apis', JSON.stringify(apis));
  alert('✅ API-innstillinger lagret!');
});

// Load initial data
async function loadInitialData() {
  // Add demo users if none exist
  const existingUsers = await getUsers();
  if (existingUsers.length === 0) {
    const demoUsers = [
      {
        id: 'demo-1',
        full_name: 'Cato Hansen',
        email: 'cato@catohansen.no',
        phone: '123 45 678',
        role: 'admin',
        plan: 'pro',
        status: 'active',
        address: {
          street: 'Hovedgata 1',
          postal_code: '0001',
          city: 'Oslo',
          municipality: 'Oslo'
        },
        household: { size: 2 },
        notifications: { email: true, sms: false, weekly_tips: true },
        consents: { analytics: true, marketing: false },
        beta: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo-2',
        full_name: 'Ola Nordmann',
        email: 'ola@example.no',
        phone: '987 65 432',
        role: 'user',
        plan: 'free',
        status: 'active',
        address: {
          street: 'Sideveien 5',
          postal_code: '5000',
          city: 'Bergen',
          municipality: 'Bergen'
        },
        household: { size: 1 },
        notifications: { email: true, sms: true, weekly_tips: false },
        consents: { analytics: false, marketing: true },
        beta: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    for (const user of demoUsers) {
      try {
        await db.createUser(user);
      } catch (e) {
        console.error('Error creating demo user:', e);
      }
    }
  }
  
  await renderUsers();
  
  // Load settings
  try {
    const settings = JSON.parse(localStorage.getItem('pengeplan_settings') || '{}');
    el('appName').value = settings.appName || 'Pengeplan';
    el('defaultPlan').value = settings.defaultPlan || 'free';
  } catch (e) {
    console.error('Error loading settings:', e);
  }
  
  // Load API settings
  try {
    const apis = JSON.parse(localStorage.getItem('pengeplan_apis') || '{}');
    el('managedAiUrl').value = apis.managedAiUrl || '';
    el('managedAiToken').value = apis.managedAiToken || '';
  } catch (e) {
    console.error('Error loading API settings:', e);
  }
}

// Modal functionality
function closeUserModal() {
  el('userModal').classList.add('hidden');
  el('userModal').setAttribute('aria-hidden', 'true');
}

// Event listeners for modal
el('addUserBtn').addEventListener('click', () => openUserModal());
el('closeUserModal').addEventListener('click', closeUserModal);
el('cancelUser').addEventListener('click', closeUserModal);

// Close modal when clicking outside
el('userModal').addEventListener('click', (e) => {
  if (e.target === el('userModal')) {
    closeUserModal();
  }
});

// Tab switching functionality
function switchAdminTab(tabName) {
  // Update sidebar navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-admin="${tabName}"]`).classList.add('active');
  
  // Update tab buttons
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Update views
  document.querySelectorAll('.admin-view').forEach(view => {
    view.classList.remove('active');
  });
  
  // Show selected view
  const targetView = document.getElementById(tabName + 'View');
  if (targetView) {
    targetView.classList.add('active');
  }
  
  // Update tab button
  const targetTab = document.querySelector(`[data-target="${tabName}View"]`);
  if (targetTab) {
    targetTab.classList.add('active');
  }
}

// Tab button event listeners
document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-target');
    if (target) {
      const tabName = target.replace('View', '');
      switchAdminTab(tabName);
    }
  });
});

// Search functionality
el('searchUsers').addEventListener('input', (e) => {
  renderUsers(e.target.value);
});

// User table event listeners
el('usersTbody').addEventListener('click', async (e) => {
  const target = e.target.closest('button');
  if (!target) return;
  
  const userId = target.dataset.edit || target.dataset.view || target.dataset.del;
  if (!userId) return;
  
  const users = await getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;
  
  if (target.dataset.edit) {
    openUserModal(user, userId);
  } else if (target.dataset.view) {
    showUserDetails(user);
  } else if (target.dataset.del) {
    if (confirm('Er du sikker på at du vil slette denne brukeren?')) {
      try {
        await db.deleteUser(userId);
        await renderUsers();
        alert('✅ Bruker slettet!');
      } catch (error) {
        alert('❌ Feil ved sletting: ' + error.message);
      }
    }
  }
});

// Save user functionality
el('saveUser').addEventListener('click', async () => {
  const userId = el('saveUser').dataset.index;
  
  const userData = {
    full_name: `${el('userFirstName').value} ${el('userLastName').value}`.trim(),
    email: el('userEmail').value,
    phone: el('userPhone').value,
    address: {
      street: el('userStreet').value,
      postal_code: el('userPostalCode').value,
      city: el('userCity').value,
      municipality: el('userMunicipality').value
    },
    role: el('userRole').value,
    plan: el('userPlan').value,
    status: el('userStatus').value,
    household: {
      size: parseInt(el('userHousehold').value) || 1
    },
    notifications: {
      email: el('userEmailNotif').checked,
      sms: el('userSmsNotif').checked,
      weekly_tips: el('userWeeklyTips').checked
    },
    consents: {
      analytics: el('userAnalytics').checked,
      marketing: el('userMarketing').checked
    },
    beta: el('userBeta').checked,
    updated_at: new Date().toISOString()
  };
  
  try {
    if (userId) {
      // Update existing user
      await db.updateUser(userId, userData);
      alert('✅ Bruker oppdatert!');
    } else {
      // Create new user
      userData.created_at = new Date().toISOString();
      await db.createUser(userData);
      alert('✅ Bruker opprettet!');
    }
    
    closeUserModal();
    await renderUsers();
  } catch (error) {
    alert('❌ Feil ved lagring: ' + error.message);
  }
});

// Initialize
loadInitialData();


