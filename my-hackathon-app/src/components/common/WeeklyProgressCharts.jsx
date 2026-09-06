import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { chartData } from '../mockData';

const peakPoint = chartData.find((d) => d.day === 'Fri') || chartData[0];

export default function WeeklyProgressChart() {
  return (
    <section className="card weekly-card">
      <div className="card-header compact">
        <h2>Weekly Progress</h2>
        <button className="week-select" type="button">This Week <span>⌄</span></button>
      </div>

      <div className="weekly-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="studyProgressFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6347F5" stopOpacity={0.14} />
                <stop offset="100%" stopColor="#6347F5" stopOpacity={0.015} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#F0F0F5" strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: '#9295A5' }}
              dy={6}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: '#9295A5' }}
            />
            <Tooltip
              cursor={false}
              formatter={(value) => [`${value}%`, 'Progress']}
              contentStyle={{
                border: '1px solid #ECECF2',
                borderRadius: 8,
                boxShadow: '0 3px 10px rgba(30,30,60,.05)',
                fontSize: 10,
              }}
            />
            <Area
              type="monotone"
              dataKey="progress"
              stroke="#6347F5"
              strokeWidth={2}
              fill="url(#studyProgressFill)"
              dot={{ r: 2.5, fill: '#6347F5', stroke: '#fff', strokeWidth: 1.5 }}
              activeDot={{ r: 3.5, fill: '#6347F5' }}
            />
            <ReferenceDot
              x={peakPoint.day}
              y={peakPoint.progress}
              r={0}
              label={{
                value: `${peakPoint.progress}%`,
                position: 'top',
                fill: '#6347F5',
                fontSize: 9,
                fontWeight: 700,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
