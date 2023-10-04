const mongoose=require('mongoose')
const shiftSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
  },
});

const shift = mongoose.model('Shift',shiftSchema);
module.exports= shift