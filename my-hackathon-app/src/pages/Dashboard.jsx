import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

import { useStudy } from "../context/StudyContext";
import { useAuth } from "../context/AuthContext";
import { getUserCourses, getStudyPlan, getQuizHistory, getLocalDateString } from "../firebase/firestore";
import { askStudyCoach } from "../services/gemini";

import QuickActionsCard from "../components/common/QuickActions";

import {
  ArrowRight,
  BrainCircuit,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  TrendingUp,
  Calendar,
  FileText,
  X,
  Target,
  Bot,
  Send,
  Mic,
  Paperclip,
  MoreVertical,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Code2,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ===================== WEEKLY PROGRESS ===================== */
const minutesFromDuration = (duration = "") => {
  const match = String(duration).match(/(\d+)\s*(?:min|minute)/i);
  return match ? Number(match[1]) : 0;
};

const formatMinutes = (minutes) =>
  minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;

const buildWeeklyProgress = (quizzes) => {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dateKey = getLocalDateString(date);
    const scores = quizzes.filter((quiz) => (quiz.date || quiz.completedAt?.slice(0, 10)) === dateKey);
    const progress = scores.length
      ? Math.round(scores.reduce((total, quiz) => total + Number(quiz.percentage ?? quiz.score ?? 0), 0) / scores.length)
      : null;
    return { day: date.toLocaleDateString("en-US", { weekday: "short" }), progress };
  });
  return days;
};

/* ===================== DASHBOARD ===================== */
export default function Dashboard() {
  const navigate = useNavigate();
  const { planUpdated } = useStudy();

  const [bannerVisible, setBannerVisible] = useState(true);
  const [message, setMessage] = useState("");
  const [courses, setCourses] = useState([]);
  const [studyPlanDays, setStudyPlanDays] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const { user, userProfile } = useAuth();

  useEffect(() => {
    async function loadDashboardData() {
      if (!user?.uid) return;
      try {
        const [c, p, q] = await Promise.all([
          getUserCourses(user.uid),
          getStudyPlan(user.uid),
          getQuizHistory(user.uid),
        ]);
        if (c && c.length > 0) setCourses(c);
        if (p && p.length > 0) setStudyPlanDays(p);
        if (q && q.length > 0) setQuizzes(q);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    }
    loadDashboardData();
  }, [user]);

  const todayDay = studyPlanDays.find((day) => day.date === getLocalDateString()) || studyPlanDays.find((day) => day.status === "today");
  const todayTasks = todayDay?.tasks?.slice(0, 3) || [];
  const completedTasks = todayDay?.tasks?.filter((task) => task.status === "completed").length || 0;
  const totalTasks = todayDay?.tasks?.length || todayTasks.length;
  const studyMinutesToday = todayDay?.tasks
    ?.filter((task) => task.status === "completed")
    .reduce((total, task) => total + minutesFromDuration(task.duration), 0) || 0;
  const dailyGoalMinutes = userProfile?.dailyGoalMinutes || 120;
  const dailyGoalProgress = Math.min(100, Math.round((studyMinutesToday / dailyGoalMinutes) * 100));
  const weeklyProgress = buildWeeklyProgress(quizzes);

  const displayName = userProfile?.fullName || userProfile?.name || user?.displayName || "Student";
  const firstName = displayName.split(" ")[0] || "Student";

  const subjects = courses.length > 0
    ? courses.slice(0, 4).map((c) => ({
        id: c.id,
        name: c.name,
        mastery: c.progress || 0,
      }))
    : [];

  const dynamicDeadlines = courses.length > 0 && courses.some((c) => c.examDate)
    ? courses
        .filter((c) => c.examDate)
        .slice(0, 3)
        .map((c) => ({
          title: `${c.name} ${c.examType || "Exam"}`,
          date: c.examDate,
          days: `${c.daysUntilExam || 30} days left`,
          tone: (c.daysUntilExam || 30) <= 15 ? "danger" : "warning",
          icon: FileText,
        }))
    : [];

  const avgQuizScore = quizzes.length > 0
    ? Math.round(
        quizzes.reduce((acc, q) => acc + (q.percentage ?? q.score ?? 0), 0) / quizzes.length
      )
    : null;

  const sendMessage = async () => {
    const text = message.trim();
    if (!text || chatLoading) return;

    const userMessage = { type: "user", role: "user", text, time: "Just now" };
    const nextMessages = [...chatMessages, userMessage];
    setChatMessages(nextMessages);
    setMessage("");
    setChatLoading(true);
    try {
      const response = await askStudyCoach(nextMessages, {
        university: userProfile?.university,
        semester: userProfile?.semester,
        subject: userProfile?.onboardingData?.subject,
      });
      setChatMessages((previous) => [...previous, { type: "assistant", role: "assistant", text: response, time: "Just now" }]);
    } catch (error) {
      setChatMessages((previous) => [...previous, { type: "assistant", role: "assistant", text: `I couldn't respond: ${error.message}`, time: "Just now" }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    // NOTE: no dashboard-shell/sidebar/header here — AppLayout already renders those.
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 314px", gap: "14px", width: "100%", minWidth: 0 }}>
      {/* MAIN CONTENT */}
      <div style={{ minWidth: 0 }}>
        {planUpdated && bannerVisible && (
          <div
            className="card"
            style={{
              padding: "12px 15px",
              marginBottom: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "linear-gradient(90deg, #F0ECFF, #FFFFFF)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#6347F5",
                  color: "#fff",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <BrainCircuit size={16} />
              </div>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 650 }}>Your study plan was updated by AI</p>
                <p style={{ fontSize: "10px", color: "var(--muted)", marginTop: "2px" }}>
                  We've adjusted your schedule based on your recent quiz performance.
                </p>
              </div>
            </div>
            <button onClick={() => setBannerVisible(false)}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* STAT CARDS */}
        <div className="stat-grid">
          <div className="card stat-card tone-purple">
            <div className="stat-icon"><Clock size={18} /></div>
            <div className="stat-content">
              <div className="stat-heading">Study Time Today</div>
              <div className="stat-value">{formatMinutes(studyMinutesToday)}</div>
              <div className="stat-meta">
                <span>Goal: {formatMinutes(dailyGoalMinutes)}</span>
                <strong>{dailyGoalProgress}%</strong>
              </div>
              <div className="thin-track">
                <span style={{ width: `${dailyGoalProgress}%` }} />
              </div>
            </div>
          </div>

          <div className="card stat-card tone-green">
            <div className="stat-icon"><CheckCircle2 size={18} /></div>
            <div className="stat-content">
              <div className="stat-heading">Tasks Completed</div>
              <div className="stat-value">
                {completedTasks}
                <span className="stat-suffix">/ {totalTasks}</span>
              </div>
              <div className="stat-meta">
                <span>{completedTasks === totalTasks && totalTasks > 0 ? "Goal reached!" : "Almost there!"}</span>
                <strong>{totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%</strong>
              </div>
              <div className="thin-track">
                <span style={{ width: `${totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%` }} />
              </div>
            </div>
          </div>

          <div className="card stat-card tone-orange">
            <div className="stat-icon"><TrendingUp size={18} /></div>
            <div className="stat-content">
              <div className="stat-heading">Quizzes Score</div>
              <div className="stat-value">{avgQuizScore === null ? "—" : `${avgQuizScore}%`}</div>
              <div className="stat-growth">{quizzes.length ? "Based on your quiz history" : "Complete a quiz to see your score"}</div>
            </div>
          </div>
        </div>

        {/* TODAY'S STUDY PLAN + QUICK ACTIONS */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px", gap: "14px" }}>
          <div className="card study-plan-card" style={{ margin: 0 }}>
            <div className="card-header compact">
              <h2>Today's Study Plan</h2>
              <button className="date-control">
                <span>{new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                <Calendar size={15} />
              </button>
            </div>

            <div className="study-rows">
              {todayTasks.length === 0 ? (
                <p className="empty-dashboard-state">No study tasks scheduled for today.</p>
              ) : todayTasks.map((task, index) => {
                const status =
                  task.status === "completed" ? "completed" : task.status === "in-progress" ? "in-progress" : "pending";
                return (
                  <div className="study-row" key={task.id || index}>
                    <div className="study-status-wrap">
                      <div className={`status-circle ${status}`}>
                        {status === "completed" && <CheckCircle2 size={16} />}
                        {status === "in-progress" && <ArrowRight size={16} />}
                        {status === "pending" && <Circle size={27} strokeWidth={1.7} />}
                      </div>
                      {index < todayTasks.length - 1 && <span className="timeline-line" />}
                    </div>
                    <div className="study-copy">
                      <h3>{task.topic}</h3>
                      <p>{task.type || "Practice"} • {task.duration || "20 min"}</p>
                    </div>
                    <span className={`study-badge ${status}`}>
                      {status === "completed" ? "Completed" : status === "in-progress" ? "In Progress" : "Pending"}
                    </span>
                    <ChevronRight size={16} className="study-arrow" />
                  </div>
                );
              })}
            </div>

            <button className="full-plan-btn" onClick={() => navigate("/study-plan")}>
              View Full Plan
              <ArrowRight size={14} />
            </button>
          </div>

          <QuickActionsCard />
        </div>

        {/* SUBJECTS + WEEKLY PROGRESS */}
        <div className="lower-grid">
          <div className="card subject-card">
            <div className="card-header compact">
              <h2>Subjects Overview</h2>
              <button onClick={() => navigate("/subjects")}>View All</button>
            </div>

            <div className="subject-list">
              {subjects.length === 0 ? (
                <p className="empty-dashboard-state">Add a course to start tracking your progress.</p>
              ) : subjects.map((subject, index) => {
                const mastery = subject.mastery ?? subject.progress ?? 0;
                return (
                  <div className="subject-row" key={subject.id || index}>
                    <div className={`subject-icon subject-${index}`}>
                      {index === 0 && <BookOpen size={14} />}
                      {index === 1 && <Code2 size={14} />}
                      {index === 2 && <Target size={14} />}
                      {index === 3 && <TrendingUp size={14} />}
                    </div>
                    <span className="subject-name">{subject.name}</span>
                    <div className="subject-bar"><span style={{ width: `${mastery}%` }} /></div>
                    <span className="subject-percent">{mastery}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card weekly-card">
            <div className="card-header compact">
              <h2>Weekly Progress</h2>
              <button className="week-select">This Week<span>⌄</span></button>
            </div>

            <div className="weekly-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyProgress} margin={{ top: 8, right: 2, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="weeklyProgressGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6347F5" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#6347F5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#F0F0F4" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#777B8C", fontSize: 9 }} dy={6} />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} axisLine={false} tickLine={false} tick={{ fill: "#777B8C", fontSize: 9 }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #ECECF2", fontSize: "11px" }} />
                  <Area
                    type="monotone"
                    dataKey="progress"
                    stroke="#6347F5"
                    strokeWidth={2}
                    fill="url(#weeklyProgressGradient)"
                    dot={{ r: 3.5, fill: "#6347F5", strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#6347F5" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="bottom-section">
          <div className="consistency-card">
            <div className="student-illustration"><StudentIllustration /></div>
            <div className="consistency-copy">
              <h3>Consistency today,<br /><span>Success tomorrow.</span></h3>
              <p>Keep going, {firstName}! You've got this. 💪</p>
              <button onClick={() => navigate("/study-plan")}>Start Studying</button>
            </div>
          </div>

          <div className="recommendations">
            <div className="rec-head">
              <h2>Recommended for You</h2>
              <button onClick={() => navigate("/materials")}>View All</button>
            </div>
            <p className="empty-dashboard-state">Upload study materials to receive recommendations.</p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <aside className="dashboard-aside" style={{ borderLeft: "0", padding: "0", background: "transparent", minWidth: 0 }}>
        <div className="card ai-card">
          <div className="ai-header">
            <div>
              <div className="ai-title">
                <Bot size={17} />
                <h2>AI Study Coach</h2>
                <span>Beta</span>
              </div>
              <p>Your AI study buddy. Ask anything!</p>
            </div>
            <MoreVertical size={17} />
          </div>

          <div className="ai-messages">
            {chatMessages.length === 0 && (
              <p className="empty-dashboard-state">Ask a question to start a real conversation with your coach.</p>
            )}
            {chatMessages.map((chat, index) => (
              <div className={`chat-row ${chat.type}`} key={index}>
                {chat.type === "assistant" && (
                  <div className="assistant-avatar"><Bot size={14} /></div>
                )}
                <div className={`chat-bubble ${chat.type}`} style={{ whiteSpace: "pre-line" }}>
                  {chat.text}
                  <div
                    style={{
                      fontSize: "8px",
                      marginTop: "5px",
                      opacity: 0.65,
                      textAlign: chat.type === "user" ? "right" : "left",
                    }}
                  >
                    {chat.time}
                  </div>
                  {chat.type === "assistant" && (
                    <div style={{ display: "flex", gap: "9px", marginTop: "6px", color: "#9295A5" }}>
                      <Copy size={11} />
                      <ThumbsUp size={11} />
                      <ThumbsDown size={11} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="ai-input-wrap">
            <div className="ai-input">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }}
                placeholder="Ask anything..."
              />
              <button type="button" aria-label="Attach"><Paperclip size={15} /></button>
              <button type="button" aria-label="Voice"><Mic size={15} /></button>
              <button type="button" className="send-btn" onClick={sendMessage} disabled={chatLoading} aria-label="Send"><Send size={15} /></button>
            </div>
          </div>
        </div>

        <div className="card deadlines-card">
          <div className="card-header compact">
            <h2>Upcoming Deadlines</h2>
            <button onClick={() => navigate("/study-plan")}>View All</button>
          </div>

          <div className="deadline-list">
            {dynamicDeadlines.length === 0 && <p className="empty-dashboard-state">No upcoming deadlines yet.</p>}
            {dynamicDeadlines.map((deadline, index) => {
              const Icon = deadline.icon;
              return (
                <div className="deadline-row" key={deadline.title}>
                  <div className={`deadline-icon deadline-${index}`}><Icon size={15} /></div>
                  <div className="deadline-copy">
                    <strong>{deadline.title}</strong>
                    <span>{deadline.date}</span>
                  </div>
                  <span className={`days-left ${deadline.tone}`}>{deadline.days}</span>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ===================== STUDENT ILLUSTRATION ===================== */
function StudentIllustration() {
  return (
    <svg viewBox="0 0 180 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="67" y="94" width="75" height="43" rx="4" fill="#D9DCE8" />
      <rect x="72" y="99" width="65" height="32" rx="2" fill="#FFFFFF" />
      <path d="M55 138H151L158 143H48L55 138Z" fill="#B8BDCE" />
      <path d="M42 123C45 101 56 85 76 80L96 93L88 137H40L42 123Z" fill="#6347F5" />
      <path d="M64 87L78 81L91 91L83 107L69 98L64 87Z" fill="#7459F7" />
      <circle cx="75" cy="56" r="23" fill="#F2B27D" />
      <path d="M54 56C53 39 63 28 78 30C91 31 98 41 96 55C91 47 85 44 76 44C68 44 61 48 54 56Z" fill="#252632" />
      <path d="M54 54C52 62 55 68 59 70L62 57L58 47L54 54Z" fill="#252632" />
      <circle cx="96" cy="57" r="5" fill="#EAA46F" />
      <circle cx="69" cy="57" r="2" fill="#252632" />
      <circle cx="84" cy="57" r="2" fill="#252632" />
      <path d="M72 68C76 71 81 71 85 68" stroke="#A55F45" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M88 96C97 101 105 107 112 113L105 121C96 116 87 110 80 105L88 96Z" fill="#F2B27D" />
      <path d="M26 119C22 109 23 99 30 92C32 103 30 112 26 119Z" fill="#18A86B" />
      <path d="M29 118C34 107 42 104 49 105C44 114 37 119 29 118Z" fill="#159A67" />
      <path d="M29 115V139" stroke="#8A6848" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 139H43" stroke="#C3A27E" strokeWidth="3" strokeLinecap="round" />
      <circle cx="31" cy="74" r="3" fill="#FF8A34" />
      <circle cx="115" cy="42" r="3" fill="#6347F5" />
    </svg>
  );
}
