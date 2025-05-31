// Firebase configuration
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

// Firebase Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log("User is signed in:", user);
        
        // If on login/signup page, redirect to dashboard
        if (window.location.pathname.includes('index.html') || 
            window.location.pathname.includes('signup.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // User is signed out
        console.log("User is signed out");
        
        // If on dashboard page, redirect to login
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'index.html';
        }
    }
});

// Global function to show error message
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.remove('hidden');
    setTimeout(() => {
        element.classList.add('hidden');
    }, 5000);
}