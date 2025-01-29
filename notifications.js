// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAIi3_sc81JogKi_UjMGYqUMvsf4WBDJPc",
    authDomain: "toastrealxyz.firebaseapp.com",
    projectId: "toastrealxyz",
    storageBucket: "toastrealxyz.appspot.com",
    messagingSenderId: "774884910313",
    appId: "1:774884910313:web:e11002887adf1055acfc78",
    measurementId: "G-3H38LZB2BX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load notifications
function loadNotifications() {
    db.collection('notifications').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        const notificationsContainer = document.getElementById('notifications-container');
        notificationsContainer.innerHTML = '';
        snapshot.forEach(doc => {
            const notification = doc.data();
            const notificationElement = document.createElement('div');
            notificationElement.className = 'notification';
            notificationElement.innerText = notification.message;
            notificationsContainer.appendChild(notificationElement);
        });
    });
}

// Load notifications on page load
window.onload = loadNotifications;