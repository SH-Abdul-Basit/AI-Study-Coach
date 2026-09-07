import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import { useAuth } from '../context/AuthContext';
import { getStudyPlan, updateTaskStatus as fbUpdateTaskStatus } from '../firebase/firestore';
import { mockStudyPlan, mockCourses, mockProgressStats, mockPlanChanges } from '../data/mockData';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  BrainCircuit, 
  PlayCircle,
  ArrowRight
} from 'lucide-react';

export default function StudyPlanPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dldCourse = mockCourses.find(c => c.code === 'DLD');
  const [plan, setPlan] = useState(mockStudyPlan);

  useEffect(() => {
    async function loadPlan() {
      try {
        const savedPlan = await getStudyPlan(user?.uid);
        if (savedPlan && savedPlan.length > 0) {
          setPlan(savedPlan);
        }
      } catch (err) {
        console.error("Failed to load study plan from Firestore:", err);
      }
    }
    loadPlan();
  }, [user]);

  const toggleTask = (dayIndex, taskId) => {
    setPlan(prevPlan => {
      const newPlan = [...prevPlan];
      const dayTasks = [...newPlan[dayIndex].tasks];
      const taskIndex = dayTasks.findIndex(t => t.id === taskId);
      
      if (taskIndex !== -1) {
        const newStatus = dayTasks[taskIndex].status === 'completed' ? 'not-started' : 'completed';
        dayTasks[taskIndex] = {
          ...dayTasks[taskIndex],
          status: newStatus,
        };
        newPlan[dayIndex].tasks = dayTasks;
        // Persist to Firestore asynchronously
        fbUpdateTaskStatus(user?.uid, dayIndex, taskId, newStatus);
      }
      return newPlan;
    });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20';
      case 'high': return 'bg-[#FF8A34]/10 text-[#FF8A34] border-[#FF8A34]/20';
      case 'medium': return 'bg-[#6347F5]/10 text-[#6347F5] border-[#6347F5]/20';
      default: return 'bg-[#9295A5]/10 text-[#6F7182] border-[#ECECF2]';
    }
  };

  const getDayStatusStyle = (status) => {
    switch(status) {
      case 'completed': return 'bg-[#18A86B]/10 text-[#18A86B] border-[#18A86B]/20';
      case 'today': return 'bg-[#6347F5] text-white border-[#6347F5]';
      case 'upcoming': return 'bg-[#FCFCFE] text-[#6F7182] border-[#ECECF2]';
      default: return 'bg-[#FCFCFE] text-[#6F7182] border-[#ECECF2]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Card */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-[24px] font-[650] text-[#202033] tracking-[-0.035em] leading-[1.15] mb-2">Your Personalized Study Plan</h1>
            <p className="text-[13px] text-[#6F7182] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FF8A34]" /> 
              DLD Final in {dldCourse?.daysUntilExam || 12} days
            </p>
          </div>
          <div className="w-full md:w-64">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-[600] text-[#202033]">Plan Completion</span>
              <span className="text-[13px] font-[700] text-[#6347F5]">{mockProgressStats.planCompletion}%</span>
            </div>
            <div className="w-full bg-[#EEEEF4] rounded-full h-[6px] overflow-hidden">
              <div 
                className="bg-[#6347F5] h-full rounded-full transition-all duration-300" 
                style={{ width: `${mockProgressStats.planCompletion}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-[15px] font-[700] text-[#202033] tracking-[-0.015em]">Day-by-Day Schedule</h2>
          
          <div className="space-y-5 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#ECECF2] before:to-transparent">
            {plan.map((day, dayIndex) => (
              <div key={day.day} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline Marker */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${
                  day.status === 'today' ? 'bg-[#6347F5] text-white' : 
                  day.status === 'completed' ? 'bg-[#18A86B] text-white' : 'bg-[#ECECF2] text-[#9295A5]'
                }`}>
                  {day.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-[13px] font-[700]">{day.day}</span>}
                </div>
                
                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-[700] text-[#202033] text-[15px]">{day.label}</h3>
                      <span className="text-[12px] text-[#9295A5]">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-[600] rounded-[6px] uppercase tracking-wider ${
                      day.status === 'today' ? 'bg-[#6347F5] text-white' :
                      day.status === 'completed' ? 'bg-[#EAF8F1] text-[#159864]' : 'bg-[#F5F5F7] text-[#8C909F]'
                    }`}>
                      {day.status}
                    </span>
                  </div>

                  {day.aiUpdated && (
                    <div className="bg-[#F0ECFF] border border-[#6347F5]/20 rounded-[8px] p-3 mb-4 flex gap-2 text-xs text-[#202033]">
                      <BrainCircuit className="w-4 h-4 text-[#6347F5] shrink-0 mt-0.5" />
                      <p className="text-[12px] text-[#202033]"><strong className="font-[650]">AI Updated:</strong> {day.aiReason}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {day.tasks.map(task => (
                      <div key={task.id} className="p-3 rounded-[8px] border border-[#ECECF2] bg-[#FCFCFE] hover:border-[#6347F5]/30 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className={`text-[13.5px] font-[650] ${task.status === 'completed' ? 'line-through text-[#9295A5]' : 'text-[#202033]'}`}>
                            {task.topic}
                          </h4>
                          <span className={`px-2 py-0.5 text-[10px] font-[600] rounded-[6px] capitalize shrink-0 ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 text-[11px] text-[#6F7182]">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {task.duration}</span>
                            <span className="bg-[#ECECF2] px-1.5 py-0.5 rounded-[4px] text-[#202033] font-[500]">{task.type}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {task.type.toLowerCase().includes('quiz') ? (
                              <button 
                                onClick={() => navigate('/practice')}
                                className="text-[11px] bg-[#F0ECFF] text-[#6347F5] hover:bg-[#6347F5]/20 px-2.5 py-1 rounded-[6px] font-[650] flex items-center gap-1 transition-colors"
                              >
                                <PlayCircle className="w-3.5 h-3.5" /> Take Quiz
                              </button>
                            ) : null}
                            
                            <button 
                              onClick={() => toggleTask(dayIndex, task.id)}
                              className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-[6px] font-[650] transition-colors ${
                                task.status === 'completed' 
                                  ? 'text-[#18A86B] bg-[#EAF8F1] hover:bg-[#18A86B]/20' 
                                  : 'text-[#6F7182] bg-[#ECECF2] hover:bg-[#E0E0E6]'
                              }`}
                            >
                              {task.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                              {task.status === 'completed' ? 'Completed' : 'Mark Done'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Plan Changes Sidebar */}
        <div className="space-y-6">
          <div className="card p-6 bg-[#FCFCFE] sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#6347F5] p-2 rounded-[8px] text-white mr-2">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h2 className="text-[15px] font-[700] text-[#202033] tracking-[-0.015em]">AI Plan Log</h2>
            </div>
            
            <p className="text-[12px] text-[#6F7182] mb-5 leading-relaxed">Here's how your coach has adapted your schedule recently based on your progress.</p>
            
            <div className="space-y-4">
              {mockPlanChanges.map(change => (
                <div key={change.id} className="relative pl-4 border-l-2 border-[#6347F5]/30 pb-4 last:border-0 last:pb-0">
                  <div className="absolute w-2 h-2 bg-[#6347F5] rounded-full -left-[5px] top-1.5"></div>
                  <div className="text-[11px] font-[500] text-[#9295A5] mb-1">
                    {new Date(change.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h4 className="font-[650] text-[#202033] text-[13px] mb-1">{change.title}</h4>
                  <p className="text-[12px] text-[#6F7182] mb-2 leading-relaxed">{change.reason}</p>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {change.affectedTopics.map(topic => (
                      <span key={topic} className="text-[10px] uppercase font-[600] bg-[#ECECF2] text-[#6F7182] px-2 py-0.5 rounded-[4px]">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={() => navigate('/ai-coach')} className="w-full mt-5 bg-white border border-[#6347F5] text-[#6347F5] hover:bg-[#F0ECFF] py-2 rounded-[8px] text-[12.5px] font-[700] transition-colors flex items-center justify-center gap-2">
              Talk to Coach <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}