// filepath: /workspaces/toastreal/public/firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json'); // Replace with the path to your service account key file

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://toastrealxyz.firebaseio.com' // Replace with your database URL
});

const messaging = admin.messaging();

module.exports = messaging;