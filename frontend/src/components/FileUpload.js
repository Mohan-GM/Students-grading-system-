import React, { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

export default function FileUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("⚠️ Please select an Excel file first!");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        "https://student-grading-system-7oyy.onrender.com/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("✅ File uploaded & students added successfully!");
      onUploadComplete && onUploadComplete();
      setFile(null);
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("❌ Upload failed. Check backend console.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    window.open(
      "https://student-grading-system-7oyy.onrender.com/api/files/export",
      "_blank"
    );
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("⚠️ Delete all student records? This cannot be undone!")) return;
    try {
      await axios.delete(
        "https://student-grading-system-7oyy.onrender.com/api/students"
      );
      alert("🧹 All student records deleted successfully!");
      onUploadComplete && onUploadComplete();
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete all student data.");
    }
  };

  return (
    <div className="upload-card">
      <h2>📁 Import / Export Excel</h2>
      <p className="subtitle">Upload Excel sheet, export data, or clear all records</p>

      <div className="upload-box">
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="upload-btn"
        >
          {loading ? "Uploading..." : "⬆️ Upload Excel"}
        </button>
      </div>

      <div className="action-buttons">
        <button className="export-btn" onClick={handleExport}>
          ⬇️ Export Data
        </button>
        <button className="delete-btn" onClick={handleDeleteAll}>
          🗑️ Delete All
        </button>
      </div>
    </div>
  );
}
