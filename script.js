// server.js (Node.js with Express)
const express = require('express');
const bodyParser = require('body-parser'); // For parsing form data
const session = require('express-session'); // For managing user sessions

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ // Configure session management
    secret: 'averysecretkey', // Change this to a strong, random key
    resave: false,
    saveUninitialized: false
}));

// Mock database (in a real app, use a database like MongoDB, MySQL, etc.)
const users = {
    'gyat': 'gyat123',
};

app.get('/', (req, res) => {
    if (req.session.authenticated) {
        res.send('<h1>Welcome to the protected area!</h1>'); // Show protected content
    } else {
        res.sendFile(__dirname + '/login.html'); // Send login form
    }
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (users[username] && users[username] === password) { // In real app, hash passwords!
        req.session.authenticated = true;
        res.redirect('/');
    } else {
        res.send('Login failed');
    }
});

app.listen(3000, () => console.log('Server started on port 3000'));