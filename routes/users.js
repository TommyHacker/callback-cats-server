const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

// isAuthenticted will authenticate the user if they have sent accessToken in headers
// if not valid token or token doesnt exist they will recieve "NOT ALLOWED"
const { isAuthenticated } = require('../middlewares/gateKeeper');

// isAdmin has to be included AFTER isAuthenticated.
// isAuthenticated provides user data within res.locals.currentUser
// isAdmin just checks true/false for res.locals.isAdmin?
const { isAdmin } = require('../middlewares/isAdmin');

router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.get('/:id', isAuthenticated, usersController.findUserById);
router.get('/', isAuthenticated, usersController.findAllUsers);
router.get('/:id/habits', isAuthenticated, usersController.findUserHabits);
router.delete('/:id', isAuthenticated, isAdmin, usersController.deleteUserById);

module.exports = router;
