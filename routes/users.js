const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');


const userController = require('../controllers/userController');

router.post('/create', isAuthenticated, isAdmin, userController.createOrUpdateUser);
router.get('/create', isAuthenticated, isAdmin, userController.createOrUpdateUser);
router.get('/:id([a-fA-F0-9]{24})/update', isAuthenticated, isAdmin, userController.createOrUpdateUser);
router.post('/:id([a-fA-F0-9]{24})/update', isAuthenticated, isAdmin, userController.createOrUpdateUser);
router.get('/:id([a-fA-F0-9]{24})/delete', isAuthenticated, isAdmin, userController.deleteUser);
router.get('/', isAuthenticated, isAdmin, userController.getUsers);

module.exports = router;
