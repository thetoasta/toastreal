const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Firebase Admin SDK Init (replace with your credentials JSON file)
const serviceAccount = require('./path-to-your-service-account-file.json'); // Update with the actual path
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const messaging = admin.messaging();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'averysecretkey',
    resave: false,
    saveUninitialized: false,
}));

// Middleware to handle .html file extensions
app.use((req, res, next) => {
    if (req.url.endsWith('.html')) {
        const newUrl = req.url.slice(0, -5);
        const htmlFilePath = path.join(__dirname, 'public', req.url);
        const newHtmlFilePath = path.join(__dirname, 'public', newUrl + '.html');

        if (fs.existsSync(htmlFilePath)) {
            next();
        } else if (fs.existsSync(newHtmlFilePath)) {
            res.redirect(301, newUrl);
        } else {
            next();
        }
    } else {
        next();
    }
});

// Route handlers
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/accounts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'accounts.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/soon', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'soon.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serving static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Notification endpoint
app.post('/send-notification', (req, res) => {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
        return res.status(400).send('Missing required fields');
    }

    const message = {
        notification: {
            title: title,
            body: body,
        },
        token: token,
    };

    messaging.send(message)
        .then(response => {
            console.log('Successfully sent message:', response);
            res.status(200).send('Notification sent successfully');
        })
        .catch(error => {
            console.error('Error sending message:', error);
            res.status(500).send('Error sending notification');
        });
});

// Catch-all route for unknown URLs
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, 'public', req.url + '.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Page not found');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});