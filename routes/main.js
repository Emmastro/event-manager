const express = require('express');
const router = express.Router();

const mainController = require('../controllers/mainController');

router.get('/', mainController.homePage);
router.get('/about-us', mainController.aboutPage);
router.get('/contact-us', mainController.contactPage);
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
