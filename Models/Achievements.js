const mongoose=require('mongoose')
const achievementsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default: Date.now()
    }
})

const Achievements = mongoose.model("achievement", achievementsSchema)
module.exports = Achievements