import React from 'react';
import { BookOpen, Code2, Calculator, FlaskConical } from 'lucide-react';
import { subjects } from '../mockData';

const icons = [BookOpen, Code2, Calculator, FlaskConical];

export default function SubjectsOverview() {
  return (
    <section className="card subject-card">
      <div className="card-header compact">
        <h2>Subjects Overview</h2>
        <button type="button">View All</button>
      </div>

      <div className="subject-list">
        {subjects.map((subject, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div className="subject-row" key={subject.id}>
              <span className={`subject-icon subject-${i}`}><Icon size={14} /></span>
              <span className="subject-name">{subject.name}</span>
              <span className="subject-bar"><span style={{ width: `${subject.percent}%` }} /></span>
              <span className="subject-percent">{subject.percent}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
