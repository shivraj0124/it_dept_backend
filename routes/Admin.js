const express = require("express");
const router = express.Router();
// const argon2 = require("express");
const cloudinary = require("cloudinary").v2;
const adminModel=require('../Models/AdminModel')
const studentModel = require("../Models/Student");
const facultyModel = require("../Models/FacultyModel");
const semesterModel = require("../Models/Semester");
const subjectModel = require("../Models/Subject");
const shiftModel = require("../Models/Shift");
const timeTableModel = require("../Models/TimeTable");
const notesModel = require("../Models/Notes");
const qPModel = require("../Models/QuestionPaper");
const noticeModel = require("../Models/Notice");
const achievementModel =require("../Models/Achievements")
const api_secret_key = process.env.Cld_Api_key;

cloudinary.config({
  cloud_name: "dc28atbon",
  api_key: "382378611656777",
  api_secret: api_secret_key,
  secure: true,
});
// Dashboard
// Total Faculties
router.get("/faculties-count", async (req, res) => {
  try {
    const totalCount = await facultyModel.countDocuments();
    res.send({ totalFaculties: totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}); 
// Total Notes
router.get("/notes-count", async (req, res) => {
  try {
    const totalCount = await notesModel.countDocuments();
    res.send({ totalNotes: totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}); 
// Total QPs
router.get("/qp-count", async (req, res) => {
  try {
    const totalCount = await qPModel.countDocuments();
    res.send({ totalQP: totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});
// Total Time tables
router.get("/timeTable-count", async (req, res) => {
  try {
    const totalCount = await timeTableModel.countDocuments();
    res.send({ totalTimetables: totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});
// Total Notices
router.get("/notice-count", async (req, res) => {
  try {
    const totalCount = await noticeModel.countDocuments();
    res.send({ totalNotices: totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});  
// Add new faculty
router.post("/add-faculty", async (req, res, next) => {
  try {
    const { name, email, phone,password, qualification, post, experience } = req.body;

    console.log(name);
    const facultyExist = await facultyModel.findOne({ phone: phone,email:email });
    if (facultyExist) {
      return res.status(200).json({
        data: { success: false, message: "faculty Already Exist" },
      });
    }
    const file = req.files.photo;
    console.log(file);
    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      console.log(result.url);
      
      const newFaculty = new facultyModel({
        name,
        email,
        phone,
        password,
        qualification,
        post,
        experience,
        photo: result.url,
      });
      console.log(newFaculty);
      await newFaculty.save();
    });
    return res.status(200).send({
      success: true,
      message: "done",
    });
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: "Invalid email",
    });
  }
});

// Get Faculty Details
router.get("/manage-faculty", async (req, res) => {
  try {
    const faculties = await facultyModel.find();
    res.send({ success: true, faculties });
  } catch (error) {
    console.error("Error fetching faculty details:", error);
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch faculty details" });
  }
});

// update faculties
router.put("/update-faculty/:id", async (req, res) => {
  try {
    const facultyId = req.params.id;
    const faculty = await facultyModel.findById(facultyId);

    const { name, email,phone, qualification, post, experience } = req.body;
    const facultyExist = await facultyModel.findOne({ email: email ,phone:phone});
    // console.log(facultyExist._id ,facultyId);
    if (facultyExist && faculty.phone !== phone && faculty.email !== email) {
      return res.status(200).send({
        data: { success: false, message: "Phone No Already Exist" },
      });
    } else {
      // Check if the faculty with the given ID exists
      const faculty = await facultyModel.findById(facultyId);
      if (!faculty) {
        return res
          .status(404)
          .send({ success: false, message: "Faculty not found" });
      }
      // Update faculty details based on the request data
      faculty.name = name;
      faculty.email = email;
      faculty.phone = phone;
      faculty.qualification = qualification;
      faculty.post = post;
      faculty.experience = experience;

      // Handle the optional photo upload and save the URL to the faculty document
      if (req.files && req.files.photo) {
        const photoFile = req.files.photo;
        const result = await uploadPhotoToCloudinary(photoFile);

        if (result && result.secure_url) {
          faculty.photo = result.secure_url;
        }
      }

      // Save the updated faculty data
      await faculty.save();

      res.status(200).send({ success: true, updatedFaculty: faculty });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

// uploading photo to cloudinary
async function uploadPhotoToCloudinary(photoFile) {
  try {
    const result = await cloudinary.uploader.upload(photoFile.tempFilePath);
    return result;
  } catch (error) {
    console.error("Error uploading photo to Cloudinary:", error);
    return null;
  }
}

//delete faculty record
router.delete("/delete-faculty/:id", async (req, res) => {
  const facultyId = req.params.id;

  try {
    // Find the faculty record by ID and remove it
    const deletedFaculty = await facultyModel.findByIdAndRemove(facultyId);

    if (!deletedFaculty) {
      return res
        .status(404)
        .send({ success: false, message: "Faculty not found" });
    }

    res.send({ success: true, message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});
router.get("/search-faculty", async (req, res) => {
  try {
    const { search } = req.query; // Get the search query from the query parameters

    const faculties = await facultyModel.find({
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
        { post: { $regex: ".*" + search + ".*", $options: "i" } },
        { qualification: { $regex: ".*" + search + ".*", $options: "i" } },
        { experience: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    });

    res.status(200).send({ success: true, faculties });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

// Create Semester
router.post("/create-sem", async (req, res) => {
  try {
    const { name } = req.body;

    const sem = new semesterModel({ name: name });
    await sem.save();

    return res.status(200).send({
      success: true,
      message: "Semester created successfully",
      sem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "An error ",
    });
  }
});
router.get("/search-student", async (req, res) => {
  try {
    const { search } = req.query; // Get the search query from the query parameters

    const students = await studentModel.find({
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
        { EnrNo: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    }).populate("semester").populate("shift")

    res.status(200).send({ success: true, students });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});
router.get("/get-students-by-semester/:id", async (req, res) => {
  try {
    const semesterId = req.params.id;
    const students = await studentModel.find({ semester: semesterId })
      .populate("shift")
      .populate("semester");
    res.send({ success: true, students });
  } catch (error) {
    console.error("Error fetching notes details:", error);
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch Notes details" });
  }
});
router.get("/get-students-by-shift/:id", async (req, res) => {
  try {
    const shiftId = req.params.id;
    const students = await studentModel.find({ shift: shiftId })
      .populate("shift")
      .populate("semester");
    res.send({ success: true, students });
  } catch (error) {
    console.error("Error fetching notes details:", error);
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch Notes details" });
  }
});
// Update Semester
router.put("/update-students-semester", async (req, res) => {
  try {
    const { currentSemesterId, currentShiftId ,newSemesterId, newShiftId } = req.body;


    // Use the updateMany function to update the semester and shift of students
    const result = await studentModel.updateMany(
      {
        semester: currentSemesterId,
        shift: currentShiftId,
      },
      {
        $set: {
          semester: newSemesterId,
          shift: newShiftId,
        },
      }
    );

    res.status(200).send({
        success: true,
        message: "Students updated successfully",
        result,
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});
router.get("/search-note", async (req, res) => {
  try {
    const { search } = req.query; // Get the search query from the query parameters

    const notes = await notesModel.find({
        $or: [
          { name: { $regex: ".*" + search + ".*", $options: "i" } },
        ],
      }).populate("subject").populate("semester")     
    res.status(200).send({ success: true, notes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});
router.get("/get-notes-by-semester/:id", async (req, res) => {
  try {
    const semesterId = req.params.id;
    const notes = await notesModel
      .find({ semester: semesterId })
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
router.get("/get-notes-by-subject/:id", async (req, res) => {
  try {
    const subjectId = req.params.id;
    const notes = await notesModel
      .find({ subject: subjectId })
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
router.get("/search-qp", async (req, res) => {
  try {
    const { search } = req.query; // Get the search query from the query parameters

    const qp = await qPModel.find({
      $or: [{ name: { $regex: ".*" + search + ".*", $options: "i" } }],
    }).populate("subject").populate("semester")
    res.status(200).send({ success: true, qp });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});
router.get("/get-qp-by-semester/:id", async (req, res) => {
  try {
    const semesterId = req.params.id;
    const qp = await qPModel.find({ semester: semesterId })
      .populate("subject")
      .populate("semester");
    res.send({ success: true, qp });
  } catch (error) {
    console.error("Error fetching notes details:", error);
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch Notes details" });
  }
});
router.get("/get-qp-by-subject/:id", async (req, res) => {
  try {
    const subjectId = req.params.id;
    const qp = await qPModel.find({ subject: subjectId })
      .populate("subject")
      .populate("semester");
    res.send({ success: true, qp });
  } catch (error) {
    console.error("Error fetching notes details:", error);
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch Notes details" });
  }
});
// Create Subjects
router.post("/create-subject", async (req, res) => {
  const { name, courseCode, semester } = req.body;
  const subject = new subjectModel({
    name: name,
    courseCode: courseCode,
    semester: semester,
  });
  await subject.save();
  return res.json({ subject });
});
// Create Shift
router.post("/create-shift", async (req, res) => {
  const { name, sem } = req.body;
  const shift = new shiftModel({ name: name, semester: sem });
  await shift.save();
  return res.json({ shift });
});

// Get Semester
router.get("/get-semesters", async (req, res) => {
  try {
    const semesters = await semesterModel.find();
    res.send({ success: true, semesters });
  } catch (error) {
    console.error("Error fetching faculty details:", error);
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch faculty details" });
  }
});
// Get all Shifts by Semester
router.get("/get-shifts/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const shifts = await shiftModel
      .find({ semester: id })
      .populate("name", "semester");

    return res.status(200).send({ success: true, shifts }); // Changed 'shift' to 'shifts'
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: error,
      message: "An error occurred while retrieving shifts",
    });
  }
});
// Get ALl subjects by semester
router.get("/subjects/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const subjects = await subjectModel
      .find({ semester: id })
      .populate("name", "semester");

    return res.status(200).send({ success: true, subjects }); // Changed 'shift' to 'shifts'
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: error,
      message: "An error occurred while retrieving shifts",
    });
  }
});

// Add new Time Table
router.post("/addTT", async (req, res) => {
  const { name, shift, semester } = req.body;
  try {
    const file = req.files.photo;
    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      // console.log(result.url);
      const newTimeTable = new timeTableModel({
        name,
        photo: result.url,
        semester,
        shift,
      });
      await newTimeTable.save();
    });
    return res.status(200).send({
      success: true,
      message: "done",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err,
    });
  }
});
// Add new notes
router.post("/add-notes", async (req, res) => {
  const { name, link, subject, semester,role} = req.body;
  try {
   
    const noteExist = await notesModel.findOne({ name: name });
    console.log(noteExist, 'Hello World');
    // console.log(facultyExist._id ,facultyId);
    if (noteExist) {
      return res.status(200).send({
        data: { success: false, message: "Note Already Exist" },
      });
    } else {
       const newNotes = new notesModel({
         name,
         link,
         subject,
         semester,
         role,
       });
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
  const { name, link, subject,semester,role } = req.body;
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
// Add new Notice
router.post("/add-notice", async (req, res) => {
  const { title, link, description } = req.body;
  try {
    const newNotice = new noticeModel({
      title,
      link,
      description,
    });
    await newNotice.save();

    return res.status(200).send({
      success: true,
      message: "Notice Added Successfully",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err,
    });
  }
});
//Get All time tables
router.get("/get-timetables", async (req, res) => {
  try {
    const timeTable = await timeTableModel.find().populate("semester").populate("shift");
    res.send({ success: true, timeTable });
  } catch (error) {
    console.error("Error fetching faculty details:", error);
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch faculty details" });
  }
});
// Delete Time Table
router.delete("/delete-TT/:id", async (req, res) => {
  const tTId = req.params.id;

  try {
    const isTT = await timeTableModel.findByIdAndRemove(tTId);

    if (!isTT) {
      return res
        .status(404)
        .send({ success: false, message: "Time Table not found" });
    }

    res.send({ success: true, message: "Time Table successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});
// update faculties
router.put("/update-tt/:id", async (req, res) => {
  try {
    const TTId = req.params.id;
    const TT = await timeTableModel.findById(TTId);

    const { name, semester,shift} = req.body;
    const TTExist = await timeTableModel.findOne({ name: name });
  
    if (TTExist && TT.name !== name) {
      return res.status(200).send({
        data: { success: false, message: "Time Table Already Exist" },
      });
    } else {
     
      if (!TT) {
        return res
          .status(404)
          .send({ success: false, message: "Time Table not found" });
      }

      TT.name=name,
      TT.semester=semester,
      TT.shift=shift

       if(req.files && req.files.photo) {
        const photoFile = req.files.photo;
        const result = await uploadTTPhotoToCloudinary(photoFile);

        if (result && result.secure_url) {
          TT.photo = result.secure_url;
        }
      }

      await TT.save();
      res.status(200).send({ success: true, updatedTT: TT });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

// uploading photo to cloudinary
async function uploadTTPhotoToCloudinary(photoFile) {
  try {
    const result = await cloudinary.uploader.upload(photoFile.tempFilePath);
    return result;
  } catch (error) {
    console.error("Error uploading photo to Cloudinary:", error);
    return null;
  }
}
//Get shift by id
router.get("/get-shift/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const shift = await shiftModel.find({ _id: id });

    return res.status(200).send({ success: true, shift }); // Changed 'shift' to 'shifts'
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: error,
      message: "An error occurred while retrieving shifts",
    });
  }
});
//Get semester by id
router.get("/get-semester/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const semester = await semesterModel.find({ _id: id });

    return res.status(200).send({ success: true, semester }); // Changed 'shift' to 'shifts'
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: error,
      message: "An error occurred while retrieving shifts",
    });
  }
});
// --> Manage All notes <-- //
// Get ALl notes
router.get("/get-notes", async (req, res) => {
  try {
    const notes = await notesModel
      .find()
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
//  Updates Notes
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
// Delete Note
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

// Get subject by id
router.get("/get-subject/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const subject = await subjectModel.find({ _id: id });

    return res.status(200).send({ success: true, subject }); // Changed 'shift' to 'shifts'
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: error,
      message: "An error occurred while retrieving shifts",
    });
  }
});
// Get All Question papers
router.get("/get-qp", async (req, res) => {
  try {
    const qP = await qPModel.find().populate("subject").populate("semester");
    res.send({ success: true, qP });
  } catch (error) {
    console.error("Error fetching Question Paper details:", error);
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch Questions Paper details" });
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
// Manage Notices
router.get('/get-notices',async (req,res)=>{
  try {
    const notice = await noticeModel.find()
    res.send({ success: true, notice });
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
    const isNotice = await noticeModel.findByIdAndRemove(noticeId);

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
    const notice = await noticeModel.findById(noticeId);

    const { title, link, description} = req.body;
    const noticeExist = await noticeModel.findOne({ title: title });

    if (noticeExist && notice.title !== title) {
      return res.status(200).send({
        data: { success: false, message: "Notice Already Exist" },
      });
    } else {
      const notice = await noticeModel.findById(noticeId);
      if (!notice) {
        return res
          .status(404)
          .send({ success: false, message: "Notice not found" });
      }
      notice.title = title;
      notice.link = link;
      notice.description = description;
      
      await notice.save();
      res.status(200).send({ success: true, updatedNotice: notice });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});
// Achievements 
router.post('/add-achievements',async (req,res)=>{
  const { title,description } = req.body;
  try {
    const achievementExist = await achievementModel.findOne({ title: title });
    // console.log(facultyExist._id ,facultyId);
    if (achievementExist) {
      return res.status(200).send({
        data: { success: false, message: "Achievement Already Exist" },
      });
    }      
      const file = req.files.photo;    
      cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      const newAchievements = new achievementModel({
        title,
        description,
        photo:result.url,
      });
      await newAchievements.save();
    })
      return res.status(200).send({
        success: true,
        message: "Achievement Added Successfully",
      });
  } catch (err) {
    res.send({
      success: false,
      message: err,
    });
  }
})
// Get achievements details
router.get('/get-achievements',async (req,res)=>{
  try{
    const achievements = await achievementModel.find()
    res.send({success:true,achievements})
  }catch(error){
    res.status(500).send({success:false,error:'Failed to fetch Achievements'})
  }
})

// update achievements
router.put("/update-achievement/:id",async (req,res)=>{
  try{
    const achievementId=req.params.id
    const achievement=await achievementModel.findById(achievementId)

    const {title,description}=req.body
    if(!achievement){
      return res.status(400).send({
        success:false,message:'Achievement Not Found'
      })
    }
    achievement.title=title,
    achievement.description=description
    console.log(achievement);
     if (req.files && req.files.photo) {
        const photoFile = req.files.photo;
        const result = await uploadPhotoToCloudinary(photoFile);

        if (result && result.secure_url) {
          achievement.photo = result.secure_url;
        }
      }
      await achievement.save()
      res.send({success:true,updatedAchievement:achievement})
    
  }catch(error){
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});
//
router.delete("/delete-achievement/:id", async (req, res) => {
  const achievementId = req.params.id;

  try {
    // Find the faculty record by ID and remove it
    const deletedAchievement = await achievementModel.findByIdAndRemove(achievementId);

    if (!deletedAchievement) {
      return res
        .status(404)
        .send({ success: false, message: "Achievement not found" });
    }

    res.send({ success: true, message: "Achievement deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

// Students

router.post("/add-student", async (req, res, next) => {
  try {
    const { name, email, EnrNo, password, phone, semester, shift } = req.body;
    const StudentExist = await studentModel.findOne({ EnrNo: EnrNo });
    if (StudentExist) {
      return res
        .status(200)
        .send({ success: false, message: "Student Already exist" });
    }
    // const hashedPass = await argon2.hash(password);
    const newStudent = new studentModel({
      name,
      email,
      EnrNo,
      password,
      phone,
      semester,
      shift,
    });
    await newStudent.save();
    return res.status(200).send({
      success: true,
      newStudent,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error,
    });
  }
});
// Get Students
router.get('/get-students',async (req,res)=>{
  try{
    const students=await studentModel.find().populate("semester").populate("shift")
    res.send({
      success:true,
      students
    })
  }catch(error){
    return res.status(400).send({
      success: false,
      message: "Network Error",
    });
  }
})
// Update Student
router.put("/update-student/:id", async (req, res) => {
  try{
    const studentId=req.params.id
    const student = await studentModel.findById(studentId)
     if (!student) {
       return res
         .status(404)
         .send({ success: false, message: "Student not found" });
     }
    const {name,email,EnrNo,phone,semester,shift}=req.body
    const studentExist= await studentModel.findOne({EnrNo:EnrNo})
    if(studentExist && student.EnrNo !== EnrNo){
      return res.status(200).send({
        data: { success: false, message: "Enrollment No Already Exist" },
      });
    }else{
      student.name=name
      student.email=email,
      student.EnrNo=EnrNo,
      student.phone=phone,
      student.semester=semester,
      student.shift=shift
    }
    await student.save()
     res.status(200).send({ success: true, student });

  }catch(error){
    return res.status(400).send({
      success: false,
      message: "Network Error",
    });
  }
})
// get student by EnrNo
router.get('/search-student', async (req, res) => {
  try {
    const { EnrNo } = req.query; // Get the EnrNo from the query parameters

    const student = await studentModel.findOne({ EnrNo: EnrNo });

    if (!student) {
      return res.status(404).send({ success: false, message: 'Student not found' });
    }

    return res.status(200).send({ success: true, student });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Internal Server Error',
    });
  }
});
//Update Password Student
router.put('/update-passwordSt/:id',async (req,res)=>{
  try{
    const studentId = req.params.id;
    const {password}=req.body
    const student = await studentModel.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .send({ success: false, message: "Student not found" });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    student.password=hashedPass
    await student.save();
    res.status(200).send({ success: true, student });
  }catch(error){
    return res.status(400).send({
      success: false,
      message: "Network Error",
    });
  }
})
// delete student
router.delete("/delete-student/:id", async (req, res) => {
try{
  const studentId=req.params.id
  const deletedStudent = await studentModel.findByIdAndRemove(studentId);
  if (!deletedStudent) {
    return res
      .status(404)
      .send({ success: false, message: "Student not found" });
  }
  res.send({ success: true, message: "Student deleted successfully" });
}catch(error){
  return res.status(500).send({
    success: false,
    message: "Internal Server Error",
  });
}
})
// Add Admin
router.post('/add-admin',async (req,res)=>{
  try {
    const { name, password } = req.body;
    const adminExist = await adminModel.findOne({ name: name });
    if (adminExist) {
      return res
        .status(200)
        .send({ success: false, message: "Admin Already exist" });
    }
    // const hashedPass = await argon2.hash(password);
    const newAdmin = new adminModel({
      name,
      password,      
    });
    await newAdmin.save();
    return res.status(200).send({
      success: true,
      newAdmin,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error,
    });
  }
})
module.exports = router;