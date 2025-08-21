document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        if (data.password !== data.confirmPassword) {
            alert('Passordene matcher ikke');
            return;
        }
        
        if (data.password.length < 8) {
            alert('Passordet må være minst 8 tegn');
            return;
        }
        
        // Store user data
        const users = JSON.parse(localStorage.getItem('pengeplan_users') || '[]');
        const newUser = {
            id: Date.now().toString(),
            ...data,
            role: 'user',
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('pengeplan_users', JSON.stringify(users));
        
        alert('Konto opprettet! Du blir omdirigert til innlogging.');
        window.location.href = 'index.html';
    });
    
    // Password strength indicator
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        console.log('Password strength:', strength);
    });
    
    function calculatePasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[@$!%*?&]/.test(password)) score++;
        
        if (score >= 4) return 'strong';
        if (score >= 2) return 'medium';
        return 'weak';
    }
});
