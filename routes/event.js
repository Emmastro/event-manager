const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

const eventController = require('../controllers/eventController');
const rsvpControler = require('../controllers/rsvpController');

router.post('/:id([a-fA-F0-9]{24})/rsvp', isAuthenticated, rsvpControler.createOrUpdateRsvp);
router.get('/:id([a-fA-F0-9]{24})/rsvp', isAuthenticated, rsvpControler.createOrUpdateRsvp);

router.get('/', eventController.getEvents);
router.get('/create', isAuthenticated, eventController.createOrUpdateEvent);
router.post('/create', isAuthenticated, eventController.createOrUpdateEvent);

router.post('/:id/delete', isAuthenticated, eventController.deleteEvent);

router.get('/:id([a-fA-F0-9]{24})', eventController.getEvent);
router.post('/:id([a-fA-F0-9]{24})/update', isAuthenticated, eventController.createOrUpdateEvent);
router.get('/:id([a-fA-F0-9]{24})/update', isAuthenticated, eventController.createOrUpdateEvent);

// Matches POST request for RSVP with specific ID format

module.exports = router;
