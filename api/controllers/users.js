const User = require("../models/userSchema");
const { hashPassword, verifyPassword } = require("../helpers/passwordHelpers");
const {
  createToken,
  verifyToken,
  decodeToken,
} = require("../helpers/tokenHelpers");

// CREATE NEW USER

async function create(req, res) {
  try {
    const { username, email, password } = req.body;

    //hash the password before creating the user.
    const hashedPassword = hashPassword(password);

    const user = new User({ username, password: hashedPassword, email });

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

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    // did user give the correct password?
    const verified = await verifyPassword(password, user.password);
    // if password was incorrect return error response.
    if (!verified)
      return res
        .status(401)
        .json({ success: false, message: "username or password incorrect." });
    // if password was correct gen new token with their ID and send ready for client session storage
    const accesstoken = createToken(user.id);
    res.status(204).json({
      success: true,
      message: "logged in successfully.",
      data: accesstoken,
    });
  } catch (err) {
    res.status(500).json({ err });
  }
}

// GET ALL USERS
async function findAll(req, res) {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 200,
      data: users,
      message: "Users successfully retrieved",
    });
  } catch (err) {
    res.status(500).json({ err });
  }
}

// FIND USER BY USERNAME

async function findById(req, res) {
  try {
    const user = await User.findById(res.locals.currentUser.id);
    res.status(200).json({
      status: 200,
      data: user,
      message: "User successfully retrieved",
    });
  } catch (err) {
    res.status(404).json({ err });
  }
}

// DELETE USER  BY ID

async function deleteById(req, res) {
  try {
    const user = res.locals.currentUser;
    const id = req.params.id;
    // check if id matches authenticated users id
    if (user._id !== id)
      return res.status({ success: false, message: "not allowed." });
    await User.findByIdAndDelete(user._id);
    res.status(204).json({
      status: 204,
      message: `${user.username} successfully deleted`,
    });
  } catch (err) {
    res.status(404).json({ err });
  }
}

module.exports = { create, findAll, findById, deleteById, login };
