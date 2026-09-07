import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, FileText, BrainCircuit, Calendar, Clock, Plus, ArrowLeft, TrendingUp, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserCourses, addCourse as fbAddCourse } from '../firebase/firestore';

export default function CoursesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingCourse, setSavingCourse] = useState(false);
  const [courseError, setCourseError] = useState('');
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    semester: '',
    teacher: '',
    examDate: '',
    examType: 'Final',
  });

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getUserCourses(user?.uid);
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, [user]);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (savingCourse) return;
    const normalizedName = newCourse.name.trim().toLowerCase();
    const normalizedCode = newCourse.code.trim().toLowerCase();
    if (courses.some((course) => course.name?.trim().toLowerCase() === normalizedName && course.code?.trim().toLowerCase() === normalizedCode)) {
      setCourseError('This course is already in your course list.');
      return;
    }
    setSavingCourse(true);
    setCourseError('');
    try {
      const colors = ['#6347F5', '#18A86B', '#FF8A34', '#05A6F0', '#E03A3A'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const created = await fbAddCourse(user?.uid, {
        ...newCourse,
        progress: 10,
        topics: [],
        materials: 0,
        quizzesTaken: 0,
        color: randomColor,
        daysUntilExam: 30,
      });
      if (created.existing) {
        setCourseError('This course is already in your course list.');
        return;
      }
      setCourses(prev => [created, ...prev]);
      setShowAddModal(false);
      setNewCourse({
        name: '',
        code: '',
        semester: '',
        teacher: '',
        examDate: '',
        examType: 'Final',
      });
    } catch (err) {
      console.error("Failed to add course:", err);
      setCourseError('We could not save this course. Please try again.');
    } finally {
      setSavingCourse(false);
    }
  };

  if (selectedCourse) {
    // Dynamic Course Detail View
    const topics = Array.isArray(selectedCourse.topics) ? selectedCourse.topics : [];

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <button 
          onClick={() => setSelectedCourse(null)}
          className="flex items-center gap-2 text-[#6F7182] hover:text-[#6347F5] transition-colors text-[13px] font-[600] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </button>

        <div className="card overflow-hidden">
          <div className="h-2 w-full" style={{ backgroundColor: selectedCourse.color }}></div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-[700] px-2 py-0.5 rounded-[6px] bg-[#F0ECFF] text-[#6347F5]">
                    {selectedCourse.code}
                  </span>
                  <span className="text-[12px] text-[#6F7182]">{selectedCourse.teacher}</span>
                </div>
                <h1 className="text-[24px] font-[650] text-[#202033] tracking-[-0.035em]">{selectedCourse.name}</h1>
              </div>
              <div className="flex gap-2.5 shrink-0">
                <button 
                  onClick={() => navigate('/practice')}
                  className="px-3.5 py-2 bg-white border border-[#ECECF2] text-[#202033] rounded-[8px] text-[12.5px] font-[650] hover:bg-[#FCFCFE] cursor-pointer"
                >
                  Take Quiz
                </button>
                <button 
                  onClick={() => navigate('/study-plan')}
                  className="px-3.5 py-2 bg-[#6347F5] text-white rounded-[8px] text-[12.5px] font-[700] hover:bg-[#5236E5] cursor-pointer"
                >
                  View Study Plan
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mt-6 pt-5 border-t border-[#ECECF2]">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4.5 h-4.5 text-[#9295A5]" />
                <div>
                  <div className="text-[11px] text-[#6F7182]">Exam Date ({selectedCourse.examType})</div>
                  <div className="text-[13px] font-[650] text-[#202033]">{selectedCourse.examDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4.5 h-4.5 text-[#FF8A34]" />
                <div>
                  <div className="text-[11px] text-[#6F7182]">Time Until Exam</div>
                  <div className="text-[13px] font-[700] text-[#FF8A34]">{selectedCourse.daysUntilExam} days</div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-[13px] mb-1.5">
                <span className="font-[600] text-[#202033]">Overall Progress</span>
                <span className="font-[700] text-[#6347F5]">{selectedCourse.progress}%</span>
              </div>
              <div className="w-full bg-[#EEEEF4] rounded-full h-[6px] overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${selectedCourse.progress}%`, backgroundColor: selectedCourse.color }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-[15px] font-[700] text-[#202033] tracking-[-0.015em] mb-4">Topic Mastery</h2>
              <div className="space-y-3">
                {topics.length === 0 && <p className="text-[12px] text-[#6F7182]">No topics have been added yet.</p>}
                {topics.map(topic => (
                  <div key={topic.id} className="flex items-center justify-between p-3 border border-[#ECECF2] rounded-[8px] bg-[#FCFCFE]">
                    <div>
                      <div className="text-[13.5px] font-[650] text-[#202033]">{topic.name}</div>
                      <div className="text-[11px] text-[#6F7182] flex items-center gap-1 mt-0.5">
                        <TrendingUp className={`w-3 h-3 ${topic.trend === 'up' ? 'text-[#18A86B]' : topic.trend === 'down' ? 'text-[#EF4444]' : 'text-[#9295A5]'}`} />
                        {topic.status}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[13px] font-[700] ${topic.mastery < 50 ? 'text-[#EF4444]' : topic.mastery > 80 ? 'text-[#18A86B]' : 'text-[#FF8A34]'}`}>
                        {topic.mastery}%
                      </div>
                      <div className="w-24 bg-[#EEEEF4] rounded-full h-[4px] mt-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${topic.mastery < 50 ? 'bg-[#EF4444]' : topic.mastery > 80 ? 'bg-[#18A86B]' : 'bg-[#FF8A34]'}`}
                          style={{ width: `${topic.mastery}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div 
              onClick={() => navigate('/materials')}
              className="card p-5 cursor-pointer hover:border-[#6347F5]/50 transition-all group"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-[700] text-[#202033] text-[15px] group-hover:text-[#6347F5]">Course Materials</h3>
                <div className="w-8 h-8 rounded-[8px] bg-[#F0ECFF] flex items-center justify-center text-[#6347F5]">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-[23px] font-[700] text-[#202033] tracking-[-0.025em]">{selectedCourse.materials}</div>
              <div className="text-[12px] text-[#9295A5]">Files analyzed by AI</div>
            </div>

            <div 
              onClick={() => navigate('/practice')}
              className="card p-5 cursor-pointer hover:border-[#6347F5]/50 transition-all group"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-[700] text-[#202033] text-[15px] group-hover:text-[#6347F5]">Recent Quizzes</h3>
                <div className="w-8 h-8 rounded-[8px] bg-[#F0ECFF] flex items-center justify-center text-[#6347F5]">
                  <BrainCircuit className="w-4 h-4" />
                </div>
              </div>
              <div className="text-[23px] font-[700] text-[#202033] tracking-[-0.025em]">{selectedCourse.quizzesTaken}</div>
              <div className="text-[12px] text-[#9295A5]">Completed quizzes</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Course List View
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-[650] text-[#202033] tracking-[-0.035em] leading-[1.15]">My Courses</h1>
          <p className="text-[13px] text-[#6F7182] mt-1">Manage your enrolled courses</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#6347F5] text-white px-4 py-2 rounded-[8px] text-[12.5px] font-[700] hover:bg-[#5236E5] flex items-center gap-2 w-fit cursor-pointer transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {loading ? (
        <div className="card p-12 text-center border border-[#ECECF2] rounded-[12px] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#6347F5] border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-[13.5px] font-[600] text-[#6F7182]">Loading your enrolled courses...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="card p-12 text-center border border-dashed border-[#ECECF2] rounded-[12px]">
          <div className="w-12 h-12 rounded-full bg-[#F0ECFF] flex items-center justify-center mx-auto mb-4 text-[#6347F5]">
            <Book className="w-6 h-6" />
          </div>
          <h3 className="text-[17px] font-[700] text-[#202033] mb-1">No Courses Enrolled Yet</h3>
          <p className="text-[13px] text-[#6F7182] max-w-md mx-auto mb-6">
            Get started by adding your current semester courses, or complete your onboarding questionnaire to let your AI coach build your personalized syllabus.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#6347F5] text-white px-4 py-2 rounded-[8px] text-[12.5px] font-[700] hover:bg-[#5236E5] transition-colors cursor-pointer"
            >
              + Add Your First Course
            </button>
            <button
              onClick={() => navigate('/questainaire')}
              className="bg-white border border-[#ECECF2] text-[#202033] px-4 py-2 rounded-[8px] text-[12.5px] font-[650] hover:bg-[#FCFCFE] transition-colors cursor-pointer"
            >
              Take Questionnaire
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div 
              key={course.id} 
              onClick={() => setSelectedCourse(course)}
              className="card overflow-hidden cursor-pointer hover:border-[#6347F5]/40 transition-all group flex flex-col"
            >
              <div className="h-1.5 w-full transition-all group-hover:h-2" style={{ backgroundColor: course.color || '#6347F5' }}></div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-[700] px-2 py-0.5 rounded-[6px] bg-[#F0ECFF] text-[#6347F5]">
                    {course.code || 'COURSE'}
                  </span>
                  <span className="text-[10px] font-[600] text-[#FF8A34] bg-[#FFF3EB] px-2 py-0.5 rounded-[6px]">
                    {course.daysUntilExam || 30} days to {course.examType || 'Exam'}
                  </span>
                </div>
                
                <h2 className="text-[15px] font-[700] text-[#202033] mb-1 line-clamp-1 group-hover:text-[#6347F5] transition-colors">{course.name}</h2>
                <p className="text-[12px] text-[#6F7182] mb-4">{course.teacher || 'Instructor'}</p>
                
                <div className="mt-auto space-y-3.5">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-[500] text-[#6F7182]">Progress</span>
                      <span className="font-[700] text-[#202033]">{course.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-[#EEEEF4] rounded-full h-[4px] overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ width: `${course.progress || 0}%`, backgroundColor: course.color || '#6347F5' }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-3.5 border-t border-[#ECECF2]">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#9295A5]">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{course.materials || 0} materials</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#9295A5]">
                      <BrainCircuit className="w-3.5 h-3.5" />
                      <span>{course.quizzesTaken || 0} quizzes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[12px] shadow-xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh] border border-[#ECECF2]">
            <div className="flex items-center justify-between p-4 border-b border-[#ECECF2]">
              <h3 className="font-[700] text-[#202033] text-[15px]">Add New Course</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#9295A5] hover:text-[#202033] cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCourse} className="p-5 space-y-4 overflow-y-auto">
              {courseError && <p className="text-[12px] text-[#DC2626] bg-[#FEF2F2] border border-[#FCA5A5] rounded-[8px] p-2.5">{courseError}</p>}
              <div>
                <label className="block text-[12px] font-[600] text-[#202033] mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  className="w-full border border-[#ECECF2] rounded-[8px] px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#6347F5] bg-[#FCFCFE] text-[#202033]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-[600] text-[#202033] mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI-301"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                    className="w-full border border-[#ECECF2] rounded-[8px] px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#6347F5] bg-[#FCFCFE] text-[#202033]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-[600] text-[#202033] mb-1">Semester</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5th"
                    value={newCourse.semester}
                    onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
                    className="w-full border border-[#ECECF2] rounded-[8px] px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#6347F5] bg-[#FCFCFE] text-[#202033]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-[600] text-[#202033] mb-1">Teacher</label>
                <input
                  type="text"
                  required
                  placeholder="Instructor name"
                  value={newCourse.teacher}
                  onChange={(e) => setNewCourse({ ...newCourse, teacher: e.target.value })}
                  className="w-full border border-[#ECECF2] rounded-[8px] px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#6347F5] bg-[#FCFCFE] text-[#202033]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-[600] text-[#202033] mb-1">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={newCourse.examDate}
                    onChange={(e) => setNewCourse({ ...newCourse, examDate: e.target.value })}
                    className="w-full border border-[#ECECF2] rounded-[8px] px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#6347F5] bg-[#FCFCFE] text-[#202033]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-[600] text-[#202033] mb-1">Exam Type</label>
                  <select
                    value={newCourse.examType}
                    onChange={(e) => setNewCourse({ ...newCourse, examType: e.target.value })}
                    className="w-full border border-[#ECECF2] rounded-[8px] px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#6347F5] bg-[#FCFCFE] text-[#202033]"
                  >
                    <option>Midterm</option>
                    <option>Final</option>
                    <option>Quiz</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-[#ECECF2] flex justify-end gap-2.5">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3.5 py-2 text-[12px] font-[600] text-[#6F7182] hover:text-[#202033] cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={savingCourse} className="px-4 py-2 bg-[#6347F5] text-white rounded-[8px] text-[12.5px] font-[700] hover:bg-[#5236E5] cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {savingCourse ? 'Saving…' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
