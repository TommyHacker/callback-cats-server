const Habit = require("../models/habitsSchema");
const User = require("../models/userSchema");
const Day = require("../models/daysSchema");
const { habitFormatter } = require("../helpers/habitTypeFormatter");

// CREATE NEW HABIT ✔️

async function createHabit(req, res) {
  try {
    const userId = res.locals.currentUser.id;

    // const userId = req.body.id; /* FOR LOCAL TESTING */
    console.log(req.body);
    const habitType = req.body.habit;
    const frequencyPerDay = req.body.frequency;

    const day = new Day({ date: Date().slice(0, 15) });
    const habit = new Habit({ habitType, frequencyPerDay, days: [day] });

    await User.findOneAndUpdate(
      { _id: userId, "habits.habitType": { $ne: habitType } },
      { $addToSet: { habits: habit } }
    );

    res.status(201).json({
      status: 201,
      message: `Type ${habitFormatter(
        habitType
      )} "habit successfully created for user`,
    });
  } catch (err) {
    console.log("there has been an error");
    console.log(err.message);
    res.status(422).json({ err: err.message });
  }
}

// FIND HABIT BY ID (NOT ESSENTIAL)

// async function findHabitById(req, res) {

//   try {
//     const habit = User.findOne({"habits._id": req.params.id })
//     res.status(200).json({
//       status: 200,
//       data: habit,
//       message: "Habit successfully retrieved",
//     });
//   } catch (err) {
//     res.status(404).json({ err });
//   }
// }

// // DELETE HABIT  BY ID (NON-ESSENTIAL)

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

async function deleteHabit(req, res) {
  console.log("user id", res.locals.currentUser.id);
  console.log("habit id", req.params.id);
  try {
    const userId = res.locals.currentUser.id;
    const habitId = req.params.id;

    const user = await User.findById(userId);

    // filter through all habits, return them all into a new array EXCEPT if id === chosen id;
    const newHabits = await user.habits.filter((habit) => {
      if (habit._id != habitId) return habit;
    });
    // replace user.habits with the new array and save
    user.habits = [...newHabits];
    await user.save();
    console.log("IT WORKED!");
    res
      .status(200)
      .json({ success: true, message: "habit removed", data: user.habits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  createHabit,
  deleteHabit /* findHabitById */ /* , index, show, destroy  */,
};
