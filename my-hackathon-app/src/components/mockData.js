// TODO(backend): replace with real API data

export const userProfile = {
  name: "Ali",
  fullName: "Ali Raza",
  role: "BSCS - 2nd Year",
  avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d" 
};

export const stats = {
  studyTime: { current: "2h 40m", goal: "4h 00m", percent: 67 },
  tasks: { current: 7, total: 12, percent: 58 },
  quizzes: { score: "82%", topPercent: "18%" }
};

export const studyPlan = [
  { id: 1, title: "Variables in C++", subtitle: "Review notes • 20 min", status: "Completed" },
  { id: 2, title: "Functions & Parameters", subtitle: "Practice 10 questions • 30 min", status: "In Progress" },
  { id: 3, title: "Loops (For, While, Do While)", subtitle: "Mini quiz • 20 min", status: "Pending" }
];

export const subjects = [
  { id: 1, name: "Data Structures", percent: 75, color: "bg-indigo-600", iconBg: "bg-indigo-100", iconColor: "text-indigo-600" },
  { id: 2, name: "Object Oriented Programming", percent: 60, color: "bg-green-600", iconBg: "bg-green-100", iconColor: "text-green-600" },
  { id: 3, name: "Discrete Mathematics", percent: 40, color: "bg-orange-500", iconBg: "bg-orange-100", iconColor: "text-orange-500" },
  { id: 4, name: "Calculus & Analytical Geometry", percent: 30, color: "bg-blue-500", iconBg: "bg-blue-100", iconColor: "text-blue-500" }
];

export const chartData = [
  { day: 'Mon', progress: 10 },
  { day: 'Tue', progress: 25 },
  { day: 'Wed', progress: 45 },
  { day: 'Thu', progress: 60 },
  { day: 'Fri', progress: 78 },
  { day: 'Sat', progress: 85 },
  { day: 'Sun', progress: 100 },
];

export const upcomingDeadlines = [
  { id: 1, title: "OOP Assignment", date: "20 May, 2025", daysLeft: 5, type: "danger" },
  { id: 2, title: "Discrete Math Quiz", date: "22 May, 2025", daysLeft: 7, type: "warning" },
  { id: 3, title: "DSA Practice Test", date: "25 May, 2025", daysLeft: 10, type: "success" }
];