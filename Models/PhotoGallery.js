const mongoose = require("mongoose");
const photoGallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const PhotoGallery = mongoose.model("photoGallery", photoGallerySchema);
module.exports = PhotoGallery
