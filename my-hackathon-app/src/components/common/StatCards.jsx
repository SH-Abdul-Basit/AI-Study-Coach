import React from 'react';
import { Clock3, CheckSquare2, BarChart3 } from 'lucide-react';
import { stats } from '../mockData';

const cards = [
  {
    key: 'study',
    title: 'Study Time Today',
    value: stats.studyTime.current,
    subtitle: `Goal: ${stats.studyTime.goal}`,
    percent: stats.studyTime.percent,
    icon: Clock3,
    tone: 'purple',
  },
  {
    key: 'tasks',
    title: 'Tasks Completed',
    value: stats.tasks.current,
    suffix: `/ ${stats.tasks.total}`,
    subtitle: 'Almost there!',
    percent: stats.tasks.percent,
    icon: CheckSquare2,
    tone: 'green',
  },
  {
    key: 'quizzes',
    title: 'Quizzes Score',
    value: stats.quizzes.score,
    subtitle: `Top ${stats.quizzes.topPercent} this week`,
    icon: BarChart3,
    tone: 'orange',
  },
];

export default function StatCards() {
  return (
    <section className="stat-grid">
      {cards.map(({ key, title, value, suffix, subtitle, percent, icon: Icon, tone }) => (
        <article className={`stat-card tone-${tone}`} key={key}>
          <div className="stat-icon"><Icon size={17} strokeWidth={2} /></div>
          <div className="stat-content">
            <div className="stat-heading">{title}</div>
            <div className="stat-value">{value}{suffix && <span className="stat-suffix">{suffix}</span>}</div>
            {percent ? (
              <>
                <div className="stat-meta"><span>{subtitle}</span><span>{percent}%</span></div>
                <div className="thin-track"><span style={{ width: `${percent}%` }} /></div>
              </>
            ) : (
              <div className="stat-growth">{subtitle} <span>^</span></div>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
