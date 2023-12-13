const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');


const userController = require('../controllers/userController');

router.post('/create', isAuthenticated, isAdmin, userController.createOrUpdateUser);
router.get('/create', isAuthenticated, isAdmin, userController.createOrUpdateUser);
// router.get('/:id([a-fA-F0-9]{24})/update', userController.getUpdateUserForm);
// router.post('/:id([a-fA-F0-9]{24})/update', userController.updateUser);
// router.post('/:id([a-fA-F0-9]{24})/delete', userController.deleteUser);
// router.get('/:id([a-fA-F0-9]{24})', userController.getUser);
router.get('/', isAuthenticated, isAdmin, userController.getUsers);

module.exports = router;
