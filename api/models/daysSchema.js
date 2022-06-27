const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DaySchema = new Schema(
  {
    _id: {
      type: Number,
      required: true,
      unique: true,
    },

    frequencyPerDay: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },

    bestStreak: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    
    days: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Day", DaySchema);
