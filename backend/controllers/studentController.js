const Student = require("../models/Student");
const XLSX = require("xlsx");

exports.getStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

exports.addStudent = async (req, res) => {
  const { name, rollNo, marks } = req.body;
  const grade = marks >= 90 ? "A+" : marks >= 75 ? "A" : marks >= 60 ? "B" : "C";
  const newStudent = new Student({ name, rollNo, marks, grade });
  await newStudent.save();
  res.json({ message: "Student added" });
};

exports.uploadExcel = async (req, res) => {
  res.json({ message: "Excel upload coming soon" });
};
