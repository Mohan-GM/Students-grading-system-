const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// ✅ Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();

    // Ensure numbers are numeric and not undefined/null
    const cleanStudents = students.map((s) => ({
      ...s._doc,
      totalMarks: Number(s.totalMarks) || 0,
      subjects: (s.subjects || []).map((sub) => ({
        ...sub,
        marks: Number(sub.marks) || 0,
      })),
    }));

    res.json(cleanStudents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add student manually
router.post("/", async (req, res) => {
  try {
    console.log("📦 Received:", req.body);

    const { name, rollNo, rollNumber, class: studentClass, subjects } = req.body;
    const roll = rollNumber || rollNo;

    if (!name || !roll || !subjects || !subjects.length)
      return res.status(400).json({ error: "Invalid input data" });

    // Convert marks to numbers safely
    const cleanSubjects = subjects.map((s) => ({
      name: s.name,
      marks: Number(s.marks) || 0,
    }));

    const totalMarks = cleanSubjects.reduce((sum, s) => sum + s.marks, 0);
    const avg = cleanSubjects.length ? totalMarks / cleanSubjects.length : 0;

    let grade = "C";
    if (avg >= 90) grade = "A+";
    else if (avg >= 80) grade = "A";
    else if (avg >= 70) grade = "B";

    const student = new Student({
      name,
      rollNumber: roll,
      class: studentClass,
      subjects: cleanSubjects,
      totalMarks,
      grade,
    });

    await student.save();
    console.log("✅ Student added successfully:", student);
    res.status(201).json(student);
  } catch (err) {
    console.error("❌ Add student error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete one student
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete all students
router.delete("/", async (req, res) => {
  try {
    await Student.deleteMany({});
    res.json({ message: "All student records deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
