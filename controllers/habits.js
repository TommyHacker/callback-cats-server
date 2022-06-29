const Habit = require('../models/habitsSchema');
const User = require('../models/userSchema');

// CREATE NEW HABIT ✔️

async function createHabit(req, res) {
  try {
    const { habitType, frequencyPerDay } = req.body;

    const userId = res.locals.currentUser.id;

    const day = new Day({ date: Date().slice(0, 15) });
    const habit = new Habit({ habitType, frequencyPerDay, days: [day] });

    await User.findOneAndUpdate(
      { _id: userId, 'habits.habitType': { $ne: habitType } },
      { $addToSet: { habits: habit } }
    );

    res.status(201).json({
      status: 201,
      message: `Type ${habitType} habit successfully created for user ${userId}`,
    });
  } catch (err) {
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
