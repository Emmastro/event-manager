const express = require('express');
const router = express.Router();

const mainController = require('../controllers/mainController');

router.get('/', mainController.homePage);
router.get('/about-us', mainController.aboutPage);
router.get('/contact-us', mainController.contactPage);
router.post('/contact-us', mainController.contactPage);


module.exports = router;
