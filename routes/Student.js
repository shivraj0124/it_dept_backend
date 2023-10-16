const express = require("express");
const router = express.Router();
const notesModel=require('../Models/Notes')
const semesterModel =require('../Models/Semester')
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
      .send({ success: false, error: "Failed to fetch faculty details" });
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
      .send({ success: false, error: "Failed to fetch faculty details" });
  }
});

// router.get("/searchNote", async (req, res) => {
//   try {
//     const { search } = req.query; // Use req.query to get the search parameter from the query string

//     const result = await notesModel.find({
//       $or: [
//         { name: { $regex: ".*" + search + ".*", $options: "i" } },
//         // You can add more fields to search here
//       ],
     
//     });

//     return res.status(200).send({
//       success: true,
//       result,
//     });
//   } catch (error) {
//     console.error("Error searching notes:", error);
//     return res.status(500).send({
//       success: false,
//       message: "Failed to search notes",
//     });
//   }
// });

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

module.exports = router;