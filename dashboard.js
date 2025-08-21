// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    // Initialize with dashboard page active
    showPage('dashboard');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding page
            const pageName = this.getAttribute('data-page');
            showPage(pageName);
        });
    });

    function showPage(pageName) {
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        const targetPage = document.getElementById(pageName + '-page');
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }

    // Tab functionality for bills page
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // List tab functionality
    const listTabs = document.querySelectorAll('.list-tab');
    listTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            listTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Task tab functionality
    const taskTabs = document.querySelectorAll('.task-tab');
    taskTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            taskTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Strategy card functionality
    const strategyCards = document.querySelectorAll('.strategy-card');
    strategyCards.forEach(card => {
        card.addEventListener('click', function() {
            strategyCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Add button functionality
    const addButtons = document.querySelectorAll('.add-btn');
    addButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const buttonText = this.querySelector('span:last-child').textContent;
            showNotification(`"${buttonText}" funksjonalitet kommer snart!`, 'info');
        });
    });

    // Action button functionality
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const buttonText = this.querySelector('span:last-child').textContent;
            showNotification(`"${buttonText}" funksjonalitet kommer snart!`, 'info');
        });
    });

    // Tool button functionality
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const buttonText = this.querySelector('span:last-child').textContent;
            showNotification(`"${buttonText}" funksjonalitet kommer snart!`, 'info');
        });
    });

    // Support button functionality
    const supportButtons = document.querySelectorAll('.support-btn');
    supportButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Omdirigerer til søknadsside...', 'info');
        });
    });

    // Secondary button functionality
    const secondaryButtons = document.querySelectorAll('.secondary-btn');
    secondaryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const buttonText = this.querySelector('span:last-child').textContent;
            showNotification(`"${buttonText}" funksjonalitet kommer snart!`, 'info');
        });
    });
    
    // Logout functionality
    const logoutLink = document.querySelector('.logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Er du sikker på at du vil logge ut?')) {
                // Fjern enkel demo-sesjon
                try {
                    localStorage.removeItem('pengeplan_logged_in');
                    localStorage.removeItem('pengeplan_email');
                } catch (err) {
                    console.warn('Kunne ikke tømme localStorage', err);
                }
                window.location.href = 'index.html';
            }
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const supportCards = document.querySelectorAll('.support-card');
            
            supportCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Filter dropdown functionality
    const filterDropdown = document.querySelector('.filter-dropdown');
    if (filterDropdown) {
        filterDropdown.addEventListener('click', function() {
            showNotification('Filterfunksjonalitet kommer snart!', 'info');
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Profile modal logic
    const profileBtn = document.getElementById('openProfile');
    const profileModal = document.getElementById('profileModal');
    const closeProfile = document.getElementById('closeProfile');
    const cancelProfile = document.getElementById('cancelProfile');
    const saveProfile = document.getElementById('saveProfile');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileMunicipality = document.getElementById('profileMunicipality');
    const profileHousehold = document.getElementById('profileHousehold');
    const notifyEmail = document.getElementById('notifyEmail');
    const notifySms = document.getElementById('notifySms');
    const betaAccess = document.getElementById('betaAccess');

    function loadProfile() {
        const email = localStorage.getItem('pengeplan_email') || 'din@epost.no';
        const profile = JSON.parse(localStorage.getItem('pengeplan_profile') || '{}');
        if (profileEmail) profileEmail.value = email;
        if (profileName) profileName.value = profile.name || '';
        if (profileMunicipality) profileMunicipality.value = profile.kommune || '';
        if (profileHousehold) profileHousehold.value = profile.husholdning || '';
        if (notifyEmail) notifyEmail.checked = !!profile.notifyEmail;
        if (notifySms) notifySms.checked = !!profile.notifySms;
        if (betaAccess) betaAccess.checked = !!profile.beta;
    }

    function saveProfileToStorage() {
        const data = {
            name: profileName?.value?.trim() || '',
            kommune: profileMunicipality?.value?.trim() || '',
            husholdning: profileHousehold?.value?.trim() || '',
            notifyEmail: !!notifyEmail?.checked,
            notifySms: !!notifySms?.checked,
            beta: !!betaAccess?.checked,
        };
        localStorage.setItem('pengeplan_profile', JSON.stringify(data));
        showNotification('Profil lagret', 'success');
        updateDashboardTitle();
    }

    function toggleProfile(open) {
        if (!profileModal) return;
        if (open) {
            loadProfile();
            profileModal.classList.remove('hidden');
            profileModal.setAttribute('aria-hidden', 'false');
        } else {
            profileModal.classList.add('hidden');
            profileModal.setAttribute('aria-hidden', 'true');
        }
    }

    if (profileBtn && profileModal) {
        profileBtn.addEventListener('click', () => toggleProfile(true));
    }
    if (closeProfile) closeProfile.addEventListener('click', () => toggleProfile(false));
    if (cancelProfile) cancelProfile.addEventListener('click', () => toggleProfile(false));
    if (saveProfile) saveProfile.addEventListener('click', () => { saveProfileToStorage(); toggleProfile(false); });

    if (profileModal) {
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) toggleProfile(false);
        });
    }

    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                z-index: 1000;
                max-width: 300px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.info {
                background: #3b82f6;
            }
            
            .notification.success {
                background: #10b981;
            }
            
            .notification.error {
                background: #ef4444;
            }
            
            .notification.warning {
                background: #f59e0b;
            }
        `;
        document.head.appendChild(style);
    }

    // Mobile menu handled by CSS grid + overlay in responsive.css

    // Add some sample data updates for demonstration
    function updateSampleData() {
        // Update dashboard summary cards with some sample data
        const cardValues = document.querySelectorAll('.card-value');
        
        // Simulate loading data
        setTimeout(() => {
            // Update some values to show the app is working
            if (cardValues.length > 0) {
                // This would normally come from a backend
                console.log('Dashboard data loaded successfully');
            }
        }, 1000);
    }

    updateSampleData();

    // Initial title update
    updateDashboardTitle();

    // AI advisor setup
    setupAiAdvisor();

    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key to close mobile menu
        if (e.key === 'Escape') {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    });

    console.log('Pengeplan Dashboard initialized successfully!');
});

// Responsive helpers and mobile drawer
function setVhVar() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setVhVar();
window.addEventListener('resize', () => { requestAnimationFrame(setVhVar); });

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuBtn = document.getElementById('menuBtn');

function openSidebar() { if(sidebar && overlay){ sidebar.classList.add('open'); overlay.classList.add('show'); document.body.style.overflow='hidden'; } }
function closeSidebar() { if(sidebar && overlay){ sidebar.classList.remove('open'); overlay.classList.remove('show'); document.body.style.overflow=''; } }
menuBtn?.addEventListener('click', openSidebar);
overlay?.addEventListener('click', closeSidebar);
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeSidebar(); });

// Make tables responsive (add data-labels)
document.querySelectorAll('.table').forEach(table => {
  const headers = [...table.querySelectorAll('thead th')].map(th => th.textContent?.trim() ?? '');
  table.querySelectorAll('tbody tr').forEach(row => {
    row.querySelectorAll('td').forEach((td, i) => td.setAttribute('data-label', headers[i] || ''));
  });
});

// Personalize dashboard title with profile name or email
function updateDashboardTitle() {
  const titleEl = document.getElementById('dashboardTitle');
  if (!titleEl) return;
  let name = '';
  try {
    const profile = JSON.parse(localStorage.getItem('pengeplan_profile') || '{}');
    name = (profile.name || '').trim();
  } catch {}
  if (!name) {
    const email = (localStorage.getItem('pengeplan_email') || '').trim();
    name = email || '';
  }
  titleEl.textContent = name ? name : 'Dashboard';
}

// Vis admin-link kun for admin
try{
  const p = JSON.parse(localStorage.getItem('pengeplan_profile')||'{}');
  const adminLink = document.querySelector('a[href="admin.html"]');
  if(adminLink) adminLink.style.display = (p?.role === 'admin') ? 'grid' : 'none';
}catch{}

// --- AI Advisor ---
function setupAiAdvisor() {
  const messagesEl = document.getElementById('aiMessages');
  const form = document.getElementById('aiForm');
  const input = document.getElementById('aiInput');
  const settingsBtn = document.getElementById('aiSettingsBtn');
  if (!messagesEl || !form || !input) return;

  // Load settings
  let aiSettings = getAiSettings();
  renderSystemWelcome(messagesEl, aiSettings);

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 160) + 'px';
  });

  // Submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    appendMessage(messagesEl, 'user', text);
    input.value = '';
    input.style.height = '44px';

    try {
      aiSettings = getAiSettings();
      const reply = await callAi(aiSettings, text, collectHistory(messagesEl));
      appendMessage(messagesEl, 'ai', reply || '');
    } catch (err) {
      console.error(err);
      appendMessage(messagesEl, 'ai', 'Beklager, noe gikk galt med AI‑tjenesten.');
    }
  });

  // Settings modal
  settingsBtn?.addEventListener('click', () => toggleAiSettings(true));
  bindAiSettingsModal();
}

function appendMessage(container, role, text) {
  const row = document.createElement('div');
  row.className = `ai-msg ${role}`;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  row.appendChild(bubble);
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

function renderSystemWelcome(container, settings) {
  const who = settings.provider === 'openai' ? 'OpenAI' : 'administrert tjeneste';
  appendMessage(container, 'ai', `Hei! Jeg er din AI‑rådgiver. Du bruker ${who}. Still meg et spørsmål om budsjett, regninger eller økonomi.`);
}

function collectHistory(container) {
  const history = [];
  container.querySelectorAll('.ai-msg').forEach(msg => {
    const role = msg.classList.contains('user') ? 'user' : 'assistant';
    const content = msg.textContent || '';
    history.push({ role, content });
  });
  return history.slice(-10);
}

async function callAi(settings, userText, history) {
  if (settings.provider === 'openai') {
    const apiKey = settings.openaiApiKey?.trim();
    const model = settings.openaiModel || 'gpt-4o-mini';
    if (!apiKey) throw new Error('Mangler OpenAI API‑nøkkel');
    const messages = [
      { role: 'system', content: 'Du er en vennlig økonomirådgiver i appen Pengeplan.' },
      ...history,
      { role: 'user', content: userText }
    ];
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages, temperature: 0.2 })
    });
    if (!res.ok) throw new Error('OpenAI feil');
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  // Managed endpoint
  const url = settings.managedUrl?.trim();
  if (!url) throw new Error('Mangler administrert endpoint URL');
  const headers = { 'Content-Type': 'application/json' };
  if (settings.managedToken?.trim()) headers['Authorization'] = `Bearer ${settings.managedToken.trim()}`;
  const body = {
    messages: [
      { role: 'system', content: 'Du er en vennlig økonomirådgiver i appen Pengeplan.' },
      ...history,
      { role: 'user', content: userText }
    ]
  };
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error('Feil fra administrert tjeneste');
  const data = await res.json();
  return data.reply || data.content || data.message || '';
}

function getAiSettings() {
  try {
    const raw = localStorage.getItem('pengeplan_ai_settings') || '{}';
    const cfg = JSON.parse(raw);
    return {
      provider: cfg.provider || 'managed',
      managedUrl: cfg.managedUrl || '',
      managedToken: cfg.managedToken || '',
      openaiApiKey: cfg.openaiApiKey || '',
      openaiModel: cfg.openaiModel || 'gpt-4o-mini',
    };
  } catch {
    return { provider: 'managed', managedUrl: '', managedToken: '', openaiApiKey: '', openaiModel: 'gpt-4o-mini' };
  }
}

function saveAiSettings(settings) {
  localStorage.setItem('pengeplan_ai_settings', JSON.stringify(settings));
}

function toggleAiSettings(open) {
  const modal = document.getElementById('aiSettingsModal');
  if (!modal) return;
  if (open) { modal.classList.remove('hidden'); modal.setAttribute('aria-hidden', 'false'); }
  else { modal.classList.add('hidden'); modal.setAttribute('aria-hidden', 'true'); }
}

function bindAiSettingsModal() {
  const modal = document.getElementById('aiSettingsModal');
  if (!modal) return;
  const provider = document.getElementById('aiProvider');
  const managedUrl = document.getElementById('aiManagedUrl');
  const managedToken = document.getElementById('aiManagedToken');
  const openaiApiKey = document.getElementById('openaiApiKey');
  const openaiModel = document.getElementById('openaiModel');
  const saveBtn = document.getElementById('saveAiSettings');
  const cancelBtn = document.getElementById('cancelAiSettings');
  const closeBtn = document.getElementById('closeAiSettings');

  function applyVisibility() {
    const mode = provider.value;
    document.querySelectorAll('.managed-only').forEach(el => el.style.display = mode === 'managed' ? '' : 'none');
    document.querySelectorAll('.openai-only').forEach(el => el.style.display = mode === 'openai' ? '' : 'none');
  }

  // Load stored
  const cfg = getAiSettings();
  provider.value = cfg.provider;
  managedUrl.value = cfg.managedUrl;
  managedToken.value = cfg.managedToken;
  openaiApiKey.value = cfg.openaiApiKey;
  openaiModel.value = cfg.openaiModel;
  applyVisibility();

  provider.addEventListener('change', applyVisibility);

  saveBtn?.addEventListener('click', () => {
    saveAiSettings({
      provider: provider.value,
      managedUrl: managedUrl.value,
      managedToken: managedToken.value,
      openaiApiKey: openaiApiKey.value,
      openaiModel: openaiModel.value,
    });
    toggleAiSettings(false);
    showNotification('AI‑innstillinger lagret', 'success');
  });
  cancelBtn?.addEventListener('click', () => toggleAiSettings(false));
  closeBtn?.addEventListener('click', () => toggleAiSettings(false));
  modal.addEventListener('click', (e) => { if (e.target === modal) toggleAiSettings(false); });
}

// Vis admin-link kun for admin
async function checkAdminAccess() {
  try {
    const p = JSON.parse(localStorage.getItem('pengeplan_profile')||'{}');
    const adminLink = document.querySelector('a[href="admin.html"]');
    if(adminLink) {
      adminLink.style.display = (p?.role === 'admin') ? 'grid' : 'none';
    }
  } catch(err) {
    console.error('Error checking admin access:', err);
  }
}

// Check admin access on load
checkAdminAccess();

// AI Chat functionality
function initAiChat() {
  const aiForm = document.getElementById('aiForm');
  const aiInput = document.getElementById('aiInput');
  const aiMessages = document.getElementById('aiMessages');
  const aiSettingsBtn = document.getElementById('aiSettingsBtn');

  if (!aiForm || !aiInput || !aiMessages) return;

  // Auto-resize textarea
  aiInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

  // Handle form submission
  aiForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const userText = aiInput.value.trim();
    if (!userText) return;

    // Add user message
    appendMessage('user', userText);
    aiInput.value = '';
    aiInput.style.height = 'auto';

    // Show loading
    const loadingId = appendMessage('assistant', '...', true);

    try {
      const response = await sendAiMessage(userText);
      updateMessage(loadingId, response);
    } catch (error) {
      updateMessage(loadingId, `Beklager, jeg kunne ikke svare: ${error.message}`);
    }
  });

  // Settings button
  aiSettingsBtn?.addEventListener('click', () => toggleAiSettings(true));
}

function appendMessage(role, content, isLoading = false) {
  const aiMessages = document.getElementById('aiMessages');
  if (!aiMessages) return null;

  const messageDiv = document.createElement('div');
  const id = 'msg-' + Date.now();
  messageDiv.id = id;
  messageDiv.className = `ai-message ${role} ${isLoading ? 'loading' : ''}`;
  
  const icon = role === 'user' ? '👤' : '🤖';
  messageDiv.innerHTML = `
    <div class="ai-message-content">
      <span class="ai-message-icon">${icon}</span>
      <div class="ai-message-text">${content}</div>
    </div>
  `;

  aiMessages.appendChild(messageDiv);
  aiMessages.scrollTop = aiMessages.scrollHeight;
  return id;
}

function updateMessage(id, content) {
  const messageDiv = document.getElementById(id);
  if (!messageDiv) return;

  const textDiv = messageDiv.querySelector('.ai-message-text');
  if (textDiv) {
    textDiv.textContent = content;
    messageDiv.classList.remove('loading');
  }
}

// Initialize AI chat when page loads
document.addEventListener('DOMContentLoaded', function() {
  initAiChat();
  bindAiSettingsModal();
});
