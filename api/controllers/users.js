const User = require("../models/userSchema");

// CREATE NEW USER ✔️

async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, password, email });
    await user.save();
    res.status(201).json({
      status: 201,
      username: username,
      message: "User successfully created",
    });
  } catch (err) {
    res.status(422).json({ err });
  }
}

// GET ALL USERS ✔️
async function findAllUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 200,
      data: users,
      message: "Users successfully  retrieved",
    });
  } catch (err) {
    res.status(500).json({ err });
  }
}

// FIND USER BY ID ✔️

async function findUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: 200,
      data: user,
      message: "User successfully retrieved",
    });
  } catch (err) {
    res.status(404).json({ err });
  }
}

// FIND USER HABITS ✔️

async function findUserHabits(req, res) {
  try {
    const user = await User.findById(req.params.id, { habits: 1, _id: 0 });
    res.status(200).json({
      status: 200,
      data: user,
      message: "User successfully retrieved",
    });
  } catch (err) {
    res.status(404).json({ err });
  }
}

// DELETE USER  BY ID ✔️

async function deleteUserById(req, res) {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);

    res.status(204).end();
  } catch (err) {
    res.status(404).json({ err });
  }
}


module.exports = { createUser, findAllUsers, findUserById, findUserHabits, deleteUserById };
