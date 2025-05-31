document.addEventListener('DOMContentLoaded', function() {
    // Firebase configuration (replace with your actual config)
    const firebaseConfig = {
        apiKey: "AIzaSyBITF0Fh_vCJddNeyURWWyprLCOYB2h7Cc",
        authDomain: "sign-up-page-fe4f7.firebaseapp.com",
        projectId: "sign-up-page-fe4f7",
        storageBucket: "sign-up-page-fe4f7.firebasestorage.app",
        messagingSenderId: "339652230724",
        appId: "1:339652230724:web:ba50630f42259219a8c611"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // Check authentication state
    auth.onAuthStateChanged(user => {
        if (!user) {
            // No user is signed in, redirect to login
            window.location.href = 'index.html';
        } else {
            // User is signed in, display their info
            displayUserProfile(user);
        }
    });

    // Display user profile function
    function displayUserProfile(user) {
        // User name
        document.getElementById('userName').textContent = user.displayName || 'User';
        
        // Email (if available)
        document.getElementById('userEmail').textContent = user.email || 'No email provided';
        
        // Profile picture (or generate from name)
        if (user.photoURL) {
            document.getElementById('profileAvatar').src = user.photoURL;
        } else {
            const name = user.displayName || 'User Name';
            document.getElementById('profileAvatar').src = `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(name)}`;
        }
        
        // Account creation date (formatted)
        const creationDate = new Date(user.metadata.creationTime);
        document.getElementById('accountCreated').textContent = creationDate.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Last sign-in date (formatted)
        const lastSignIn = new Date(user.metadata.lastSignInTime);
        document.getElementById('lastLogin').textContent = lastSignIn.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Authentication method (with proper formatting)
        let authMethod = 'Email/Password'; // default
        if (user.providerData && user.providerData.length > 0) {
            const provider = user.providerData[0].providerId;
            authMethod = provider
                .replace('password', 'Email/Password')
                .replace('phone', 'Phone Number')
                .replace('google.com', 'Google')
                .replace('facebook.com', 'Facebook')
                .replace('github.com', 'GitHub');
        }
        document.getElementById('authMethod').textContent = authMethod;
        
        // Phone number (if available)
        if (user.phoneNumber) {
            document.getElementById('phoneNumberSection').style.display = 'block';
            document.getElementById('phoneNumber').textContent = user.phoneNumber;
        }
    }

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        // Show loading state
        this.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Logging out...';
        this.disabled = true;
        
        auth.signOut().then(() => {
            // Redirect to login page after successful logout
            window.location.href = 'index.html';
        }).catch(error => {
            console.error('Logout error:', error);
            alert('Error signing out. Please try again.');
            this.innerHTML = 'Logout';
            this.disabled = false;
        });
    });
});