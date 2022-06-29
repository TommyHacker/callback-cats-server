const Habit = require("../models/habitsSchema");
const User = require("../models/userSchema");
const Day = require("../models/daysSchema");
const { habitFormatter } = require("../helpers/habitTypeFormatter");

// CREATE NEW HABIT ✔️

async function createHabit(req, res) {
  try {
    const habitType = req.body.habit;
    const frequencyPerDay = req.body.frequency;

    let habitNum = habitType.split("")[5];
    console.log("habitnum", habitNum);

    const userId = res.locals.currentUser.id;

    const day = new Day({ date: Date().slice(0, 15) });
    const habit = new Habit({ habitType, frequencyPerDay, days: [day] });

    const user = await User.findOneAndUpdate(
      { _id: userId, "habits.habitType": { $ne: habitNum } },
      { $addToSet: { habits: habit } }
    );

    res.status(201).json({
      status: 201,
      message: `Type ${habitFormatter(
        habitNum
      )} habit successfully created for user ${userId}`,
    });
  } catch (err) {
    console.log("there has been an error");
    console.log(err.message);
    res.status(422).json({ err });
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

module.exports = {
  createHabit /* findHabitById */ /* , index, show, destroy  */,
};
