const express = require('express');
const router = express.Router();
const path = require('path');
const ejs = require('ejs');

// TODO: move database access to controllers
const events = [
    { title: 'Alumni Gathering', date: '2023-11-05', location: 'Auditorium', description: 'A gathering of all alumni in Tech .' },
    { title: 'Tech Talk', date: '2023-11-10', location: 'Hall B', description: 'Talk on upcoming tech trends.' },
    // ... other events ...
];


router.get('/', async (req, res) => {
    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'index.ejs'), { events });
    res.render('partials/layout', { body: content });
});

const userProfile = {
    name: 'John Doe',
    email: 'emmamurairi@gmail.com',
    isLogin: true
}

router.get('/', async (req, res) => {
    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'index.ejs'), { events });
    res.render('partials/layout', { body: content });
});

router.get('/about-us', async(req, res) => {
    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'about-us.ejs'), { events });
    res.render('partials/layout', { body: content });
});

router.get('/contact-us', async(req, res) => {
    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'contact-us.ejs'), { events });
    res.render('partials/layout', { body: content });
});

router.get('/event', async(req, res) => {
    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'event.ejs'), { events });
    res.render('partials/layout', { body: content });
}
);

router.post('/submit-contact', (req, res) => {
    // TODO: Handle contact data submission logic here
    // Store the contact message in a database, send an email notification, etc.

    res.redirect('/thankyou');  // Redirect to a thank you page or any other action you prefer.
});


router.post('/submit-contact', (req, res) => {
    // ... Handle contact data submission logic here ...
    res.redirect('/thankyou');
});

module.exports = router;
