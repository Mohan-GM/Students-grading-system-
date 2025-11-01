export default function StatsCards({ students }) {
  const total = students.length;

  // Extract numeric totalMarks values
  const marks = students
    .map((s) => Number(s.totalMarks))
    .filter((n) => !isNaN(n));

  const avg =
    marks.length > 0
      ? (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(2)
      : 0;

  const top = marks.length > 0 ? Math.max(...marks) : 0;

  return (
    <div className="card-container">
      <div className="card">🎓 Total Students: {total}</div>
      <div className="card">📈 Average Marks: {avg}</div>
      <div className="card">🏆 Top Score: {top}</div>
    </div>
  );
}
