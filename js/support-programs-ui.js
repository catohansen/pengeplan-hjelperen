// Support Programs UI Logic
class SupportProgramsUI {
    constructor() {
        this.supportPrograms = new SupportPrograms();
        this.currentView = 'grid';
        this.currentFilters = {};
        this.currentPrograms = [];
        
        this.initialize();
    }

    async initialize() {
        // Initialize support programs
        this.supportPrograms.initialize();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial data
        await this.loadInitialData();
        
        // Render programs
        this.renderPrograms();
        
        // Update statistics
        this.updateStatistics();
    }

    setupEventListeners() {
        // Search and filters
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const providerFilter = document.getElementById('providerFilter');
        const priorityFilter = document.getElementById('priorityFilter');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        const exportBtn = document.getElementById('exportBtn');

        // View controls
        const gridViewBtn = document.getElementById('gridViewBtn');
        const listViewBtn = document.getElementById('listViewBtn');

        // Modal
        const programModal = document.getElementById('programModal');
        const closeModal = document.getElementById('closeModal');
        const saveProgramBtn = document.getElementById('saveProgramBtn');
        const applyProgramBtn = document.getElementById('applyProgramBtn');
        const cancelModalBtn = document.getElementById('cancelModalBtn');

        // Mobile menu
        const menuBtn = document.getElementById('menuBtn');
        const overlay = document.getElementById('overlay');
        const sidebar = document.getElementById('sidebar');

        // Search and filter events
        searchInput?.addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value;
            this.filterAndRender();
        });

        categoryFilter?.addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.filterAndRender();
        });

        providerFilter?.addEventListener('change', (e) => {
            this.currentFilters.provider = e.target.value;
            this.filterAndRender();
        });

        priorityFilter?.addEventListener('change', (e) => {
            this.currentFilters.priority = e.target.value;
            this.filterAndRender();
        });

        clearFiltersBtn?.addEventListener('click', () => {
            this.clearFilters();
        });

        exportBtn?.addEventListener('click', () => {
            this.exportPrograms();
        });

        // View control events
        gridViewBtn?.addEventListener('click', () => {
            this.switchView('grid');
        });

        listViewBtn?.addEventListener('click', () => {
            this.switchView('list');
        });

        // Modal events
        closeModal?.addEventListener('click', () => {
            this.closeModal();
        });

        cancelModalBtn?.addEventListener('click', () => {
            this.closeModal();
        });

        saveProgramBtn?.addEventListener('click', () => {
            this.saveCurrentProgram();
        });

        applyProgramBtn?.addEventListener('click', () => {
            this.applyCurrentProgram();
        });

        // Close modal on outside click
        programModal?.addEventListener('click', (e) => {
            if (e.target === programModal) {
                this.closeModal();
            }
        });

        // Mobile menu events
        menuBtn?.addEventListener('click', () => {
            sidebar?.classList.add('open');
            overlay?.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        overlay?.addEventListener('click', () => {
            sidebar?.classList.remove('open');
            overlay?.classList.remove('show');
            document.body.style.overflow = '';
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                sidebar?.classList.remove('open');
                overlay?.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }

    async loadInitialData() {
        // Load categories
        const categories = this.supportPrograms.getCategories();
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (categoryFilter) {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = `${category.name} (${category.count})`;
                categoryFilter.appendChild(option);
            });
        }

        // Load providers
        const providers = this.supportPrograms.getProviders();
        const providerFilter = document.getElementById('providerFilter');
        
        if (providerFilter) {
            providers.forEach(provider => {
                const option = document.createElement('option');
                option.value = provider.id;
                option.textContent = `${provider.name} (${provider.count})`;
                providerFilter.appendChild(option);
            });
        }

        // Load initial programs
        this.currentPrograms = this.supportPrograms.getRelevantPrograms();
    }

    filterAndRender() {
        // Apply filters
        this.currentPrograms = this.supportPrograms.searchPrograms(this.currentFilters);
        
        // Render results
        this.renderPrograms();
        
        // Update statistics
        this.updateStatistics();
    }

    clearFilters() {
        // Clear filter inputs
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const providerFilter = document.getElementById('providerFilter');
        const priorityFilter = document.getElementById('priorityFilter');

        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (providerFilter) providerFilter.value = '';
        if (priorityFilter) priorityFilter.value = '';

        // Clear filter state
        this.currentFilters = {};
        
        // Reload and render
        this.currentPrograms = this.supportPrograms.getRelevantPrograms();
        this.renderPrograms();
        this.updateStatistics();
    }

    renderPrograms() {
        const container = document.getElementById('programsContainer');
        const noResults = document.getElementById('noResults');
        
        if (!container) return;

        if (this.currentPrograms.length === 0) {
            container.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
            return;
        }

        if (noResults) noResults.style.display = 'none';

        const programsHtml = this.currentPrograms.map(program => 
            this.renderProgramCard(program)
        ).join('');

        container.innerHTML = programsHtml;

        // Add click listeners to program cards
        this.addProgramCardListeners();
    }

    renderProgramCard(program) {
        const isSaved = this.supportPrograms.isProgramSaved(program.id);
        const priorityClass = `priority-${program.priority}`;
        
        return `
            <div class="program-card ${priorityClass}" data-program-id="${program.id}">
                <div class="program-header">
                    <div class="program-title">
                        <h3>${program.name}</h3>
                        <span class="program-provider">${program.provider}</span>
                    </div>
                    <div class="program-actions">
                        <button class="save-btn ${isSaved ? 'saved' : ''}" data-program-id="${program.id}">
                            ${isSaved ? '💾' : '💾'}
                        </button>
                        <span class="priority-badge priority-${program.priority}">
                            ${program.priority === 'høy' ? '🔥' : program.priority === 'medium' ? '⚡' : '📋'}
                        </span>
                    </div>
                </div>
                
                <div class="program-content">
                    <p class="program-description">${program.description}</p>
                    
                    <div class="program-details">
                        <div class="detail-item">
                            <span class="detail-label">Beløp:</span>
                            <span class="detail-value">${program.amount}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Kategori:</span>
                            <span class="detail-value">${this.supportPrograms.getCategoryName(program.category)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="program-footer">
                    <button class="btn btn-info btn-sm view-details-btn" data-program-id="${program.id}">
                        <span class="btn-icon">👁️</span>
                        <span>Se detaljer</span>
                    </button>
                    <a href="${program.url}" target="_blank" class="btn btn-success btn-sm">
                        <span class="btn-icon">📝</span>
                        <span>Søk nå</span>
                    </a>
                </div>
            </div>
        `;
    }

    addProgramCardListeners() {
        // Save buttons
        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const programId = btn.dataset.programId;
                this.toggleSaveProgram(programId, btn);
            });
        });

        // View details buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const programId = btn.dataset.programId;
                this.showProgramDetails(programId);
            });
        });

        // Program card clicks
        document.querySelectorAll('.program-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button') && !e.target.closest('a')) {
                    const programId = card.dataset.programId;
                    this.showProgramDetails(programId);
                }
            });
        });
    }

    toggleSaveProgram(programId, button) {
        const isSaved = this.supportPrograms.toggleSavedProgram(programId);
        
        if (button) {
            button.classList.toggle('saved', isSaved);
        }
        
        this.updateStatistics();
    }

    showProgramDetails(programId) {
        const program = this.supportPrograms.getProgramById(programId);
        if (!program) return;

        const modal = document.getElementById('programModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        const saveProgramBtn = document.getElementById('saveProgramBtn');

        if (!modal || !modalTitle || !modalContent) return;

        // Set modal title
        modalTitle.textContent = program.name;

        // Set modal content
        modalContent.innerHTML = this.renderProgramDetails(program);

        // Update save button
        const isSaved = this.supportPrograms.isProgramSaved(programId);
        if (saveProgramBtn) {
            saveProgramBtn.innerHTML = `
                <span class="btn-icon">${isSaved ? '💾' : '💾'}</span>
                <span>${isSaved ? 'Fjern fra lagret' : 'Lagre'}</span>
            `;
            saveProgramBtn.dataset.programId = programId;
        }

        // Show modal
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.remove('hidden');
    }

    renderProgramDetails(program) {
        const eligibilityList = program.eligibility.map(item => `<li>${item}</li>`).join('');
        
        return `
            <div class="program-details-modal">
                <div class="program-info">
                    <div class="info-row">
                        <span class="info-label">Leverandør:</span>
                        <span class="info-value">${program.provider}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Kategori:</span>
                        <span class="info-value">${this.supportPrograms.getCategoryName(program.category)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Prioritet:</span>
                        <span class="info-value">
                            <span class="priority-badge priority-${program.priority}">
                                ${program.priority === 'høy' ? '🔥 Høy' : program.priority === 'medium' ? '⚡ Medium' : '📋 Lav'}
                            </span>
                        </span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Beløp:</span>
                        <span class="info-value">${program.amount}</span>
                    </div>
                </div>
                
                <div class="program-description-full">
                    <h4>Beskrivelse</h4>
                    <p>${program.description}</p>
                </div>
                
                <div class="program-eligibility">
                    <h4>Krav for å kvalifisere</h4>
                    <ul>${eligibilityList}</ul>
                </div>
                
                <div class="program-application">
                    <h4>Hvordan søke</h4>
                    <p>${program.application}</p>
                    <a href="${program.url}" target="_blank" class="btn btn-success">
                        <span class="btn-icon">📝</span>
                        <span>Gå til søknad</span>
                    </a>
                </div>
            </div>
        `;
    }

    closeModal() {
        const modal = document.getElementById('programModal');
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            modal.classList.add('hidden');
        }
    }

    saveCurrentProgram() {
        const saveProgramBtn = document.getElementById('saveProgramBtn');
        const programId = saveProgramBtn?.dataset.programId;
        
        if (programId) {
            this.toggleSaveProgram(programId);
            this.closeModal();
        }
    }

    applyCurrentProgram() {
        const saveProgramBtn = document.getElementById('saveProgramBtn');
        const programId = saveProgramBtn?.dataset.programId;
        
        if (programId) {
            const program = this.supportPrograms.getProgramById(programId);
            if (program) {
                window.open(program.url, '_blank');
            }
        }
    }

    switchView(view) {
        this.currentView = view;
        
        const container = document.getElementById('programsContainer');
        const gridViewBtn = document.getElementById('gridViewBtn');
        const listViewBtn = document.getElementById('listViewBtn');
        
        if (container) {
            container.className = `programs-${view}`;
        }
        
        if (gridViewBtn) gridViewBtn.classList.toggle('active', view === 'grid');
        if (listViewBtn) listViewBtn.classList.toggle('active', view === 'list');
    }

    updateStatistics() {
        const totalPrograms = document.getElementById('totalPrograms');
        const relevantPrograms = document.getElementById('relevantPrograms');
        const savedPrograms = document.getElementById('savedPrograms');
        const highPriority = document.getElementById('highPriority');

        const allPrograms = this.supportPrograms.programs;
        const relevant = this.supportPrograms.getRelevantPrograms();
        const saved = this.supportPrograms.getUserPrograms();
        const highPriorityCount = allPrograms.filter(p => p.priority === 'høy').length;

        if (totalPrograms) totalPrograms.textContent = allPrograms.length;
        if (relevantPrograms) relevantPrograms.textContent = relevant.length;
        if (savedPrograms) savedPrograms.textContent = saved.length;
        if (highPriority) highPriority.textContent = highPriorityCount;
    }

    exportPrograms() {
        const programsToExport = this.currentPrograms.length > 0 ? this.currentPrograms : this.supportPrograms.programs;
        this.supportPrograms.exportToCSV(programsToExport);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SupportProgramsUI();
});
