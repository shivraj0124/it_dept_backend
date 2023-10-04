const mongoose = require('mongoose')
const noticeModel = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  link: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Notice=mongoose.model("Notice",noticeModel)
module.exports= Notice