const express = require("express");
const router = express.Router();
const semesterModel = require("../Models/Semester");
const subjectModel = require("../Models/Subject");
// const shiftModel = require("../Models/Shift");
const notesModel = require("../Models/Notes");
const qPModel = require("../Models/QuestionPaper");
const fNoticeModel =require("../Models/FNotice")
router.post("/add-notes", async (req, res) => {
  const { name, link, subject, semester,role } = req.body;
  try {
      const newNotes = new notesModel({
        name,
        link,
        subject,
        semester,
        role
      });
      const noteExist = await notesModel.findOne({ name: name });
      // console.log(facultyExist._id ,facultyId);
      if (noteExist) {
          return res.status(200).send({
              data: { success: false, message: "Note Already Exist" },
            });
        } else {
      await newNotes.save();

      return res.status(200).send({
        success: true,
        message: "Notes Added Successfully",
      });
    }
  } catch (err) {
    res.send({
      success: false,
      message: err,
    });
  }
});
// Add new Question paper
router.post("/add-qp", async (req, res) => {
  const { name, link, subject, semester,role } = req.body;
  try {
    const newQP = new qPModel({
      name,
      link,
      subject,
      semester,
      role
    });
    const qpExist = await qPModel.findOne({ name: name });
    // console.log(facultyExist._id ,facultyId);
    if (qpExist) {
      return res.status(200).send({
        data: { success: false, message: "Question Paper Already Exist" },
      });
    } else {
      await newQP.save();
      return res.status(200).send({
        success: true,
        message: "Question paper Added Successfully",
      });
    }
  } catch (err) {
    res.send({
      success: false,
      message: err,
    });
  }
});

router.get("/get-notes/:id", async (req, res) => {
  try {
    const role = req.params.id
    const notes = await notesModel
      .find({role:role})
      .populate("subject")
      .populate("semester");
    res.send({ success: true, notes });
  } catch (error) {
    console.error("Error fetching faculty details:", error);
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch faculty details" });
  }
});

router.put("/update-note/:id", async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await notesModel.findById(noteId);

    const { name, link, semester, subject } = req.body;
    const noteExist = await notesModel.findOne({ name: name });

    if (noteExist && note.name !== name) {
      return res.status(200).send({
        data: { success: false, message: "Note Already Exist" },
      });
    } else {
      const note = await notesModel.findById(noteId);
      if (!note) {
        return res
          .status(404)
          .send({ success: false, message: "Note not found" });
      }
      note.name = name;
      note.link = link;
      note.semester = semester;
      note.subject = subject;
      await note.save();
      res.status(200).send({ success: true, updatedNote: note });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});
router.delete("/delete-note/:id", async (req, res) => {
  const noteId = req.params.id;

  try {
    // Find the faculty record by ID and remove it
    const isNote = await notesModel.findByIdAndRemove(noteId);

    if (!isNote) {
      return res
        .status(404)
        .send({ success: false, message: "Note not found" });
    }

    res.send({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

router.get("/get-qp/:id", async (req, res) => {
  try {
    const role=req.params.id
    const qP = await qPModel.find({role:role}).populate("subject").populate("semester");
    res.send({ success: true, qP });
  } catch (error) {
    console.error("Error fetching Question Paper details:", error);
    res
      .status(500)
      .send({
        success: false,
        error: "Failed to fetch Questions Paper details",
      });
  }
});
// --> Manage All qp <-- //
router.put("/update-qp/:id", async (req, res) => {
  try {
    const qpId = req.params.id;
    const qP = await qPModel.findById(qpId);

    const { name, link, semester, subject } = req.body;
    const qPExist = await qPModel.findOne({ name: name });

    if (qPExist && qP.name !== name) {
      return res.status(200).send({
        data: { success: false, message: "Question paper Already Exist" },
      });
    } else {
      const qP = await qPModel.findById(qpId);
      if (!qP) {
        return res
          .status(404)
          .send({ success: false, message: "Question paper not found" });
      }
      qP.name = name;
      qP.link = link;
      qP.semester = semester;
      qP.subject = subject;
      await qP.save();
      res.status(200).send({ success: true, updatedNote: qP });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

// Delete Qp
router.delete("/delete-qp/:id", async (req, res) => {
  const qPId = req.params.id;

  try {
    // Find the faculty record by ID and remove it
    const isQP = await qPModel.findByIdAndRemove(qPId);

    if (!isQP) {
      return res
        .status(404)
        .send({ success: false, message: "Question Paper not found" });
    }

    res.send({ success: true, message: "Question Paper deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});


// Add new Notice
router.post("/add-notice", async (req, res) => {
  try {
  
    const { title, link, description,semester,shift,role } = req.body;
    const newNotice = new fNoticeModel({
      title,
      link,
      description,
      semester,
      shift,
      role
    });
    const noticeExist = await fNoticeModel.findOne({ title: title });
    // console.log(facultyExist._id ,facultyId);
    if (noticeExist) {
      return res.status(200).send({
        data: { success: false, message: "Notice Already Exist with this title" },
      });
    } else {
      await newNotice.save();
      return res.status(200).send({
        success: true,
        message: "Notice Added Successfully",
      });
    }
    
  } catch (err) {
    res.send({
      success: false,
      message: err,
    });
  }
});
// Manage Notices
router.get('/get-notices/:id',async (req,res)=>{
  try {
    const role =req.params.id
    const fNotice = await fNoticeModel.find({role:role}).populate("semester").populate("shift");
    res.send({ success: true, fNotice });
  } catch (error) {
    console.error("Error fetching Notice details:", error);
    res
      .status(500)
      .send({
        success: false,
        error: "Failed to fetch Notice details",
      });
  }
})
router.delete("/delete-notice/:id", async (req, res) => {
  const noticeId = req.params.id;
  try {
    // Find the faculty record by ID and remove it
    const isNotice = await fNoticeModel.findByIdAndRemove(noticeId);
    if (!isNotice) {
      return res
        .status(404)
        .send({ success: false, message: "Notice not found" });
    }

    res.send({ success: true, message: "Notice deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});
router.put("/update-notice/:id", async (req, res) => {
  try {
    const noticeId = req.params.id;
    const notice = await fNoticeModel.findById(noticeId);

    const { title, link, description,semester,shift} = req.body;
    const noticeExist = await fNoticeModel.findOne({ title: title });

    if (noticeExist && notice.title !== title) {
      return res.status(200).send({
        data: { success: false, message: "Notice Already Exist" },
      });
    } else {
      const notice = await fNoticeModel.findById(noticeId);
      if (!notice) {
        return res
          .status(404)
          .send({ success: false, message: "Notice not found" });
      }
      notice.title = title;
      notice.link = link;
      notice.description = description;
      notice.semester=semester
      notice.shift=shift
      
      await notice.save();
      res.status(200).send({ success: true, updatedNotice: notice });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});
module.exports = router