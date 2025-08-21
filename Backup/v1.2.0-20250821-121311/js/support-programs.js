// Støtteordningsdatabase for Pengeplan
// NAV og andre økonomiske støtteordninger

class SupportPrograms {
    constructor() {
        this.programs = this.getDefaultPrograms();
        this.userProfile = null;
    }

    // Initialize with user profile
    initialize() {
        try {
            this.userProfile = JSON.parse(localStorage.getItem('pengeplan_profile') || '{}');
            return true;
        } catch (error) {
            console.error('Failed to load user profile:', error);
            return false;
        }
    }

    // Get default support programs
    getDefaultPrograms() {
        return [
            // NAV Støtteordninger
            {
                id: 'nav-sosialhjelp',
                name: 'Sosialhjelp',
                provider: 'NAV',
                category: 'økonomisk-støtte',
                description: 'Økonomisk støtte når du ikke har nok inntekt til å dekke livsopphold.',
                eligibility: [
                    'Norsk statsborger eller oppholdstillatelse',
                    'Bodd i Norge minst 5 år',
                    'Ikke tilstrekkelig inntekt',
                    'Ikke eier bolig eller andre verdier over 100 000 kr'
                ],
                amount: 'Varierer etter inntekt og utgifter',
                application: 'Søk på nav.no eller på NAV-kontor',
                url: 'https://www.nav.no/sosialhjelp',
                priority: 'høy'
            },
            {
                id: 'nav-barnetrygd',
                name: 'Barnetrygd',
                provider: 'NAV',
                category: 'barnetrygd',
                description: 'Månedlig støtte til barn under 18 år.',
                eligibility: [
                    'Barn under 18 år',
                    'Barnet bor i Norge',
                    'Foreldre har oppholdstillatelse'
                ],
                amount: '1 054 kr per måned per barn',
                application: 'Automatisk utbetaling, eller søk på nav.no',
                url: 'https://www.nav.no/barnetrygd',
                priority: 'høy'
            },
            {
                id: 'nav-husbanken',
                name: 'Husbanken - Boligstøtte',
                provider: 'Husbanken',
                category: 'bolig',
                description: 'Støtte til boligutgifter for personer med lav inntekt.',
                eligibility: [
                    'Lav inntekt',
                    'Høy boligkostnad i forhold til inntekt',
                    'Eier eller leier bolig'
                ],
                amount: 'Opptil 80% av boligkostnader',
                application: 'Søk på husbanken.no',
                url: 'https://www.husbanken.no/boligstotte',
                priority: 'høy'
            },
            {
                id: 'nav-stipend',
                name: 'Stipend til utdanning',
                provider: 'Lånekassen',
                category: 'utdanning',
                description: 'Stipend og lån til videregående og høyere utdanning.',
                eligibility: [
                    'Norsk statsborger',
                    'Studerer på videregående eller høyere nivå',
                    'Under 67 år'
                ],
                amount: 'Varierer etter utdanningsnivå og alder',
                application: 'Søk på lanekassen.no',
                url: 'https://www.lanekassen.no',
                priority: 'medium'
            },
            {
                id: 'nav-enslig-forsørger',
                name: 'Støtte til enslig forsørger',
                provider: 'NAV',
                category: 'økonomisk-støtte',
                description: 'Ekstra støtte for enslige som forsørger barn.',
                eligibility: [
                    'Enslig forsørger',
                    'Barn under 18 år',
                    'Ikke gift eller samboer'
                ],
                amount: 'Ekstra 1 054 kr per måned',
                application: 'Søk på nav.no',
                url: 'https://www.nav.no/enslig-forsorger',
                priority: 'høy'
            },
            {
                id: 'nav-uføretrygd',
                name: 'Uføretrygd',
                provider: 'NAV',
                category: 'sykdom-uførhet',
                description: 'Økonomisk støtte ved varig nedsatt arbeidsevne.',
                eligibility: [
                    'Varig nedsatt arbeidsevne',
                    'Oppfylt forsikringstid',
                    'Medisinsk dokumentasjon'
                ],
                amount: '66% av grunnbeløpet',
                application: 'Søk på nav.no',
                url: 'https://www.nav.no/uføretrygd',
                priority: 'høy'
            },
            {
                id: 'nav-dagpenger',
                name: 'Dagpenger',
                provider: 'NAV',
                category: 'arbeidsledighet',
                description: 'Støtte ved arbeidsledighet.',
                eligibility: [
                    'Arbeidsledig',
                    'Oppfylt forsikringstid',
                    'Aktivt jobbsøker'
                ],
                amount: '62,4% av inntekt (maks 6G)',
                application: 'Søk på nav.no',
                url: 'https://www.nav.no/dagpenger',
                priority: 'høy'
            },
            {
                id: 'nav-barnepass',
                name: 'Støtte til barnepass',
                provider: 'NAV',
                category: 'barnepass',
                description: 'Støtte til utgifter til barnepass.',
                eligibility: [
                    'Barn under 13 år',
                    'Foreldre jobber eller studerer',
                    'Barnepass i godkjent ordning'
                ],
                amount: 'Opptil 7 500 kr per måned',
                application: 'Søk på nav.no',
                url: 'https://www.nav.no/barnepass',
                priority: 'medium'
            },
            {
                id: 'nav-helsetjenester',
                name: 'Fritak for egenandel',
                provider: 'NAV',
                category: 'helse',
                description: 'Fritak for egenandel ved helsetjenester.',
                eligibility: [
                    'Lav inntekt',
                    'Høy egenandel',
                    'Norsk statsborger'
                ],
                amount: 'Fritak for egenandel',
                application: 'Søk på nav.no',
                url: 'https://www.nav.no/fritak-egenandel',
                priority: 'medium'
            },
            {
                id: 'nav-reisekostnader',
                name: 'Støtte til reisekostnader',
                provider: 'NAV',
                category: 'transport',
                description: 'Støtte til reisekostnader for behandling.',
                eligibility: [
                    'Behandling utenfor hjemstedet',
                    'Lav inntekt',
                    'Medisinsk nødvendig reise'
                ],
                amount: 'Opp til 80% av reisekostnader',
                application: 'Søk på nav.no',
                url: 'https://www.nav.no/reisekostnader',
                priority: 'medium'
            }
        ];
    }

    // Search programs by criteria
    searchPrograms(criteria = {}) {
        let results = [...this.programs];

        // Filter by category
        if (criteria.category) {
            results = results.filter(program => program.category === criteria.category);
        }

        // Filter by provider
        if (criteria.provider) {
            results = results.filter(program => program.provider === criteria.provider);
        }

        // Filter by priority
        if (criteria.priority) {
            results = results.filter(program => program.priority === criteria.priority);
        }

        // Filter by text search
        if (criteria.search) {
            const searchTerm = criteria.search.toLowerCase();
            results = results.filter(program => 
                program.name.toLowerCase().includes(searchTerm) ||
                program.description.toLowerCase().includes(searchTerm) ||
                program.provider.toLowerCase().includes(searchTerm)
            );
        }

        // Sort by priority and relevance
        results.sort((a, b) => {
            const priorityOrder = { 'høy': 1, 'medium': 2, 'lav': 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        return results;
    }

    // Get programs relevant to user profile
    getRelevantPrograms() {
        if (!this.userProfile) return this.programs;

        const relevant = [];
        const profile = this.userProfile;

        // Check for children
        const hasChildren = profile.household?.size > 1;
        if (hasChildren) {
            relevant.push(...this.searchPrograms({ category: 'barnetrygd' }));
            relevant.push(...this.searchPrograms({ category: 'barnepass' }));
            relevant.push(...this.searchPrograms({ category: 'enslig-forsørger' }));
        }

        // Check for students
        if (profile.plan === 'free' && profile.role === 'user') {
            relevant.push(...this.searchPrograms({ category: 'utdanning' }));
        }

        // Always include high priority programs
        relevant.push(...this.searchPrograms({ priority: 'høy' }));

        // Remove duplicates
        const unique = relevant.filter((program, index, self) => 
            index === self.findIndex(p => p.id === program.id)
        );

        return unique;
    }

    // Get program details by ID
    getProgramById(id) {
        return this.programs.find(program => program.id === id);
    }

    // Get categories
    getCategories() {
        const categories = [...new Set(this.programs.map(p => p.category))];
        return categories.map(category => ({
            id: category,
            name: this.getCategoryName(category),
            count: this.programs.filter(p => p.category === category).length
        }));
    }

    // Get category display name
    getCategoryName(category) {
        const names = {
            'økonomisk-støtte': 'Økonomisk støtte',
            'barnetrygd': 'Barnetrygd',
            'bolig': 'Boligstøtte',
            'utdanning': 'Utdanning',
            'sykdom-uførhet': 'Sykdom og uførhet',
            'arbeidsledighet': 'Arbeidsledighet',
            'barnepass': 'Barnepass',
            'helse': 'Helse',
            'transport': 'Transport'
        };
        return names[category] || category;
    }

    // Get providers
    getProviders() {
        const providers = [...new Set(this.programs.map(p => p.provider))];
        return providers.map(provider => ({
            id: provider,
            name: provider,
            count: this.programs.filter(p => p.provider === provider).length
        }));
    }

    // Save user's saved programs
    saveUserPrograms(programIds) {
        try {
            localStorage.setItem('pengeplan_saved_programs', JSON.stringify(programIds));
            return true;
        } catch (error) {
            console.error('Failed to save user programs:', error);
            return false;
        }
    }

    // Get user's saved programs
    getUserPrograms() {
        try {
            const saved = localStorage.getItem('pengeplan_saved_programs');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load user programs:', error);
            return [];
        }
    }

    // Check if program is saved by user
    isProgramSaved(programId) {
        const saved = this.getUserPrograms();
        return saved.includes(programId);
    }

    // Toggle saved status for program
    toggleSavedProgram(programId) {
        const saved = this.getUserPrograms();
        const index = saved.indexOf(programId);
        
        if (index > -1) {
            saved.splice(index, 1);
        } else {
            saved.push(programId);
        }
        
        this.saveUserPrograms(saved);
        return this.isProgramSaved(programId);
    }

    // Export programs to CSV
    exportToCSV(programs = this.programs) {
        const headers = ['Navn', 'Leverandør', 'Kategori', 'Beskrivelse', 'Beløp', 'Søknad', 'URL'];
        const rows = programs.map(program => [
            program.name,
            program.provider,
            this.getCategoryName(program.category),
            program.description,
            program.amount,
            program.application,
            program.url
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'stotteordninger.csv';
        link.click();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupportPrograms;
} else {
    window.SupportPrograms = SupportPrograms;
}
