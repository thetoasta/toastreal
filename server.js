const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'averysecretkey',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    if (req.url.endsWith('.html')) {
        const newUrl = req.url.slice(0, -5);
        const htmlFilePath = path.join(__dirname, 'public', req.url);
        const newHtmlFilePath = path.join(__dirname, 'public', newUrl + '.html');

        console.log(`Requested URL: ${req.url}`);
        console.log(`HTML File Path: ${htmlFilePath}`);
        console.log(`New HTML File Path: ${newHtmlFilePath}`);

        if (fs.existsSync(htmlFilePath)) {
            console.log(`Serving original .html file: ${htmlFilePath}`);
            next();
        } else if (fs.existsSync(newHtmlFilePath)) {
            console.log(`Redirecting to: ${newUrl}`);
            res.redirect(301, newUrl);
        } else {
            console.log("file not found");
            next();
        }
    } else {
        next();
    }
});

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

app.use(express.static('public'));

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

app.get('*', (req, res) => {
    const filePath = '/workspaces/toastreal/public' + req.url + '.html'; // Use absolute path
    console.log(`Catch-all route: File Path: ${filePath}`);
  
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('Page not found');
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});