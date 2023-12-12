const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');
const rsvpControler = require('../controllers/rsvpController');

router.post('/:id([a-fA-F0-9]{24})/rsvp', rsvpControler.createOrUpdateRsvp);
router.get('/:id([a-fA-F0-9]{24})/rsvp', rsvpControler.createOrUpdateRsvp);



router.get('/', eventController.getEvents);
// router.get('/create', eventController.createOrUpdateEvent);
router.post('/create', eventController.createOrUpdateEvent);

// router.post('/:id/delete', eventController.deleteEvent);

router.get('/:id([a-fA-F0-9]{24})', eventController.getEvent);
router.post('/:id([a-fA-F0-9]{24})/update', eventController.createOrUpdateEvent);
router.get('/:id([a-fA-F0-9]{24})/update', eventController.createOrUpdateEvent);

// Matches POST request for RSVP with specific ID format

module.exports = router;
