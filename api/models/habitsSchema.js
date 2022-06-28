const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HabitSchema = new Schema(
  {
    habitType: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 6,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },

    completed: {
      type: Boolean,
      default: false,
    },

    frequencyPerDay: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },

    bestStreak: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
      default: 0,
    },

    currentStreak: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
      default: 0,
    },

    days: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habit", HabitSchema);
