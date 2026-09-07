import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { Activity, Clock, Target, CheckCircle, TrendingUp, BrainCircuit, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { mockProgressStats, mockTopicMastery, mockQuizTrend, mockWeeklyStudy, mockCoachInsights } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { getProgressStats } from '../firebase/firestore';

const getInsightIcon = (type) => {
  switch (type) {
    case 'plan-update': return <Activity className="w-4.5 h-4.5 text-[#6347F5]" />;
    case 'encouragement': return <Sparkles className="w-4.5 h-4.5 text-[#18A86B]" />;
    case 'weakness': return <AlertCircle className="w-4.5 h-4.5 text-[#EF4444]" />;
    case 'optimization': return <BrainCircuit className="w-4.5 h-4.5 text-[#7458F7]" />;
    default: return <BrainCircuit className="w-4.5 h-4.5 text-[#6F7182]" />;
  }
};

const getInsightColor = (type) => {
  switch (type) {
    case 'plan-update': return 'border-l-[#6347F5]';
    case 'encouragement': return 'border-l-[#18A86B]';
    case 'weakness': return 'border-l-[#EF4444]';
    case 'optimization': return 'border-l-[#7458F7]';
    default: return 'border-l-[#6F7182]';
  }
};

const getMasteryColor = (status) => {
  switch (status) {
    case 'strong': return '#18A86B'; // Success
    case 'moderate': return '#FF8A34'; // Warning
    case 'weak': return '#EF4444'; // Danger
    default: return '#6347F5';
  }
};

export default function ProgressPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(mockProgressStats);

  useEffect(() => {
    async function loadStats() {
      try {
        const stored = await getProgressStats(user?.uid);
        if (stored) {
          setStats(stored);
        }
      } catch (err) {
        console.error("Error loading progress stats:", err);
      }
    }
    loadStats();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#7458F7] to-[#5F45E7] flex items-center justify-center text-white shadow-sm">
          <TrendingUp className="w-4.5 h-4.5" />
        </div>
        <h1 className="text-[24px] font-[650] text-[#202033] tracking-[-0.035em] leading-[1.15]">Progress & Analytics</h1>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard title="Overall Progress" value={`${stats.overallProgress}%`} icon={<Target className="w-4 h-4 text-[#6347F5]" />} />
        <StatCard title="Study Streak" value={`${stats.studyStreak} days`} icon={<Activity className="w-4 h-4 text-[#FF8A34]" />} />
        <StatCard title="Hours This Week" value={`${stats.totalHoursThisWeek}h`} icon={<Clock className="w-4 h-4 text-[#6347F5]" />} />
        <StatCard title="Topics Mastered" value={`${stats.topicsMastered}/${stats.totalTopics}`} icon={<BookOpen className="w-4 h-4 text-[#18A86B]" />} />
        <StatCard title="Quiz Average" value={`${stats.quizAverage}%`} icon={<BrainCircuit className="w-4 h-4 text-[#6347F5]" />} />
        <StatCard title="Plan Completion" value={`${stats.planCompletion}%`} icon={<CheckCircle className="w-4 h-4 text-[#18A86B]" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Mastery Chart */}
        <div className="card p-6">
          <h2 className="text-[15px] font-[700] text-[#202033] tracking-[-0.015em] mb-4">Topic Mastery</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTopicMastery} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ECECF2" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={110} axisLine={false} tickLine={false} tick={{ fill: '#6F7182', fontSize: 11 }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #ECECF2', fontSize: '11px', boxShadow: '0 2px 8px rgba(30,30,60,.04)' }} />
                <Bar dataKey="mastery" radius={[0, 4, 4, 0]} barSize={18}>
                  {mockTopicMastery.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getMasteryColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Study Hours This Week */}
        <div className="card p-6">
          <h2 className="text-[15px] font-[700] text-[#202033] tracking-[-0.015em] mb-4">Study Hours This Week</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWeeklyStudy} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECECF2" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6F7182', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6F7182', fontSize: 11 }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #ECECF2', fontSize: '11px', boxShadow: '0 2px 8px rgba(30,30,60,.04)' }} />
                <Bar dataKey="hours" fill="#6347F5" radius={[4, 4, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quiz Performance Over Time */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-[15px] font-[700] text-[#202033] tracking-[-0.015em] mb-4">Quiz Performance Over Time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockQuizTrend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECECF2" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6F7182', fontSize: 11 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#6F7182', fontSize: 11 }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #ECECF2', fontSize: '11px', boxShadow: '0 2px 8px rgba(30,30,60,.04)' }} />
                <Line type="monotone" dataKey="score" stroke="#18A86B" strokeWidth={2.5} dot={{ r: 4, fill: '#18A86B' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Learning Insights */}
      <div className="space-y-4">
        <h2 className="text-[15px] font-[700] text-[#202033] tracking-[-0.015em] flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-[#6347F5]" />
          AI Learning Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCoachInsights.map((insight) => (
            <div key={insight.id} className={`card p-5 border-l-4 ${getInsightColor(insight.type)}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{getInsightIcon(insight.type)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-[700] uppercase tracking-wider text-[#9295A5]">{insight.type.replace('-', ' ')}</span>
                    {insight.relatedTopic && (
                      <span className="text-[10px] bg-[#F0ECFF] text-[#6347F5] px-2 py-0.5 rounded-[6px] font-[600]">
                        {insight.relatedTopic}
                      </span>
                    )}
                  </div>
                  <p className="text-[#202033] text-[12.5px] leading-relaxed">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="card p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[11px] font-[600] text-[#6F7182] uppercase tracking-wide leading-tight">{title}</h3>
        <div className="w-7 h-7 rounded-full bg-[#F8F7FC] flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
      <p className="text-[23px] font-[700] text-[#202033] tracking-[-0.025em] leading-tight">{value}</p>
    </div>
  );
}