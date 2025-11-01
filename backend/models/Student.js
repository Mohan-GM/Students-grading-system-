const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: String,
  marks: Number,
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  class: String,
  subjects: [subjectSchema],
  totalMarks: Number,
  grade: String,
});

module.exports = mongoose.model("Student", studentSchema);
