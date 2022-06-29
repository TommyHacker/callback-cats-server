const User = require('../models/userSchema');
const Day = require('../models/daysSchema');
const cron = require('node-cron');

// SCHEDULE TASK FOR EVERY DAY AT 12 AM

cron.schedule('0 0 0 * * *', () => {
  addDayToAllHabits();
});


// TEST IF CRON IS WORKING
// cron.schedule('* * * * * *', () => {
//  console.log('Task every second');
// });

// ADD A NEW DAY TO ALL HABITS IN USERS DATABASE 

async function addDayToAllHabits() {
  const day = new Day({ date: Date().slice(0, 15) });

  await User.updateMany({}, { $addToSet: { 'habits.$[].days': day } });

}

module.exports = { addDayToAllHabits };




