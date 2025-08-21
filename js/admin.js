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

// Pagination state
let currentPage = 1;
const usersPerPage = 10;
let filteredUsers = [];

async function renderUsers(filter=''){
  const tbody = el('usersTbody');
  const allUsers = await getUsers();
  filteredUsers = allUsers.filter(u => !filter || (u.full_name?.toLowerCase().includes(filter) || u.email?.toLowerCase().includes(filter)));
  
  // Reset to first page when filtering
  if (filter !== '') {
    currentPage = 1;
  }
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const usersToShow = filteredUsers.slice(startIndex, endIndex);
  
  tbody.innerHTML = '';
  
  // Update stats
  el('totalUsers').textContent = allUsers.length;
  el('activeUsers').textContent = allUsers.filter(u => u.status !== 'inactive' && u.status !== 'suspended').length;
  el('adminUsers').textContent = allUsers.filter(u => u.role === 'admin').length;
  
  usersToShow.forEach((u, idx) => {
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
  
  // Render pagination
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const paginationContainer = el('paginationContainer');
  if (!paginationContainer) return;
  
  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }
  
  let paginationHTML = '<div class="pagination">';
  
  // Previous button
  paginationHTML += `
    <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
            ${currentPage === 1 ? 'disabled' : ''} 
            onclick="changePage(${currentPage - 1})">
      ← Forrige
    </button>
  `;
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      paginationHTML += `
        <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                onclick="changePage(${i})">
          ${i}
        </button>
      `;
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      paginationHTML += '<span class="pagination-ellipsis">...</span>';
    }
  }
  
  // Next button
  paginationHTML += `
    <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
            ${currentPage === totalPages ? 'disabled' : ''} 
            onclick="changePage(${currentPage + 1})">
      Neste →
    </button>
  `;
  
  paginationHTML += '</div>';
  paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
  if (page < 1 || page > Math.ceil(filteredUsers.length / usersPerPage)) return;
  currentPage = page;
  renderUsers();
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
  try {
    showLoading('exportUsers');
    
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
    
    showToast(`✅ Eksporterte ${users.length} brukere`, 'success');
  } catch (error) {
    showToast('❌ Feil ved eksport', 'error');
  } finally {
    hideLoading('exportUsers');
  }
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
  showLoading('saveSettings');
  
  const settings = {
    appName: el('appName').value,
    defaultPlan: el('defaultPlan').value
  };
  
  try {
    localStorage.setItem('pengeplan_settings', JSON.stringify(settings));
    showToast('✅ Innstillinger lagret!', 'success');
  } catch (error) {
    showToast('❌ Feil ved lagring av innstillinger', 'error');
  } finally {
    hideLoading('saveSettings');
  }
});

// API functionality
el('saveApis').addEventListener('click', () => {
  showLoading('saveApis');
  
  const apis = {
    managedAiUrl: el('managedAiUrl').value,
    managedAiToken: el('managedAiToken').value
  };
  
  try {
    localStorage.setItem('pengeplan_apis', JSON.stringify(apis));
    showToast('✅ API-innstillinger lagret!', 'success');
  } catch (error) {
    showToast('❌ Feil ved lagring av API-innstillinger', 'error');
  } finally {
    hideLoading('saveApis');
  }
});

// Load initial data
async function loadInitialData() {
  try {
    showLoading();
    
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
    
    showToast('✅ Admin panel lastet', 'success', 2000);
  } catch (error) {
    console.error('Error loading initial data:', error);
    showToast('❌ Feil ved lasting av data', 'error', 5000);
  } finally {
    hideLoading();
  }
}

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());
  
  document.body.appendChild(toast);
  
  // Auto remove
  setTimeout(() => {
    toast.remove();
  }, duration);
  
  // Manual close on click
  toast.addEventListener('click', () => toast.remove());
}

// Loading state management
function showLoading(elementId = null) {
  if (elementId) {
    const element = el(elementId);
    if (element) {
      element.disabled = true;
      element.innerHTML = '<span class="loading"></span> Laster...';
    }
  } else {
    document.body.classList.add('loading');
  }
}

function hideLoading(elementId = null) {
  if (elementId) {
    const element = el(elementId);
    if (element) {
      element.disabled = false;
      element.innerHTML = element.dataset.originalText || 'Lagre';
    }
  } else {
    document.body.classList.remove('loading');
  }
}

// Modal functionality
function openUserModal(user = null, userId = null) {
  const modal = el('userModal');
  modal.classList.remove('hidden');
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  
  // Reset form
  document.getElementById('profileForm').reset();
  
  // Set title
  el('userModalTitle').textContent = user ? 'Rediger bruker' : 'Ny bruker';
  
  // Store original button text
  const saveBtn = el('saveUser');
  saveBtn.dataset.originalText = saveBtn.innerHTML;
  
  if (user) {
    // Populate form with user data
    populateUserForm(user);
    saveBtn.dataset.index = userId;
  } else {
    saveBtn.dataset.index = '';
  }
}

function closeUserModal() {
  const modal = el('userModal');
  modal.classList.remove('show');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  
  // Reset form
  document.getElementById('profileForm').reset();
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

// Confirmation dialog
function showConfirmDialog(message, onConfirm, onCancel = null) {
  const dialog = document.createElement('div');
  dialog.className = 'confirm-dialog-overlay';
  dialog.innerHTML = `
    <div class="confirm-dialog">
      <h3>Bekreft handling</h3>
      <p>${message}</p>
      <div class="confirm-dialog-actions">
        <button class="btn-secondary" id="confirmCancel">Avbryt</button>
        <button class="btn" id="confirmOk">Bekreft</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // Focus trap
  const focusableElements = dialog.querySelectorAll('button');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  firstElement.focus();
  
  // Event listeners
  dialog.querySelector('#confirmOk').addEventListener('click', () => {
    dialog.remove();
    onConfirm();
  });
  
  dialog.querySelector('#confirmCancel').addEventListener('click', () => {
    dialog.remove();
    if (onCancel) onCancel();
  });
  
  // Close on escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      dialog.remove();
      document.removeEventListener('keydown', handleEscape);
      if (onCancel) onCancel();
    }
  };
  
  document.addEventListener('keydown', handleEscape);
  
  // Close on outside click
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.remove();
      document.removeEventListener('keydown', handleEscape);
      if (onCancel) onCancel();
    }
  });
}

// User table event listeners with confirmation
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
    const userName = user.full_name || user.email || 'denne brukeren';
    showConfirmDialog(
      `Er du sikker på at du vil slette ${userName}? Dette kan ikke angres.`,
      async () => {
        try {
          showLoading();
          await db.deleteUser(userId);
          await renderUsers();
          showToast('✅ Bruker slettet!', 'success');
        } catch (error) {
          showToast(`❌ Feil ved sletting: ${error.message}`, 'error', 5000);
        } finally {
          hideLoading();
        }
      }
    );
  }
});

// Form validation
function validateUserForm() {
  const errors = [];
  
  // Required fields
  const firstName = el('userFirstName').value.trim();
  const lastName = el('userLastName').value.trim();
  const email = el('userEmail').value.trim();
  
  if (!firstName) {
    errors.push('Fornavn er påkrevd');
    highlightError('userFirstName');
  } else {
    clearError('userFirstName');
  }
  
  if (!lastName) {
    errors.push('Etternavn er påkrevd');
    highlightError('userLastName');
  } else {
    clearError('userLastName');
  }
  
  if (!email) {
    errors.push('E-post er påkrevd');
    highlightError('userEmail');
  } else if (!isValidEmail(email)) {
    errors.push('Ugyldig e-postadresse');
    highlightError('userEmail');
  } else {
    clearError('userEmail');
  }
  
  // Postal code validation
  const postalCode = el('userPostalCode').value.trim();
  if (postalCode && !/^\d{4}$/.test(postalCode)) {
    errors.push('Postnummer må være 4 sifre');
    highlightError('userPostalCode');
  } else {
    clearError('userPostalCode');
  }
  
  return errors;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function highlightError(fieldId) {
  const field = el(fieldId);
  if (field) {
    field.classList.add('error');
    field.style.borderColor = '#ef4444';
  }
}

function clearError(fieldId) {
  const field = el(fieldId);
  if (field) {
    field.classList.remove('error');
    field.style.borderColor = '';
  }
}

// Save user functionality with validation
el('saveUser').addEventListener('click', async () => {
  // Validate form
  const errors = validateUserForm();
  if (errors.length > 0) {
    showToast(errors.join('\n'), 'error', 5000);
    return;
  }
  
  const userId = el('saveUser').dataset.index;
  
  // Show loading state
  showLoading('saveUser');
  
  const userData = {
    full_name: `${el('userFirstName').value.trim()} ${el('userLastName').value.trim()}`,
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
      showToast('✅ Bruker oppdatert!', 'success');
    } else {
      // Create new user
      userData.created_at = new Date().toISOString();
      await db.createUser(userData);
      showToast('✅ Bruker opprettet!', 'success');
    }
    
    closeUserModal();
    await renderUsers();
  } catch (error) {
    showToast(`❌ Feil ved lagring: ${error.message}`, 'error', 5000);
  } finally {
    hideLoading('saveUser');
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  // Ctrl+N for new user
  if (e.ctrlKey && e.key === 'n') {
    e.preventDefault();
    openUserModal();
  }
  
  // Escape to close modals
  if (e.key === 'Escape') {
    const modal = el('userModal');
    if (modal && !modal.classList.contains('hidden')) {
      closeUserModal();
    }
    
    const confirmDialog = document.querySelector('.confirm-dialog-overlay');
    if (confirmDialog) {
      confirmDialog.remove();
    }
  }
  
  // Tab navigation in modals
  if (e.key === 'Tab') {
    const modal = el('userModal');
    if (modal && !modal.classList.contains('hidden')) {
      const focusableElements = modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
});

// Accessibility improvements
function addAccessibilityFeatures() {
  // Add ARIA labels to action buttons
  document.querySelectorAll('[data-edit]').forEach(btn => {
    btn.setAttribute('aria-label', 'Rediger bruker');
    btn.setAttribute('title', 'Rediger bruker');
  });
  
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.setAttribute('aria-label', 'Vis brukerdetaljer');
    btn.setAttribute('title', 'Vis brukerdetaljer');
  });
  
  document.querySelectorAll('[data-del]').forEach(btn => {
    btn.setAttribute('aria-label', 'Slett bruker');
    btn.setAttribute('title', 'Slett bruker');
  });
  
  // Add role attributes
  const table = document.querySelector('.admin-table');
  if (table) {
    table.setAttribute('role', 'table');
    table.setAttribute('aria-label', 'Brukerliste');
  }
  
  // Add live regions for dynamic content
  const statsContainer = document.querySelector('.admin-stats');
  if (statsContainer) {
    statsContainer.setAttribute('aria-live', 'polite');
    statsContainer.setAttribute('aria-label', 'Brukerstatistikk');
  }
}

// Tab switching functionality
function switchAdminTab(tabName) {
  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  const sidebarItem = document.querySelector(`[data-admin="${tabName}"]`);
  if (sidebarItem) {
    sidebarItem.classList.add('active');
  }
  
  // Update main content
  document.querySelectorAll('.admin-view').forEach(view => {
    view.classList.remove('active');
  });
  const targetView = document.getElementById(`${tabName}View`);
  if (targetView) {
    targetView.classList.add('active');
  }
  
  // Update tab buttons
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  const targetTab = document.querySelector(`[data-target="${tabName}View"]`);
  if (targetTab) {
    targetTab.classList.add('active');
  }
  
  // Show success toast for navigation
  const tabNames = {
    'users': 'Brukere',
    'settings': 'Innstillinger',
    'apis': 'API & Integrasjoner'
  };
  showToast(`📋 Viser ${tabNames[tabName] || tabName}`, 'info', 1500);
}

// Mobile menu functionality
function setupMobileMenu() {
  const menuBtn = el('menuBtn');
  const sidebar = el('sidebar');
  const overlay = el('overlay');
  
  if (menuBtn && sidebar && overlay) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
    
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    });
  }
}

// Tab button event listeners
function setupTabButtons() {
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      if (target) {
        const tabName = target.replace('View', '');
        switchAdminTab(tabName);
      }
    });
  });
}

// Modal event listeners
function setupModalListeners() {
  // Add user button
  el('addUserBtn')?.addEventListener('click', () => {
    openUserModal();
  });
  
  // Close modal button
  el('closeUserModal')?.addEventListener('click', () => {
    closeUserModal();
  });
  
  // Cancel button
  el('cancelUser')?.addEventListener('click', () => {
    closeUserModal();
  });
  
  // Close modal on outside click
  el('userModal')?.addEventListener('click', (e) => {
    if (e.target === el('userModal')) {
      closeUserModal();
    }
  });
  
  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = el('userModal');
      if (modal && !modal.classList.contains('hidden')) {
        closeUserModal();
      }
    }
  });
}

// Initialize
loadInitialData();
addAccessibilityFeatures();
setupMobileMenu();
setupTabButtons();
setupModalListeners();


