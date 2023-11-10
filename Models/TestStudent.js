const mongoose = require("mongoose");
const testStudentSchema = new mongoose.Schema({
  EnrollmentNo: {
    type: String,
    unique: true,
    sparse: true,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Phone: {
    type: Number,
    required: true,
  },
  role: {
    type: Number,
    default: 1,
  },
  Semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true,
  },
  Shift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shift",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const testStudent = mongoose.model("TestStudent", testStudentSchema);
module.exports = testStudent;
