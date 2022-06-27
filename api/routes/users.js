const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users");

router.post("/", usersController.create);
router.get("/", usersController.findAll);
router.get("/:id", usersController.findById);
router.delete("/:id", usersController.deleteById);

module.exports = router;
