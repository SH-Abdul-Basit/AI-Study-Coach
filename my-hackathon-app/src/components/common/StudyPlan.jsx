import React from 'react';
import { CalendarDays, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { studyPlan } from '../mockData';

export default function StudyPlan() {
  return (
    <section className="card study-plan-card">
      <div className="card-header">
        <h2>Today's Study Plan</h2>
        <div className="date-control"><span>15 May, 2025</span><CalendarDays size={15} /></div>
      </div>

      <div className="study-rows">
        {studyPlan.map((task, idx) => (
          <div className="study-row" key={task.id}>
            <div className="study-status-wrap">
              {task.status === 'Completed' ? (
                <span className="status-circle completed"><CheckCircle2 size={16} /></span>
              ) : task.status === 'In Progress' ? (
                <span className="status-circle in-progress"><ArrowRight size={14} /></span>
              ) : (
                <span className="status-circle pending"><Circle size={16} /></span>
              )}
              {idx < studyPlan.length - 1 && <span className="timeline-line" />}
            </div>

            <div className="study-copy">
              <h3>{task.title}</h3>
              <p>{task.subtitle}</p>
            </div>

            <span className={`study-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
              {task.status}
            </span>
            <ArrowRight className="study-arrow" size={16} />
          </div>
        ))}
      </div>

      <button className="full-plan-btn" type="button">
        View Full Plan <ArrowRight size={15} />
      </button>
    </section>
  );
}
