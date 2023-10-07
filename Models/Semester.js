const mongoose = require("mongoose");
const semesterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // subjects: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Subject",
  //   },
  // ],
  // shift: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Shift",
  //   },
  // ],
});

const semester = mongoose.model("Semester",semesterSchema);
module.exports = semester;
