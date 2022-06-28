const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DaySchema = new Schema(
  {
    inputCounter: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Day", DaySchema);
