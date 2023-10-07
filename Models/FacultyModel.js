const mongoose = require("mongoose");
const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
});

const faculty = mongoose.model("faculty", facultySchema);
module.exports = faculty;
