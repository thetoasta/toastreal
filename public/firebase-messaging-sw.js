// Import the Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-messaging.js');

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAIi3_sc81JogKi_UjMGYqUMvsf4WBDJPc", // Replace with your config
    authDomain: "toastrealxyz.firebaseapp.com",
    projectId: "toastrealxyz",
    storageBucket: "toastrealxyz.appspot.com",
    messagingSenderId: "774884910313",
    appId: "1:774884910313:web:e11002887adf1055acfc78",
    measurementId: "G-3H38LZB2BX"
};

firebase.initializeApp(firebaseConfig);

// Get the Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/images/toastlogo.ico' // Replace with your icon path
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

console.log("service worker loaded");