const mongoose = require('mongoose')
const express =require('express')
const router = express.Router();
const tStudent = require("../Models/TestStudent");
const adminModel=require('../Models/AdminModel')
const facultyModel=require('../Models/FacultyModel')
const contactModel=require('../Models/Contact')
const achievementModel=require('../Models/Achievements')
const academicAchievementsModel=require('../Models/AcademicAchment')
router.post('/student-login',async (req, res) => {
  
  const { EnrollmentNo, Password } = req.body;
  try {
    const student = await tStudent.findOne({ EnrollmentNo });
    if (!student) {
      return res.status(400).send({ success: false, message: 'Student not found' });
    }

    if (student.Password !== Password) {
      return res
        .status(401)
        .send({ success: false, message: "Incorrect password" });
    }
    const user=student
    res.status(200).send({ success: true, user});
  } catch (error) {
    res.status(500).send({ success: false, message: 'Server error' });
  }
});

router.post('/admin-login', async (req, res) => {
  
  const { name, password } = req.body;
  try {
    // Find the student by Enrollment Number
    const admin = await adminModel.findOne({ name });
    if (!admin) {
      return res
        .status(400)
        .send({ success: false, message: "Admin not found" });
    }

    if (admin.password !==password) {
      return res
        .status(401)
        .send({ success: false, message: "Incorrect password" });
    }
    const user = admin;
    res.status(200).send({ success: true, user });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Server error' });
  }
});
router.post('/faculty-login', async (req, res) => {
  
  const { phone, password } = req.body;
  try {
    // Find the student by Enrollment Number
    const faculty = await facultyModel.findOne({ phone });
    if (!faculty) {
      return res
        .status(400)
        .send({ success: false, message: "Faculty not found" });
    }
    if (faculty.password !== password) {
      return res
        .status(401)
        .send({ success: false, message: "Incorrect password" });
    }
    const user = faculty;
    res.status(200).send({ success: true, user });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Server error' });
  }
});
router.post("/Contact",async (req,res)=>{
  try{
     const {name,email,message}=req.body;
     const newMessage=new contactModel({
      name,email,message
     })
     await newMessage.save()
      return res.status(200).json({
        success: true,
        newMessage, // You can send the new photo data in the response
      });
  }catch(error){
    console.log(error)
  }
})
router.get("/get-achievements", async (req, res) => {
  try {
    const achievements = await achievementModel.find();
    res.send({ success: true, achievements });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch Achievements" });
  }
});
router.get("/get-academicAch", async (req, res) => {
  try {
    const images = await academicAchievementsModel.find();
    res.send({ success: true, images });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch Achievements" });
  }
});
module.exports = router;