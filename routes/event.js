const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');
const rsvpControler = require('../controllers/rsvpController');

router.get('/', eventController.getEvents);
router.get('/create', eventController.createOrUpdateEvent);
router.post('/create', eventController.createOrUpdateEvent);

router.get('/:id', eventController.getEvent);
router.post('/:id/update', eventController.createOrUpdateEvent);
router.get('/:id/update', eventController.createOrUpdateEvent);

router.post('/:id/delete', eventController.deleteEvent);

router.post('/:id/rsvp', rsvpControler.createOrUpdateRsvp);
router.get('/:id/rsvp', rsvpControler.createOrUpdateRsvp);




module.exports = router;
