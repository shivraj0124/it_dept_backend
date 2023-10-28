const mongoose = require('mongoose')
const notesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  role:{
  type:String,
  required:true
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
});
const Notes = mongoose.model("Note",notesSchema)
module.exports = Notes