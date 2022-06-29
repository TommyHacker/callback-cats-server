const express = require('express');
const router = express.Router();
const habitsController = require('../controllers/habits');
const userSchema = require('../models/userSchema');
const { isAuthenticated } = require('../middlewares/gateKeeper');

router.get('/:id', habitsController.findHabitById);
router.post('/', isAuthenticated, habitsController.createHabit);
// router.get("/:id", habitsController.findHabitById)
// router.get('/', usersController.index)
// router.get('/:username', usersController.show)
// router.delete('/:id', usersController.destroy)

// userSchema.habit[]
router.put('/:id', habitsController.increment);

module.exports = router;
