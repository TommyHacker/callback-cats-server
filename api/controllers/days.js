const User = require('../models/userSchema');
const Day = require('../models/daysSchema');
const cron = require('node-cron');

const { ObjectId } = require('mongodb');

// SCHEDULE TASK FOR EVERY DAY AT 12 AM

cron.schedule('0,10,20,30,40,50 0 0 * * *', () => {
  // resetCurrentStreak() Needs fixing
  addDayToAllHabits()
});


// TO FIX
async function resetCurrentStreak(){

  await User.updateMany(
    {},
    { $set: { 'habits.$[last].currentStreak': 0 } },
    { arrayFilters: [{ 'last.days.[habits.days.length - 1].fulfilled': false }] }
  );
  
}


async function addDayToAllHabits() {
  const day = new Day({ date: Date().slice(0, 15) });

  await User.updateMany({}, { $addToSet: { 'habits.$[].days': day } });
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

async function findSpecificItemInNestedArray(userId, habitType) {}

async function getDayValues(userId, habitType) {
  return await User.aggregate([
    { $match: { _id: ObjectId(userId) } },

    { $unwind: '$habits' },

    { $match: { 'habits.habitType': habitType } },

    { $unwind: '$habits.days' },

    { $match: { 'habits.days.date': Date().slice(0, 15) } },
  ]);
}

async function addOneToCounter(userId, habitId, dayId, inputCounter) {
  return await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $set: { 'habits.$[outer].days.$[inner].inputCounter': inputCounter + 1 },
    },
    {
      arrayFilters: [{ 'outer._id': habitId }, { 'inner._id': dayId }],
    }
  );
}

async function markDayAsCompleted(userId, habitId, dayId) {
  return await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $set: { 'habits.$[outer].days.$[inner].fulfilled': true },
    },
    {
      arrayFilters: [{ 'outer._id': habitId }, { 'inner._id': dayId }],
    }
  );
}

async function checkAndUpdateCurrentStreak(userId, habitType, habitId) {
  const daysArrayValues = await User.aggregate([
    { $match: { _id: ObjectId(userId) } },

    { $unwind: '$habits' },

    { $match: { 'habits.habitType': habitType } },
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
      $set: { 'habits.$[outer].currentStreak': streakCount },
    },
    {
      arrayFilters: [{ 'outer._id': habitId }],
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
      $set: { 'habits.$[outer].bestStreak': currentStreak },
    },
    {
      arrayFilters: [{ 'outer._id': habitId }],
    }
  );
}

async function markHabitAsCompleted(userId, habitId) {
  return await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $set: { 'habits.$[outer].completed': true },
    },
    {
      arrayFilters: [{ 'outer._id': habitId }],
    }
  );
}

module.exports = { addDayToAllHabits, updateHabitCounter };
