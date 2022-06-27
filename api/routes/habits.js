const express = require("express");
const router = express.Router();

const habitsController = require("../controllers/habits");

router.post("/", habitsController.create);
// router.get('/', usersController.index)
// router.get('/:username', usersController.show)
// router.delete('/:id', usersController.destroy)

module.exports = router;
