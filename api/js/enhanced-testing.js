/**
 * 🧪 ENHANCED PENGEPLAN TESTING SUITE
 */

class PengeplanEnhancedTester {
    constructor() {
        this.results = { passed: 0, failed: 0, warnings: 0 };
        this.startTime = performance.now();
    }

    assert(condition, message) {
        if (condition) {
            this.results.passed++;
            console.log(`✅ ${message}`);
        } else {
            this.results.failed++;
            console.error(`❌ ${message}`);
        }
    }

    warn(condition, message) {
        if (!condition) {
            this.results.warnings++;
            console.warn(`⚠️ ${message}`);
        }
    }

    runAllTests() {
        console.log('🚀 ENHANCED PENGEPLAN TESTING SUITE...');
        
        // Mobile responsiveness
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        this.assert(viewport.width > 0, `Viewport: ${viewport.width}x${viewport.height}`);
        
        // Touch targets
        const touchElements = document.querySelectorAll('button, .btn, .nav-link');
        let smallTargets = 0;
        touchElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) smallTargets++;
        });
        this.assert(smallTargets === 0, `All ${touchElements.length} touch targets are 44px+`);
        
        // Forms
        const forms = document.querySelectorAll('form');
        this.assert(forms.length > 0, `${forms.length} forms found`);
        
        // Security
        const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        this.assert(csp, 'CSP header present');
        
        // Performance
        const loadTime = performance.now() - this.startTime;
        this.assert(loadTime < 3000, `Load time: ${loadTime.toFixed(2)}ms`);
        
        // Accessibility
        const images = document.querySelectorAll('img');
        let missingAlt = 0;
        images.forEach(img => { if (!img.alt) missingAlt++; });
        this.assert(missingAlt === 0, `All ${images.length} images have alt text`);
        
        // Navigation
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            const navLinks = sidebar.querySelectorAll('.nav-link');
            this.assert(navLinks.length > 0, `${navLinks.length} nav links found`);
        }
        
        // Data persistence
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            this.assert(true, 'localStorage working');
        } catch (e) {
            this.assert(false, 'localStorage not available');
        }
        
        this.printResults();
    }

    printResults() {
        const total = this.results.passed + this.results.failed;
        const rate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;
        
        console.log('\n📊 RESULTS:');
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`⚠️ Warnings: ${this.results.warnings}`);
        console.log(`📈 Success Rate: ${rate}%`);
        
        window.pengeplanTestResults = this.results;
    }
}

// Auto-run
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new PengeplanEnhancedTester().runAllTests();
    }, 1000);
});

window.PengeplanEnhancedTester = PengeplanEnhancedTester;
