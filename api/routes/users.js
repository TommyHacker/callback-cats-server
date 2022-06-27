const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");

// isAuthenticted can be injected into any route
// it will authenticate the user if they have sent accessToken in headers
// if valid they will continue with their correct user detials
// if not valid token or token doesnt exist (cause they didnt log in) then they will recieve "NOT ALLOWED"
const { isAuthenticated } = require("../middlewares/gateKeeper");

// router.post("/register", usersController.create);
// router.post("/login", usersController.login);
// router.get("/", isAuthenticated, usersController.findAll); // checks if they are authenticated user first
// router.get("/:id", isAuthenticated, usersController.findById);
// router.delete("/:id", usersController.deleteById); // checks if they are authenticated before deleting their account

router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.get("/", isAuthenticated, usersController.findAllUsers);
router.get("/:id", isAuthenticated, usersController.findUserById);
router.get("/:id/habits", isAuthenticated, usersController.findUserHabits);
router.delete("/:id", isAuthenticated, usersController.deleteUserById);

module.exports = router;
