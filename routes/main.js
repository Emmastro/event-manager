const express = require('express');
const router = express.Router();
const path = require('path');
const ejs = require('ejs');


const mainController = require('../controllers/mainController');
const eventController = require('../controllers/eventController');


router.get('/', mainController.homePage);

router.get('/', async (req, res) => {
    const isLogin = req.session.isAuthenticated;
    const content = await ejs.renderFile(path.join(__dirname, '..', 'views', 'index.ejs'), { events, isLogin });
    res.render('partials/layout', { body: content, isLogin: isLogin });
});

router.get('/about-us', mainController.aboutPage);

router.get('/contact-us', mainController.contactPage);

router.get('/events', eventController.getEvents);

router.get('/events/create', eventController.createEvent);
router.get('/events/:id', eventController.getEvent);
// router.post('/events/create', eventController.createEvent);

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
