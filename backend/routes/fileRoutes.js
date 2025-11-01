const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const Student = require("../models/Student");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

// ✅ Upload Excel file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (let row of data) {
      const subjects = [];
      Object.keys(row).forEach(key => {
        if (key.startsWith("Subject")) {
          const subjectName = key.split(" ")[1];
          subjects.push({ name: subjectName, marks: Number(row[key]) });
        }
      });

      const totalMarks = subjects.reduce((acc, s) => acc + s.marks, 0);
      const grade = totalMarks >= 250 ? "A" : totalMarks >= 200 ? "B" : "C";

      await Student.create({
        name: row.Name,
        rollNumber: row.RollNumber,
        class: row.Class,
        subjects,
        totalMarks,
        grade,
      });
    }

    res.json({ success: true, message: "File uploaded and data inserted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ✅ Export all students to Excel
router.get("/export", async (req, res) => {
  try {
    const students = await Student.find();
    const data = students.map(s => ({
      Name: s.name,
      RollNumber: s.rollNumber,
      Class: s.class,
      TotalMarks: s.totalMarks,
      Grade: s.grade,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Students");

    const filePath = "uploads/students.xlsx";
    xlsx.writeFile(wb, filePath);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: "Export failed" });
  }
});

module.exports = router;
