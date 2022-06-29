const express = require('express');
const router = express.Router();

const habitsController = require('../controllers/habits');
const userSchema = require('../models/userSchema');

router.post('/', habitsController.createHabit);
router.get('/:id', habitsController.findHabitById);
// router.get('/', usersController.index)
// router.get('/:username', usersController.show)
// router.delete('/:id', usersController.destroy)

module.exports = router;

// userSchema.habit[]
router.put('/:id', habitsController.increment);
