const express = require("express");
const router = express.Router();

const { isAuthenticated } = require('../middlewares/gateKeeper');

const habitsController = require("../controllers/habits");

router.post("/", isAuthenticated, habitsController.createHabit);
// router.get("/:id", habitsController.findHabitById)
// router.get('/', usersController.index)
// router.get('/:username', usersController.show)
// router.delete('/:id', usersController.destroy)

module.exports = router;
