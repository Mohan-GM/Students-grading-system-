import React, { useState } from "react";
import axios from "axios";

function StudentForm({ onStudentAdded }) {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [className, setClassName] = useState("");
  const [subjects, setSubjects] = useState([{ name: "", marks: "" }]);

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: "", marks: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalMarks = subjects.reduce((acc, s) => acc + Number(s.marks || 0), 0);
    const grade = totalMarks >= 250 ? "A" : totalMarks >= 200 ? "B" : "C";

    try {
      await axios.post("https://student-grading-system-7oyy.onrender.com/api/students", {
        name,
        rollNumber,
        class: className,
        subjects,
        totalMarks,
        grade,
      });
      onStudentAdded();
      setName("");
      setRollNumber("");
      setClassName("");
      setSubjects([{ name: "", marks: "" }]);
    } catch (err) {
      alert("Failed to add student");
    }
  };

  return (
    <div className="card">
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="Roll Number" required />
        <input value={className} onChange={e => setClassName(e.target.value)} placeholder="Class" />

        <h4>Subjects</h4>
        {subjects.map((subj, index) => (
          <div key={index} className="subject-row">
            <input
              placeholder="Subject Name"
              value={subj.name}
              onChange={e => handleSubjectChange(index, "name", e.target.value)}
            />
            <input
              placeholder="Marks"
              type="number"
              value={subj.marks}
              onChange={e => handleSubjectChange(index, "marks", e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={addSubject}>+ Add Subject</button>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default StudentForm;