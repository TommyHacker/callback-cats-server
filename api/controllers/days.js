const Habit = require("../models/habitsSchema");
const User = require("../models/userSchema");

// CREATE NEW HABIT ✔️

async function addDayInputCounter(req, res) {
  try {
    const { username, habitType, frequencyPerDay } = req.body;
    const habit = new Habit({ habitType, frequencyPerDay });

    const user = await User.findOneAndUpdate(
      { username: username },
      { $push: { habits: habit } }
    );
    res.status(201).json({
      status: 201,
      message: `Type ${habitType} successfully created for ${username}`,
    });
  } catch (err) {
    res.status(422).json({ err });
  }
}

module.exports = { addDayInputCounter };
