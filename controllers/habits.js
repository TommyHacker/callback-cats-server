const Habit = require("../models/habitsSchema");
const User = require("../models/userSchema");

// CREATE NEW HABIT ✔️

async function createHabit(req, res) {
  try {
    const { userId, habitType, frequencyPerDay } = req.body;
    const habit = new Habit({ habitType, frequencyPerDay });

    const userUpdate = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { habits: habit } }
    );
    res.status(201).json({
      status: 201,
      message: `Type ${habitType} habit successfully created for user ${id}`,
    });
  } catch (err) {
    res.status(422).json({ err });
  }
}

// FIND HABIT BY ID ❌

async function findHabitById(req, res) {
  try {
 
    const habit = await User.find(
      { },
      { "users.habits._id" : { $elemMatch :  { _id: req.params.id } } }
    );

    res.status(200).json({
      status: 200,
      data: habit,
      message: "Habit successfully retrieved",
    });
  } catch (err) {
    res.status(404).json({ err });
  }
}

// FIND ALL HABITS  ✔️ (REMOVE ROUTE, THE QUERY WIll HELP TO ADD A NEW DAY INPUT COUNTER EVERY DAY WITH NODE-CRON)

async function findAllHabits(req, res) {
  try {
    const habits = await User.find({}).select("habits");
    res.status(200).json({
      status: 200,
      data: habits,
      message: "Habits successfully  retrieved",
    });
  } catch (err) {
    res.status(500).json({ err });
  }
}

// // DELETE HABIT  BY ID

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

module.exports = {
  createHabit,
  findHabitById,
  findAllHabits /* , index, show, destroy  */,
};
