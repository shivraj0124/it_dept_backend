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
    require: true,
  },
  qualification: {
    type: String,
    require: true,
  },
  post: {
    type: String,
    require: true,
  },
  experience: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    require: true,
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
