const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DaySchema = new Schema(
  {
    inputCounter: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value',
      },
    },
    fulfilled: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Day', DaySchema);
