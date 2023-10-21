const mongoose = require('mongoose')
const studentModel = require("../Models/Student");
const adminModel=require('../Models/AdminModel')
const facultyModel=require('../Models/FacultyModel')
const express =require('express')
const router = express.Router();
const bcrypt = require("bcrypt");


router.post('/student-login',async (req, res) => {
  
  const { EnrNo, password } = req.body;
  try {
    // Find the student by Enrollment Number
    const student = await studentModel.findOne({ EnrNo });

    if (!student) {
      return res.status(400).send({ success: false, message: 'Student not found' });
    }
    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, student.password);

    if (!passwordMatch) {
      return res.status(401).send({ success: false, message: 'Incorrect password' });
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
    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).send({ success: false, message: 'Incorrect password' });
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
    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, faculty.password);

    if (!passwordMatch) {
      return res.status(401).send({ success: false, message: 'Incorrect password' });
    }
    const user = faculty;
    res.status(200).send({ success: true, user });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Server error' });
  }
});

module.exports = router;