import React from "react";
import axios from "axios";

function StudentTable({ students, onStudentDeleted }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await axios.delete(`https://student-grading-system-7oyy.onrender.com/api/students/${id}`);
      alert("✅ Student deleted successfully!");
      onStudentDeleted(); // refresh data
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete student. Please try again.");
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Roll No</th>
          <th>Total Marks</th>
          <th>Grade</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s._id}>
            <td>{s.name}</td>
            <td>{s.rollNumber}</td> {/* ✅ fixed */}
            <td>{s.totalMarks}</td>
            <td>{s.grade}</td>
            <td>
              <button onClick={() => handleDelete(s._id)}>🗑️ Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StudentTable;
