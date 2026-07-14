document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamically generate the background grid cells
    const bgGrid = document.getElementById('bgGrid');
    if (bgGrid) {
        // Create 180 grid cells for background interaction
        for (let i = 0; i < 180; i++) {
            const cell = document.createElement('div');
            cell.className = 'c';
            bgGrid.appendChild(cell);
        }
    }

    // 2. DOM Elements
    const user = document.getElementById('user');
    const pass = document.getElementById('pass');
    const loginBtn = document.getElementById('loginBtn');
    const remember = document.getElementById('r');
    const loader = document.getElementById('loginLoader');
    const btnText = loginBtn.querySelector('.btn-text');
    const toastContainer = document.getElementById('toastContainer');
    const signUpBtn = document.getElementById('signUpBtn');

    // 3. Saved Credentials Check
    const savedUser = localStorage.getItem('username');
    const savedPass = localStorage.getItem('password');
    if (savedUser && savedPass) {
        user.value = savedUser;
        pass.value = savedPass;
        remember.checked = true;
    }

    // 4. Custom Toast Notification helper
    function showToast(message, type = 'error') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);

        // Slide out after 3 seconds
        setTimeout(() => {
            toast.classList.add('hide');
            // Remove from DOM after transition finishes
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }

    // 5. Submit Event Handler
    function handleLogin() {
        const username = user.value.trim().toLowerCase();
        const password = pass.value.trim().toLowerCase();

        if (!username || !password) {
            showToast('Please enter both username and password.');
            return;
        }

        // Show loading state
        loginBtn.disabled = true;
        btnText.style.display = 'none';
        loader.style.display = 'inline-block';

        // Fake network latency
        setTimeout(() => {
            if (username === "bhavesh" && password === "demonking") {
                // Save if remember is checked
                if (remember.checked) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('password', password);
                } else {
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');
                }

                // Show success and redirect
                showToast('Welcome back, Bhavesh! Signing in...', 'success');
                setTimeout(() => {
                    window.location.href = "home.html";
                }, 1000);
            } else {
                // Revert button state
                loginBtn.disabled = false;
                btnText.style.display = 'inline';
                loader.style.display = 'none';

                // Funny original error message from source, formatted beautifully
                showToast('Access Denied: Nikal be! ❌');
                pass.value = '';
                pass.focus();
            }
        }, 1200);
    }

    // 6. Event Listeners
    loginBtn.addEventListener('click', handleLogin);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });

    if (signUpBtn) {
        signUpBtn.addEventListener('click', () => {
            showToast('Sign up is currently disabled. Please use the Demo Credentials!', 'error');
        });
    }
});