const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/gateKeeper');
const { isAdmin } = require('../middlewares/isAdmin');
const adminControllers = require('../controllers/adminControllers');

router.use(isAuthenticated, isAdmin);

router.get('/', adminControllers.getAllUsers);
router.post('/', adminControllers.createNewUser);
router.get('/:id', adminControllers.getOneUser);
router.put('/:id', adminControllers.updateOneUser);
router.delete('/:id', adminControllers.deleteUser);

module.exports = router;
