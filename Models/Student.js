const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  EnrNo: {
    type:String,
    required:true
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required:true
  },
  role: {
    type: Number,
    default: 1,
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true,
  },
  shift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shift",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const student = mongoose.model("student", studentSchema);
module.exports = student;
