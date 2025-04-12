// filepath: /workspaces/toastreal/public/server.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const messaging = require('./firebaseAdmin'); // Import the Firebase Admin module
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'averysecretkey',
    resave: false,
    saveUninitialized: false
}));

// Middleware to remove .html
app.use((req, res, next) => {
    if (req.url.endsWith('.html')) {
        const newUrl = req.url.slice(0, -5);
        if (fs.existsSync(path.join(__dirname, req.url))){
          next();
        } else if (fs.existsSync(path.join(__dirname, 'public', newUrl + ".html"))){
            res.redirect(301, newUrl);
        } else{
          next();
        }
    } else {
        next();
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/accounts', (req, res) => {
    res.sendFile(__dirname + '/public/accounts.html');
});

app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/public/profile.html');
});

app.get('/soon', (req, res) => {
    res.sendFile(__dirname + '/public/soon.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

// Serve static files
app.use(express.static('public'));

// Endpoint to send notifications
app.post('/send-notification', (req, res) => {
    const { token, title, body } = req.body;

    const message = {
        notification: {
            title: title,
            body: body
        },
        token: token
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

// serve html files without .html extension.
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, 'public', req.url + '.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Page not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});