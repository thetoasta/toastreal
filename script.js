const express = require('express');
const session = require('express-session');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // Important: Parses form data
app.use(express.static('public')); // Serves static files (like login.html)
app.use(session({
    secret: '53454t2f345cfn40j79dc7f', // Change this in production!
    resave: false,
    saveUninitialized: false
}));

// Mock user data (replace with a database in real apps)
const users = {
    'gyat': 'gyat123'
};

// Routes
app.get('/', (req, res) => {
    if (req.session.authenticated) {
        res.send('<h1>Welcome to the protected area!</h1>');
    } else {
        res.sendFile(__dirname + 'index.html');
    }
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (users[username] && users[username] === password) {
        req.session.authenticated = true;
        res.redirect('/');
    } else {
        res.send('Login failed');
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));