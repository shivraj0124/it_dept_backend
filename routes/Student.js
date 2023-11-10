const express = require("express");
const router = express.Router();
const notesModel=require('../Models/Notes')
const semesterModel =require('../Models/Semester')
const qPModel = require("../Models/QuestionPaper");
const timeTableModel =require('../Models/TimeTable')
const fNoticeModel =require('../Models/FNotice')
const tStudent=require('../Models/TestStudent')
router.get("/get-student-details/:id",async (req,res)=>{
  try {
    const studentId = req.params.id;
    const student = await tStudent.find({ _id: studentId }).populate("Semester").populate("Shift")
    if(!student){
    res
      .status(500)
      .send({ success: false, error: "Student not exist details" });      
    }     
    res.send({ success: true, student });
  } catch (error) {
    console.error("Error fetching Student details:", error);
    res
      .status(500)
      .send({ success: false, error: "Failed to Student details" });
  }
})
router.get("/get-notes/:id", async (req, res) => {
  try {
    const semesterId =req.params.id
    const notes = await notesModel
      .find({semester:semesterId})
      .populate("subject")
      .populate("semester");
    res.send({ success: true, notes });
  } catch (error) {
    console.error("Error fetching Notes details:", error);
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch Notes details" });
  }
});

router.get("/get-notes-by-subject/:id", async (req, res) => {
  try {
    const subjectId =req.params.id
    const notes = await notesModel
      .find({subject:subjectId})
      .populate("subject")
      .populate("semester");
    res.send({ success: true, notes });
  } catch (error) {
    console.error("Error fetching notes details:", error);
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch Notes details" });
  }
});

router.get("/search-notes", async (req, res) => {
  const { search, semester } = req.query;
  try {
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (semester) {
      const semesterId = await semesterModel.findOne({ _id: semester });
      filter.semester = semesterId;
    }

    const notes = await notesModel.find(filter);

    res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ success: false, error: "Failed to fetch notes" });
  }
});
// Quesp
router.get("/get-quesP/:id", async (req, res) => {
  try {
    const semesterId = req.params.id;
    const quesP = await qPModel.find({ semester: semesterId })
      .populate("subject")
      .populate("semester");
    res.send({ success: true, quesP });
  } catch (error) {
    console.error("Error fetching Question Paper details:", error);
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch Question Paper details" });
  }
});
router.get("/get-quesP-by-subject/:id", async (req, res) => {
  try {
    const subjectId = req.params.id;
    const quesP = await qPModel.find({ subject: subjectId })
      .populate("subject")
      .populate("semester");
    res.send({ success: true, quesP });
  } catch (error) {
    console.error("Error fetching Question Paper details:", error);
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch Question Paper details" });
  }
});
router.get("/search-quesP", async (req, res) => {
  const { search, semester } = req.query;
  try {
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (semester) {
      const semesterId = await semesterModel.findOne({ _id: semester });
      filter.semester = semesterId;
    }

    const quesP = await qPModel.find(filter);

    res.status(200).json({ success: true, quesP });
  } catch (error) {
    console.error("Error fetching Question Paper:", error);
    res.status(500).json({ success: false, error: "Failed to fetch Question Paper" });
  }
});
router.get("/get-timeTable", async (req, res) => {
  try {
    const {semesterId,shiftId} = req.query
    const timeTable = await timeTableModel
      .find({ semester: semesterId , shift:shiftId})
      .populate("shift")
      .populate("semester");
    res.send({ success: true, timeTable });
  } catch (error) {
    console.error("Error fetching Time Table details:", error);
    res
      .status(500)
      .send({
        success: false,
        error: "Failed to fetch Time Table details",
      });
  }
});
router.get("/get-notices", async (req, res) => {
  try {
    const { semesterId, shiftId } = req.query;
    const notice = await fNoticeModel
      .find({ semester: semesterId, shift: shiftId })
      .populate("shift")
      .populate("semester");
    res.send({ success: true, notice });
  } catch (error) {
    console.error("Error fetching Time Table details:", error);
    res.status(500).send({
      success: false,
      error: "Failed to fetch Time Table details",
    });
  }
});
router.get("/profile/:id",async (req,res)=>{
  try{
    const studentId=req.params.id
    const student = await tStudent.findById(studentId).populate("Semester").populate("Shift")
    return res.send({
      success :true,
      student
    })
    
  }catch(err){
  res.status(500).send({
  success: false,
  error: "Failed to fetch Details",
});
  }
})
router.put("/update-profile/:id",async (req,res)=>{
  try{
    const studentId=req.params.id
    const {Name,Email,Phone,EnrollmentNo}=req.body
    const student=await tStudent.findById(studentId);
    const studentExist = await tStudent.find({Email:Email})
    console.log(studentExist)
    console.log(Name,Email,Phone,EnrollmentNo)
    // console.log(student.email, studentExist);
    if ( studentExist.length !==0 && EnrollmentNo !== studentExist[0].EnrollmentNo) {
      return res
        .status(200)
        .send({ success: false, message: "Email Already Exist" });
    } else {
      console.log(Name, Email, Phone, EnrollmentNo);
      student.Name = Name,
      student.Email = Email
      student.Phone = Phone;
      await student.save();
      res.send({
        success: true,
        message: "Profile Updated Successfully",
        student,
      });
    }

  }catch(err){
    res.status(500).send({
      success: false,
      error: "Failed to update profile",
    });
  }
})
router.put("/change-password/:id",async (req,res)=>{
  try{
      const studentId = req.params.id;
      const { oldPassword, newPassword } = req.body;
      const student = await tStudent.findById(studentId);
      if (student.Password !== oldPassword) {
        return res.send({
          success: false,
          message: "Old Password is incorrect!",
        });
      }
      student.Password = newPassword;
      

      await student.save();
      return res.send({ success: true, student });
  }catch(err){
    res.status(500).send({
      success: false,
      error: "Failed to change password",
    });
  }
})
module.exports = router;