import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import StatsCards from "./components/StatsCards";
import FileUpload from "./components/FileUpload";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import ChartSection from "./components/ChartSection";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  // 🔗 Replace localhost with your Render backend URL
  const API_URL = "https://student-grading-system-7oyy.onrender.com";

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/students`);
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const deleteAllStudents = async () => {
    if (window.confirm("Are you sure you want to delete all student records?")) {
      try {
        await axios.delete(`${API_URL}/api/students`);
        setStudents([]);
      } catch (err) {
        console.error("Error deleting all students:", err);
      }
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        {/* Top Stats */}
        <StatsCards students={students} />

        {/* File Upload Section */}
        <div className="card">
          <h2>📎 Upload Files (Reports / Photos)</h2>
          <FileUpload />
        </div>

        {/* Student Form */}
        <div className="card">
          <h2>➕ Add New Student</h2>
          <StudentForm onStudentAdded={fetchStudents} />
        </div>

        {/* Student Table */}
        <div className="card">
          <div className="table-header">
            <h2>📋 Student Records</h2>
            <button className="delete-btn" onClick={deleteAllStudents}>
              🗑️ Delete All
            </button>
          </div>
          <StudentTable students={students} />
        </div>

        {/* Chart Section */}
        <div className="card">
          <h2>📊 Performance Overview</h2>
          <ChartSection students={students} />
        </div>
      </div>
    </div>
  );
}

export default App;
