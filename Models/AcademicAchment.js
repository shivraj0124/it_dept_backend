const mongoose=require("mongoose")
const AcademicAchievementSchema=new mongoose.Schema({
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
const AcademicAchievements = mongoose.model("academicAchievement", AcademicAchievementSchema);
module.exports = AcademicAchievements;