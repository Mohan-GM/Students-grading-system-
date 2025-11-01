const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const Student = require("../models/Student");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    for (const row of rows) {
      // Expected Excel format: Name | RollNumber | Subject1 | Subject2 | ...
      const subjects = Object.keys(row)
        .filter(k => !["Name", "RollNumber", "RollNo"].includes(k))
        .map(subject => ({
          subjectName: subject,
          marks: Number(row[subject]),
        }));

      const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
      const avg = totalMarks / subjects.length;
      let grade = "C";
      if (avg >= 90) grade = "A+";
      else if (avg >= 80) grade = "A";
      else if (avg >= 70) grade = "B";
console.log("📦 Saving student:", {
  name: row.Name,
  rollNo: row.RollNumber || row.RollNo,
  subjects,
  totalMarks,
  grade
});

      await Student.create({
        name: row.Name,
        rollNo: row.RollNumber || row.RollNo, // supports both field names
        subjects,
        totalMarks,
        grade,
      });
    }

    res.json({ message: "✅ File uploaded & data saved successfully!" });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Failed to add students. Check backend logs." });
  }
});

module.exports = router;
