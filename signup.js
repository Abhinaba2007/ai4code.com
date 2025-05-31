document.addEventListener('DOMContentLoaded', function() {
    // Toggle between email and phone signup
    const signupEmailBtn = document.getElementById('signupEmailBtn');
    const signupPhoneBtn = document.getElementById('signupPhoneBtn');
    const signupEmailGroup = document.getElementById('signupEmailGroup');
    const signupPhoneGroup = document.getElementById('signupPhoneGroup');
    const signupOtpGroup = document.getElementById('signupOtpGroup');
    const signupForm = document.getElementById('signupForm');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verifySignupOtpBtn = document.getElementById('verifySignupOtpBtn');
    const passwordInput = document.getElementById('signupPassword');
    const passwordStrengthBar = document.getElementById('passwordStrengthBar');
    
    let verificationId = null;
    let phoneNumber = null;
    
    signupEmailBtn.addEventListener('click', function() {
        signupEmailGroup.style.display = 'block';
        signupPhoneGroup.style.display = 'none';
        signupEmailBtn.classList.add('active');
        signupPhoneBtn.classList.remove('active');
    });
    
    signupPhoneBtn.addEventListener('click', function() {
        signupEmailGroup.style.display = 'none';
        signupPhoneGroup.style.display = 'block';
        signupEmailBtn.classList.remove('active');
        signupPhoneBtn.classList.add('active');
    });
    
    // Password strength indicator
    passwordInput.addEventListener('input', function() {
        const strength = calculatePasswordStrength(this.value);
        passwordStrengthBar.style.width = strength + '%';
        
        if (strength < 40) {
            passwordStrengthBar.style.backgroundColor = '#dc3545'; // Red
        } else if (strength < 70) {
            passwordStrengthBar.style.backgroundColor = '#ffc107'; // Yellow
        } else {
            passwordStrengthBar.style.backgroundColor = '#28a745'; // Green
        }
    });
    
    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length > 0) strength += Math.min(password.length * 5, 25);
        if (/[A-Z]/.test(password)) strength += 15;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 20;
        if (password.length >= 8) strength += 20;
        return Math.min(strength, 100);
    }
    
    // Send OTP for phone signup
    sendOtpBtn.addEventListener('click', function() {
        phoneNumber = document.getElementById('signupPhone').value;
        
        if (!phoneNumber) {
            showError('signupError', 'Please enter your phone number');
            return;
        }
        
        const appVerifier = new firebase.auth.RecaptchaVerifier('sendOtpBtn', {
            size: 'invisible'
        });
        
        auth.signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                verificationId = confirmationResult.verificationId;
                signupOtpGroup.classList.remove('hidden');
                showError('signupError', 'OTP sent to your phone!');
            })
            .catch((error) => {
                showError('signupError', error.message);
            });
    });
    
    // Verify OTP for phone signup
    verifySignupOtpBtn.addEventListener('click', function() {
        const otp = document.getElementById('signupOtp').value;
        
        if (!otp || otp.length !== 6) {
            showError('signupError', 'Please enter a valid 6-digit OTP');
            return;
        }
        
        const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, otp);
        
        auth.signInWithCredential(credential)
            .then((userCredential) => {
                showError('signupError', 'Phone number verified!');
                verifySignupOtpBtn.disabled = true;
            })
            .catch((error) => {
                showError('signupError', error.message);
            });
    });
    
    // Handle signup form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isPhoneMethod = signupPhoneBtn.classList.contains('active');
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirm').value;
        
        // Validation
        if (password !== confirmPassword) {
            showError('signupError', 'Passwords do not match');
            return;
        }
        
        if (password.length < 8) {
            showError('signupError', 'Password must be at least 8 characters');
            return;
        }
        
        if (isPhoneMethod && (!verificationId || !phoneNumber)) {
            showError('signupError', 'Please verify your phone number first');
            return;
        }
        
        if (isPhoneMethod) {
            // Phone signup
            const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, document.getElementById('signupOtp').value);
            
            auth.currentUser.linkWithCredential(credential)
                .then((userCredential) => {
                    // Update user profile
                    return userCredential.user.updateProfile({
                        displayName: name
                    });
                })
                .then(() => {
                    window.location.href = 'dashboard.html';
                })
                .catch((error) => {
                    showError('signupError', error.message);
                });
        } else {
            // Email signup
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Update user profile
                    return userCredential.user.updateProfile({
                        displayName: name
                    });
                })
                .then(() => {
                    window.location.href = 'dashboard.html';
                })
                .catch((error) => {
                    showError('signupError', error.message);
                });
        }
    });
});