import React from 'react';
import { FileText, BookOpen, ClipboardList } from 'lucide-react';
import { upcomingDeadlines } from '../mockData';

const icons = [FileText, BookOpen, ClipboardList];

export default function UpcomingDeadlines() {
  return (
    <section className="card deadlines-card">
      <div className="card-header compact">
        <h2>Upcoming Deadlines</h2>
        <button type="button">View All</button>
      </div>

      <div className="deadline-list">
        {upcomingDeadlines.map((item, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div className="deadline-row" key={item.id}>
              <span className={`deadline-icon deadline-${i}`}><Icon size={14} /></span>
              <div className="deadline-copy">
                <strong>{item.title}</strong>
                <span>{item.date}</span>
              </div>
              <span className={`days-left ${item.type}`}>{item.daysLeft} days left</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
