const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// load env 
require('dotenv').config();

// TODO: pull events from the database

const userProfile = {
    name: 'John Doe',
    email: 'emmamurairi@gmail.com',
    isLogin: true
}
const events = [
    { title: 'Alumni Gathering', date: '2023-11-05', location: 'Auditorium', description: 'A gathering of all alumni in Tech .' },
    { title: 'Tech Talk', date: '2023-11-10', location: 'Hall B', description: 'Talk on upcoming tech trends.' },
    // ... other events ...
];
app.get('/', async (req, res) => {
    const content = await ejs.renderFile(path.join(__dirname, 'views', 'index.ejs'), { events });
    res.render('partials/layout', { body: content });
});

app.get('/about-us', async(req, res) => {
    const content = await ejs.renderFile(path.join(__dirname, 'views', 'about-us.ejs'), { events });
    res.render('partials/layout', { body: content });
});

app.get('/contact-us', async(req, res) => {
    const content = await ejs.renderFile(path.join(__dirname, 'views', 'contact-us.ejs'), { events });
    res.render('partials/layout', { body: content });

});
app.get('/register', async (req, res) => {
    // Example data to pass into the view
    const years = [
        { value: 2023, label: '2023' },
        { value: 2022, label: '2022' }
        // Add more years as needed
    ];

    const content = await ejs.renderFile(path.join(__dirname, 'views', 'register.ejs'), { years });

    res.render('partials/layout', { body: content });
});

// Handle registration form submission
app.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.redirect('/event');  // Redirect to a success page or wherever you like
    } catch (err) {
        res.status(500).send(err.message);
    }
});


const MONGODB_URI = process.env.MONGODB_URI;

console.log("Mongodb uri", MONGODB_URI)

mongoose.connect(MONGODB_URI, 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(error => {
        console.error("Error connecting to MongoDB:", error);
    });

app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 
