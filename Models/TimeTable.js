const mongoose = require('mongoose');
const timeTableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  semester:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required:true
  },
  shift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shift",
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
});

const timeTable = mongoose.model("TimeTable", timeTableSchema);
module.exports = timeTable;
