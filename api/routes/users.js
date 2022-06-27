const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users");

router.post("/", usersController.createUser);
router.get("/", usersController.findAllUsers);
router.get("/:id", usersController.findUserById);
router.get("/:id/habits", usersController.findUserHabits)
router.delete("/:id", usersController.deleteUserById);

module.exports = router;
