const Habit = require("../models/habitsSchema");
const User = require("../models/userSchema");

// CREATE NEW USER

async function create(req, res) {
  try {
    const { username, habitType, frequencyPerDay } = req.body;
    const habit = new Habit({ habitType, frequencyPerDay });

    const user = await User.findOneAndUpdate(
      { username: username },
      { $push: { habits: habit } }
    );
    res.status(201).json({
      status: 201,
      message: `Habit successfully created for ${username}`,
    });
  } catch (err) {
    res.status(422).json({ err });
  }
}

// TO EDIT

// GET ALL HABITS FROM A USER
// async function index(req, res) {
//   try {
//     const users = await User.find();
//     res.status(200).json({
//       status: 200,
//       data: users,
//       message: "Users successfully  retrieved",
//     });
//   } catch (err) {
//     res.status(500).json({ err });
//   }
// }

// // FIND USER BY USERNAME

// async function show(req, res) {
//   try {
//     const user = await User.findOne({ username: req.body.username });
//     res.status(200).json({
//       status: 200,
//       data: user,
//       message: "User successfully retrieved",
//     });
//   } catch (err) {
//     res.status(404).json({ err });
//   }
// }

// // DELETE USER  BY ID

// async function destroy(req, res) {
//   try {
//     const id = req.params.id;
//     await User.findByIdAndDelete(id);

//     res.status(204).json({
//       status: 204,
//       username: username,
//       message: "User successfully deleted",
//     });
//   } catch (err) {
//     res.status(404).json({ err });
//   }
// }

module.exports = { create/* , index, show, destroy  */};
