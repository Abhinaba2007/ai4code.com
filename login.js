document.addEventListener('DOMContentLoaded', function() {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBITF0Fh_vCJddNeyURWWyprLCOYB2h7Cc",
        authDomain: "sign-up-page-fe4f7.firebaseapp.com",
        projectId: "sign-up-page-fe4f7",
        storageBucket: "sign-up-page-fe4f7.appspot.com",
        messagingSenderId: "339652230724",
        appId: "1:339652230724:web:ba50630f42259219a8c611"
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();
    
    // DOM elements
    const loginEmailBtn = document.getElementById('loginEmailBtn');
    const loginPhoneBtn = document.getElementById('loginPhoneBtn');
    const loginEmailGroup = document.getElementById('loginEmailGroup');
    const loginPhoneGroup = document.getElementById('loginPhoneGroup');
    const loginOtpGroup = document.getElementById('loginOtpGroup');
    const loginForm = document.getElementById('loginForm');
    const verifyLoginOtpBtn = document.getElementById('verifyLoginOtpBtn');
    
    let verificationId = null;
    let recaptchaVerifier = null;
    
    // Initialize auth state management
    initAuthState();
    
    // Set default login method to email
    if (loginEmailGroup && loginPhoneGroup) {
        loginEmailGroup.style.display = 'block';
        loginPhoneGroup.style.display = 'none';
        if (loginEmailBtn) loginEmailBtn.classList.add('active');
    }

    // Login method toggle
    if (loginEmailBtn && loginPhoneBtn) {
        loginEmailBtn.addEventListener('click', function() {
            loginEmailGroup.style.display = 'block';
            loginPhoneGroup.style.display = 'none';
            loginOtpGroup.style.display = 'none';
            loginEmailBtn.classList.add('active');
            loginPhoneBtn.classList.remove('active');
        });
        
        loginPhoneBtn.addEventListener('click', function() {
            loginEmailGroup.style.display = 'none';
            loginPhoneGroup.style.display = 'block';
            loginOtpGroup.style.display = 'none';
            loginEmailBtn.classList.remove('active');
            loginPhoneBtn.classList.add('active');
            
            // Initialize reCAPTCHA
            if (!recaptchaVerifier) {
                recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sendOtpBtn', {
                    'size': 'invisible'
                });
            }
        });
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLoginSubmit();
        });
    }
    
    // Verify OTP for phone login
    if (verifyLoginOtpBtn) {
        verifyLoginOtpBtn.addEventListener('click', function() {
            verifyOtp();
        });
    }

    // Auth state management functions
    function initAuthState() {
        auth.onAuthStateChanged(function(user) {
            updateAuthUI(user);
            
            // If user is logged in and on login page, redirect
            if (user && window.location.pathname.includes('login.html')) {
                redirectAfterLogin();
            }
        });
    }

    function updateAuthUI(user) {
        const loginButtons = document.querySelectorAll('.login-btn');
        const logoutButtons = document.querySelectorAll('.logout-btn');
        
        if (user) {
            // User is logged in
            loginButtons.forEach(btn => btn && (btn.style.display = 'none'));
            logoutButtons.forEach(btn => btn && (btn.style.display = 'block'));
        } else {
            // User is logged out
            loginButtons.forEach(btn => btn && (btn.style.display = 'block'));
            logoutButtons.forEach(btn => btn && (btn.style.display = 'none'));
        }
    }
    
    // Login handling functions
    function handleLoginSubmit() {
        const isPhoneMethod = loginPhoneBtn?.classList.contains('active');
        const email = document.getElementById('loginEmail')?.value;
        const phone = document.getElementById('loginPhone')?.value;
        const password = document.getElementById('loginPassword')?.value;
        
        if (isPhoneMethod) {
            handlePhoneLogin(phone);
        } else {
            handleEmailLogin(email, password);
        }
    }
    
    function handlePhoneLogin(phone) {
        if (!phone) {
            showError('loginError', 'Please enter a valid phone number');
            return;
        }
        
        const phoneNumber = '+91' + phone; // Add country code for India
        const appVerifier = recaptchaVerifier;
        
        auth.signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                verificationId = confirmationResult.verificationId;
                if (loginOtpGroup) loginOtpGroup.style.display = 'block';
                showError('loginError', 'OTP sent to your phone!', 'success');
            })
            .catch((error) => {
                showError('loginError', getFriendlyAuthError(error));
            });
    }
    
    function handleEmailLogin(email, password) {
        if (!email || !password) {
            showError('loginError', 'Please enter both email and password');
            return;
        }
        
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                redirectAfterLogin();
            })
            .catch((error) => {
                showError('loginError', getFriendlyAuthError(error));
            });
    }
    
    function verifyOtp() {
        const otp = document.getElementById('loginOtp')?.value;
        
        if (!otp || otp.length !== 6) {
            showError('loginError', 'Please enter a valid 6-digit OTP');
            return;
        }
        
        const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, otp);
        
        auth.signInWithCredential(credential)
            .then(() => {
                redirectAfterLogin();
            })
            .catch((error) => {
                showError('loginError', getFriendlyAuthError(error));
            });
    }
    
    // Redirection function
    function redirectAfterLogin() {
        // Get the redirect URL from URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        let redirectUrl = urlParams.get('redirectUrl') || localStorage.getItem('redirectAfterLogin');
        
        // Validate the redirect URL
        if (redirectUrl && isValidRedirectUrl(redirectUrl)) {
            localStorage.removeItem('redirectAfterLogin');
            window.location.href = redirectUrl;
        } else {
            // Default redirect to vd9ai.html
            window.location.href = 'index.html';
        }
    }
    
    function isValidRedirectUrl(url) {
        // List of allowed redirect URLs
        const allowedUrls = [
            'vd9ai.html',
            'vd10ai.html',
            'vd11ai.html',
            'vd12ai.html',
            'vd11cs.html',
            'vd12cs.html'
        ];
        
        // Check if the URL ends with any of the allowed paths
        return allowedUrls.some(allowedUrl => url.endsWith(allowedUrl));
    }
    
    function getFriendlyAuthError(error) {
        switch(error.code) {
            case 'auth/invalid-email':
                return 'Please enter a valid email address';
            case 'auth/user-disabled':
                return 'This account has been disabled';
            case 'auth/user-not-found':
                return 'No account found with this email';
            case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later';
            case 'auth/invalid-verification-code':
                return 'Invalid OTP. Please try again';
            case 'auth/missing-verification-code':
                return 'Please enter the OTP';
            case 'auth/invalid-phone-number':
                return 'Please enter a valid phone number with country code';
            default:
                return 'Login failed. Please try again';
        }
    }
    
    function showError(elementId, message, type = 'error') {
        const errorElement = document.getElementById(elementId);
        if (!errorElement) return;
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = type === 'success' ? 'green' : 'red';
        
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
});