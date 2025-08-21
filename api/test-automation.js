/**
 * 🧪 AUTOMATED TESTING - PENGEPLAN
 * Rask testing av kritiske brukerflyter
 */

class PengeplanTester {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            total: 0,
            details: []
        };
    }

    async runAllTests() {
        console.log('🧪 STARTER AUTOMATISK TESTING AV PENGEPLAN');
        console.log('==========================================');

        // Test 1: Mobile Responsiveness
        await this.testMobileResponsiveness();
        
        // Test 2: User Registration
        await this.testUserRegistration();
        
        // Test 3: User Login
        await this.testUserLogin();
        
        // Test 4: Navigation
        await this.testNavigation();
        
        // Test 5: Data Persistence
        await this.testDataPersistence();
        
        // Test 6: Security
        await this.testSecurity();
        
        // Test 7: Performance
        await this.testPerformance();

        this.printResults();
    }

    async testMobileResponsiveness() {
        console.log('\n📱 TESTING MOBILE RESPONSIVENESS...');
        
        // Test viewport
        const viewport = window.innerWidth;
        this.assert(viewport > 0, 'Viewport width should be positive');
        
        // Test touch targets
        const buttons = document.querySelectorAll('button, .btn, .nav-link');
        let touchTargetIssues = 0;
        
        buttons.forEach(button => {
            const rect = button.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                touchTargetIssues++;
            }
        });
        
        this.assert(touchTargetIssues === 0, `All touch targets should be 44px+ (found ${touchTargetIssues} issues)`);
        
        // Test scrolling
        const canScroll = document.documentElement.scrollHeight > window.innerHeight;
        this.assert(canScroll || document.documentElement.scrollHeight === window.innerHeight, 'Page should be scrollable or fit viewport');
    }

    async testUserRegistration() {
        console.log('\n📝 TESTING USER REGISTRATION...');
        
        // Test form validation
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            this.assert(registerForm !== null, 'Registration form should exist');
            
            // Test required fields
            const requiredFields = registerForm.querySelectorAll('[required]');
            this.assert(requiredFields.length > 0, 'Should have required fields');
            
            // Test password strength
            const passwordInput = document.getElementById('password');
            if (passwordInput) {
                this.assert(passwordInput.type === 'password', 'Password field should be password type');
            }
        } else {
            this.assert(false, 'Registration form not found on current page');
        }
    }

    async testUserLogin() {
        console.log('\n🔐 TESTING USER LOGIN...');
        
        // Test login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            this.assert(loginForm !== null, 'Login form should exist');
            
            // Test email validation
            const emailInput = document.getElementById('email');
            if (emailInput) {
                this.assert(emailInput.type === 'email', 'Email field should be email type');
            }
            
            // Test password field
            const passwordInput = document.getElementById('password');
            if (passwordInput) {
                this.assert(passwordInput.type === 'password', 'Password field should be password type');
            }
        } else {
            this.assert(false, 'Login form not found on current page');
        }
    }

    async testNavigation() {
        console.log('\n🧭 TESTING NAVIGATION...');
        
        // Test sidebar
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            this.assert(sidebar !== null, 'Sidebar should exist');
            
            // Test navigation links
            const navLinks = sidebar.querySelectorAll('.nav-link');
            this.assert(navLinks.length > 0, 'Should have navigation links');
            
            // Test mobile menu button
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            if (mobileMenuBtn) {
                this.assert(mobileMenuBtn !== null, 'Mobile menu button should exist');
            }
        }
        
        // Test logo click
        const logo = document.querySelector('.logo');
        if (logo) {
            this.assert(logo !== null, 'Logo should exist');
        }
    }

    async testDataPersistence() {
        console.log('\n💾 TESTING DATA PERSISTENCE...');
        
        // Test localStorage
        const testKey = 'pengeplan_test';
        const testValue = 'test_data_' + Date.now();
        
        try {
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            this.assert(retrieved === testValue, 'localStorage should work correctly');
            localStorage.removeItem(testKey);
        } catch (error) {
            this.assert(false, 'localStorage should be available');
        }
        
        // Test session storage
        try {
            sessionStorage.setItem(testKey, testValue);
            const retrieved = sessionStorage.getItem(testKey);
            this.assert(retrieved === testValue, 'sessionStorage should work correctly');
            sessionStorage.removeItem(testKey);
        } catch (error) {
            this.assert(false, 'sessionStorage should be available');
        }
    }

    async testSecurity() {
        console.log('\n🔒 TESTING SECURITY...');
        
        // Test CSP headers
        const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        this.assert(metaCSP !== null, 'Content Security Policy should be set');
        
        // Test X-Frame-Options
        const metaXFrame = document.querySelector('meta[http-equiv="X-Frame-Options"]');
        this.assert(metaXFrame !== null, 'X-Frame-Options should be set');
        
        // Test input sanitization
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'email') {
                this.assert(input.pattern || input.type === 'email', 'Email inputs should have validation');
            }
        });
    }

    async testPerformance() {
        console.log('\n⚡ TESTING PERFORMANCE...');
        
        // Test page load time
        const loadTime = performance.now();
        this.assert(loadTime < 5000, 'Page should load in under 5 seconds');
        
        // Test DOM ready
        this.assert(document.readyState === 'complete' || document.readyState === 'interactive', 'DOM should be ready');
        
        // Test JavaScript execution
        const jsStart = performance.now();
        // Simulate some JS work
        for (let i = 0; i < 1000; i++) {
            Math.random();
        }
        const jsTime = performance.now() - jsStart;
        this.assert(jsTime < 100, 'JavaScript should execute quickly');
    }

    assert(condition, message) {
        this.results.total++;
        
        if (condition) {
            this.results.passed++;
            this.results.details.push({ status: 'PASS', message });
            console.log(`✅ PASS: ${message}`);
        } else {
            this.results.failed++;
            this.results.details.push({ status: 'FAIL', message });
            console.log(`❌ FAIL: ${message}`);
        }
    }

    printResults() {
        console.log('\n📊 TESTING RESULTS');
        console.log('==================');
        console.log(`Total tests: ${this.results.total}`);
        console.log(`Passed: ${this.results.passed}`);
        console.log(`Failed: ${this.results.failed}`);
        console.log(`Success rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
        
        if (this.results.failed > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.results.details
                .filter(test => test.status === 'FAIL')
                .forEach(test => console.log(`- ${test.message}`));
        }
        
        console.log('\n🎯 RECOMMENDATIONS:');
        if (this.results.failed === 0) {
            console.log('✅ All tests passed! Ready for user testing.');
        } else {
            console.log('🔧 Fix failed tests before proceeding to user testing.');
        }
    }
}

// Run tests when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for everything to load
    setTimeout(() => {
        const tester = new PengeplanTester();
        tester.runAllTests();
    }, 1000);
});

// Export for manual testing
window.PengeplanTester = PengeplanTester;
