const express = require("express");
const router = express.Router();
const habitsController = require("../controllers/habits");
const userSchema = require("../models/userSchema");
const { isAuthenticated } = require("../middlewares/gateKeeper");
const daysController = require('../controllers/days');

// router.get('/:id', habitsController.findHabitById);
router.post("/", isAuthenticated, habitsController.createHabit);
// router.get("/:id", habitsController.findHabitById)
// router.get('/', usersController.index)
// router.get('/:username', usersController.show)
// router.delete('/:id', usersController.destroy)
router.put('/:id', isAuthenticated, daysController.updateHabitCounter)

// userSchema.habit[]
// router.put("/:id", habitsController.increment);

module.exports = router;
