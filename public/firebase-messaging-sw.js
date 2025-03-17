// filepath: /workspaces/toastreal/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-messaging.js');

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
const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});