const User = require("../models/userSchema");
const Day = require("../models/daysSchema");
const cron = require("node-cron");

const { ObjectId } = require("mongodb");

// SCHEDULE TASK FOR EVERY DAY AT 12 AM

cron.schedule("1 0 0 * * *", () => {
  resetCurrentStreak();
  addDayToAllHabits();
});

async function resetCurrentStreak() {
  let now = new Date();

  let yesterdayDate = new Date(now - 1000 * 60 * 60 * 24 * 1);

  yesterdayDate = yesterdayDate.toString().slice(0, 15);

  console.log(yesterdayDate);

  await User.updateMany(
    {
      habits: {
        $elemMatch: { "days.date": yesterdayDate, "days.fulfilled": false },
      },
    },

    {
      $set: {
        "habits.$.currentStreak": 0,
      },
    }
  );
}

async function addDayToAllHabits() {
  const day = new Day({ date: Date().slice(0, 15) });

  await User.updateMany({}, { $addToSet: { "habits.$[].days": day } });
}

async function updateHabitCounter(req, res) {
  try {
    const userId = res.locals.currentUser.id;
    const habitType = req.body.habitType;

    const dayValues = await getDayValues(userId, habitType);

    let habitId = dayValues[0].habits._id;
    let dayId = dayValues[0].habits.days._id;
    let inputCounter = dayValues[0].habits.days.inputCounter;
    let frequencyPerDay = dayValues[0].habits.frequencyPerDay;
    let bestStreak = dayValues[0].habits.bestStreak;

    await addOneToCounter(userId, habitId, dayId, inputCounter);

    if (inputCounter + 1 >= frequencyPerDay) {
      await markDayAsCompleted(userId, habitId, dayId);
    }

    let currentStreak = await checkAndUpdateCurrentStreak(
      userId,
      habitType,
      habitId
    );

    if (currentStreak > bestStreak) {
      await updateBestStreak(userId, habitId, currentStreak);
    }

    if (currentStreak >= 7) await markHabitAsCompleted(userId, habitId);
    res.status(204).json({
      status: 204,
      message: `Habit counter successfully updated`,
    });
  } catch (err) {

    res.status(404).json({ err });
  }
}

async function getDayValues(userId, habitType) {
  return await User.aggregate([
    { $match: { _id: ObjectId(userId) } },

    { $unwind: "$habits" },

    { $match: { "habits.habitType": habitType } },

    { $unwind: "$habits.days" },

    { $match: { "habits.days.date": Date().slice(0, 15) } },
  ]);
}

async function addOneToCounter(userId, habitId, dayId, inputCounter) {
  return await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $set: { "habits.$[outer].days.$[inner].inputCounter": inputCounter + 1 },
    },
    {
      arrayFilters: [{ "outer._id": habitId }, { "inner._id": dayId }],
    }
  );
}

async function markDayAsCompleted(userId, habitId, dayId) {
  return await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $set: { "habits.$[outer].days.$[inner].fulfilled": true },
    },
    {
      arrayFilters: [{ "outer._id": habitId }, { "inner._id": dayId }],
    }
  );
}

async function checkAndUpdateCurrentStreak(userId, habitType, habitId) {
  const daysArrayValues = await User.aggregate([
    { $match: { _id: ObjectId(userId) } },

    { $unwind: "$habits" },

    { $match: { "habits.habitType": habitType } },
  ]);

  let daysArray = daysArrayValues[0].habits.days;

  let streakCount = 0;

  for (i = daysArray.length - 1; i >= 0; i--) {
    if (daysArray[i].fulfilled === true) {
      streakCount++;
    } else {
      break;
    }
  }

  await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $set: { "habits.$[outer].currentStreak": streakCount },
    },
    {
      arrayFilters: [{ "outer._id": habitId }],
    }
  );
  return streakCount;
}

async function updateBestStreak(userId, habitId, currentStreak) {
  return await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $set: { "habits.$[outer].bestStreak": currentStreak },
    },
    {
      arrayFilters: [{ "outer._id": habitId }],
    }
  );
}

async function markHabitAsCompleted(userId, habitId) {
  return await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $set: { "habits.$[outer].completed": true },
    },
    {
      arrayFilters: [{ "outer._id": habitId }],
    }
  );
}

module.exports = { addDayToAllHabits, updateHabitCounter };
