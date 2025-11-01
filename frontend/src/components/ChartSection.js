import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function ChartSection({ students }) {
  if (!students || students.length === 0) {
    return <p>No student data available for charts.</p>;
  }

  // ✅ Grade Distribution
  const gradeCounts = students.reduce((acc, s) => {
    acc[s.grade] = (acc[s.grade] || 0) + 1;
    return acc;
  }, {});

  const gradeData = {
    labels: Object.keys(gradeCounts),
    datasets: [
      {
        label: "Grade Distribution",
        data: Object.values(gradeCounts),
        backgroundColor: ["#3F51B5", "#7986CB", "#BA68C8", "#FFB74D"],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "65%",
    radius: "80%",
    layout: { padding: 0 },
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 15, padding: 15 },
      },
    },
  };

  // ✅ Marks Trend (Line Chart)
  const sortedStudents = [...students].sort((a, b) =>
    a.rollNumber.localeCompare(b.rollNumber)
  );

  const lineData = {
    labels: sortedStudents.map((s) => s.name),
    datasets: [
      {
        label: "Total Marks Trend",
        data: sortedStudents.map((s) => s.totalMarks),
        borderColor: "#3F51B5",
        backgroundColor: "rgba(63,81,181,0.15)",
        tension: 0.3,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  const lineOptions = {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="chart-grid">
      <div className="chart-card">
        <h3>📊 Grade Distribution</h3>
        <div style={{ width: "350px", margin: "0 auto" }}>
          <Doughnut data={gradeData} options={doughnutOptions} />
        </div>
      </div>

      <div className="chart-card">
        <h3>📈 Marks Trend</h3>
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
  );
}

export default ChartSection;
