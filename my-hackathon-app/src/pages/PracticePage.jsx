import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Clock,
  BookOpen,
  Award
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { useAuth } from '../context/AuthContext';
import { getQuizHistory, saveQuizResult as fbSaveQuizResult, getTopicMastery, getUserCourses, getStudyPlan, getMaterials, getPastPapers } from '../firebase/firestore';
import { generatePracticeQuiz } from '../services/gemini';

export default function PracticePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const requestedCourseId = location.state?.courseId;
  const { triggerPlanUpdate } = useStudy();
  const { user } = useAuth();

  const [mode, setMode] = useState(1); // 1: Hub, 2: Quiz, 3: Results
  const [activeTab, setActiveTab] = useState('Quick Quiz');
  const [topicMastery, setTopicMastery] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [studentContext, setStudentContext] = useState({});
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    async function loadData() {
      try {
        const [history, mastery, courses, studyPlan, materials, pastPapers] = await Promise.all([
          getQuizHistory(user?.uid),
          getTopicMastery(user?.uid),
          getUserCourses(user?.uid),
          getStudyPlan(user?.uid),
          getMaterials(user?.uid),
          getPastPapers(user?.uid),
        ]);
        setQuizHistory(history || []);
        setTopicMastery(mastery || []);
        setStudentContext({ courses: courses || [], studyPlan: studyPlan || [], topicMastery: mastery || [], quizHistory: history || [], materials: materials || [], pastPapers: pastPapers || [] });
      } catch (err) {
        console.error("Error loading practice data:", err);
      }
    }
    loadData();
  }, [user]);

  // --- MODE 1: Practice Hub ---
  const handleStartQuiz = async (courseId, requestedTopic) => {
    if (generating) return;
    const course = studentContext.courses?.find((item) => item.id === courseId);
    const courseMaterials = (studentContext.materials || []).filter((material) =>
      material.courseId === courseId || (!material.courseId && [course?.name, course?.code].filter(Boolean).includes(material.course))
    );
    if (!courseMaterials.length) {
      setError(`Upload material for ${course?.name || 'this course'} first so the AI can generate a relevant quiz.`);
      return;
    }
    setGenerating(true);
    setError('');
    try {
      const weakest = [...topicMastery].sort((a, b) => (a.mastery ?? 0) - (b.mastery ?? 0))[0];
      const quiz = await generatePracticeQuiz(studentContext, requestedTopic || weakest?.name, courseId);
      quiz.courseId = courseId;
      setCurrentQuiz(quiz);
      setMode(2);
    } catch (err) {
      setError(err.message || 'Could not generate a quiz.');
    } finally {
      setGenerating(false);
    }
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
  };

  const renderHub = () => {
    const tabs = ['Quick Quiz', 'Topic Practice', 'Weak Areas', 'Exam Simulation'];
    
    // Filter logic based on tabs
    let weakTopics = topicMastery.filter(t => t.mastery < 60);
    if (activeTab === 'Weak Areas') {
      weakTopics = topicMastery.filter(t => t.mastery < 50);
    }

    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
        <header>
          <h1 className="text-3xl font-bold text-[#202033]">Practice Center</h1>
          <p className="text-[#6F7182] mt-2">Test your knowledge and improve your weak areas.</p>
        </header>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-[#ECECF2] overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'bg-[#6347F5] text-white' 
                  : 'text-[#6F7182] hover:bg-[#F0ECFF] hover:text-[#6347F5]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Course-specific quiz generation */}
        <section>
          <h2 className="text-xl font-bold text-[#202033] mb-4">Practice by Course</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentContext.courses?.length > 0 ? (
              studentContext.courses.map(course => {
                const courseTopics = weakTopics.filter((topic) => topic.courseId === course.id);
                const weakestCourseTopic = courseTopics.sort((a, b) => (a.mastery ?? 0) - (b.mastery ?? 0))[0];
                return (
                <div key={course.id} className={`bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-between ${requestedCourseId === course.id ? 'border-[#6347F5] ring-2 ring-[#F0ECFF]' : 'border-[#ECECF2]'}`}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-[#202033]">{course.name}</h3>
                      <span className="bg-[#F0ECFF] text-[#6347F5] text-xs font-bold px-2 py-1 rounded-full">Course Quiz</span>
                    </div>
                    <div className="flex items-center text-[#6F7182] text-sm mb-4 space-x-4">
                      <span className="flex items-center"><BookOpen className="w-4 h-4 mr-1" /> AI generated</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> Material-based</span>
                    </div>
                    <p className="text-sm text-[#EF4444] flex items-center mb-4">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {weakestCourseTopic ? `Weakest area: ${weakestCourseTopic.name} (${weakestCourseTopic.mastery ?? 0}%)` : 'Uses this course’s uploaded material and quiz history'}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleStartQuiz(course.id, weakestCourseTopic?.name)}
                    className="w-full bg-[#6347F5] hover:bg-[#5035E0] text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-2" /> {generating ? 'Generating…' : 'Generate Quiz'}
                  </button>
                </div>
                );
              })
            ) : (
              <p className="text-[#6F7182] py-4">No weak topics found for this filter.</p>
            )}
          </div>
          {error && <p className="mt-3 text-sm text-[#DC2626]">{error}</p>}
        </section>

        {/* Quiz History */}
        <section>
          <h2 className="text-xl font-bold text-[#202033] mb-4">Quiz History</h2>
          <div className="bg-white rounded-xl border border-[#ECECF2] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#FCFCFE] text-[#6F7182] text-sm">
                  <tr>
                    <th className="px-6 py-4 font-medium">Topic</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECECF2]">
                  {quizHistory.map(history => (
                    <tr key={history.id}>
                      <td className="px-6 py-4 font-medium text-[#202033]">{history.topic}</td>
                      <td className="px-6 py-4 text-[#6F7182]">{new Date(history.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                          history.score >= 80 ? 'bg-[#18A86B] bg-opacity-10 text-[#18A86B]' :
                          history.score >= 60 ? 'bg-[#FF8A34] bg-opacity-10 text-[#FF8A34]' :
                          'bg-[#EF4444] bg-opacity-10 text-[#EF4444]'
                        }`}>
                          {history.score}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    );
  };

  // --- MODE 2: Active Quiz ---
  const handleAnswerSelect = (optIdx) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIdx]: optIdx }));
  };

  const handleNext = () => {
    if (currentQuiz && currentQuestionIdx < currentQuiz.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    currentQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
    const totalQ = currentQuiz.questions.length;
    const score = Math.round((correctCount / totalQ) * 100);

    try {
      const saved = await fbSaveQuizResult(user?.uid, {
        topic: currentQuiz.topic,
        score,
        total: totalQ,
        correct: correctCount,
        courseId: currentQuiz.courseId,
      });
      if (saved) {
        setQuizHistory(prev => [saved, ...prev.filter(h => h.id !== saved.id)]);
      }
    } catch (err) {
      console.error("Error saving quiz result:", err);
    }

    setMode(3);
  };

  const renderActiveQuiz = () => {
    const question = currentQuiz.questions[currentQuestionIdx];
    const totalQ = currentQuiz.questions.length;
    const progress = ((currentQuestionIdx + 1) / totalQ) * 100;

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <header className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#ECECF2] shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-[#202033]">{currentQuiz.topic} Quiz</h2>
            <p className="text-sm text-[#6F7182]">Question {currentQuestionIdx + 1} of {totalQ}</p>
          </div>
          <button 
            onClick={() => setMode(1)}
            className="text-[#6F7182] hover:text-[#EF4444] text-sm font-medium transition-colors"
          >
            Exit Quiz
          </button>
        </header>

        {/* Progress bar */}
        <div className="w-full bg-[#ECECF2] h-2 rounded-full overflow-hidden">
          <div className="bg-[#6347F5] h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question */}
        <div className="bg-white p-8 rounded-xl border border-[#ECECF2] shadow-sm">
          <h3 className="text-xl font-medium text-[#202033] mb-8">{question.question}</h3>
          
          <div className="space-y-4">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected 
                      ? 'border-[#6347F5] bg-[#F0ECFF]' 
                      : 'border-[#ECECF2] hover:border-[#6347F5] hover:bg-[#FCFCFE]'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                      isSelected ? 'border-[#6347F5]' : 'border-[#9295A5]'
                    }`}>
                      {isSelected && <div className="w-3 h-3 bg-[#6347F5] rounded-full"></div>}
                    </div>
                    <span className={isSelected ? 'text-[#6347F5] font-medium' : 'text-[#202033]'}>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIdx === 0}
            className="flex items-center px-6 py-3 rounded-lg font-medium text-[#6F7182] bg-white border border-[#ECECF2] hover:bg-[#FCFCFE] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Previous
          </button>
          
          {currentQuestionIdx === totalQ - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswers[currentQuestionIdx] === undefined}
              className="flex items-center px-8 py-3 rounded-lg font-bold text-white bg-[#6347F5] hover:bg-[#5035E0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Quiz <CheckCircle className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 rounded-lg font-medium text-[#202033] bg-white border border-[#ECECF2] hover:bg-[#FCFCFE] transition-colors"
            >
              Next <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          )}
        </div>
      </div>
    );
  };

  // --- MODE 3: Results ---
  const renderResults = () => {
    let correctCount = 0;
    const weakQuestions = [];
    const strongQuestions = [];

    currentQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
        strongQuestions.push(q);
      } else {
        weakQuestions.push(q);
      }
    });

    const totalQ = currentQuiz.questions.length;
    const score = Math.round((correctCount / totalQ) * 100);

    const handleUpdatePlan = () => {
      triggerPlanUpdate({ score, topic: currentQuiz.topic });
      navigate('/study-plan');
    };

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-200">
        <header className="text-center bg-white p-8 rounded-xl border border-[#ECECF2] shadow-sm">
          <Award className={`w-16 h-16 mx-auto mb-4 ${
            score >= 80 ? 'text-[#18A86B]' : score >= 60 ? 'text-[#FF8A34]' : 'text-[#EF4444]'
          }`} />
          <h1 className="text-4xl font-bold text-[#202033] mb-2">{score}%</h1>
          <p className="text-[#6F7182] text-lg mb-6">You got {correctCount} out of {totalQ} correct</p>
          
          <div className="bg-[#F0ECFF] p-4 rounded-lg inline-block text-left mb-8">
            <h3 className="font-bold text-[#6347F5] flex items-center mb-1">
              <AlertCircle className="w-5 h-5 mr-2" /> AI Coach Recommendation
            </h3>
            <p className="text-[#202033] text-sm">
              {score < 60
                ? `Your ${currentQuiz.topic} score suggests you need targeted revision. Review the supplied material, then retry this topic.`
                : `You demonstrated solid understanding of ${currentQuiz.topic}. Keep practicing to maintain this progress.`}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setMode(1)}
              className="px-6 py-2 rounded-lg font-medium text-[#6F7182] bg-white border border-[#ECECF2] hover:bg-[#FCFCFE] transition-colors"
            >
              Practice Weak Areas
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 rounded-lg font-medium text-[#202033] bg-white border border-[#ECECF2] hover:bg-[#FCFCFE] transition-colors"
            >
              Return to Dashboard
            </button>
            <button 
              onClick={handleUpdatePlan}
              className="px-6 py-2 rounded-lg font-medium text-white bg-[#6347F5] hover:bg-[#5035E0] transition-colors"
            >
              Update Study Plan
            </button>
          </div>
        </header>

        {/* Breakdown */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#202033]">Question Breakdown</h2>
          
          {currentQuiz.questions.map((q, idx) => {
            const isCorrect = selectedAnswers[idx] === q.correctAnswer;
            const userAnswer = q.options[selectedAnswers[idx]];
            const correctAnswer = q.options[q.correctAnswer];

            return (
              <div key={idx} className={`p-6 rounded-xl border ${
                isCorrect ? 'border-[#18A86B] bg-white' : 'border-[#EF4444] bg-[#FCFCFE]'
              }`}>
                <div className="flex items-start mb-4">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-[#18A86B] mr-3 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-[#EF4444] mr-3 flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <h3 className="font-medium text-[#202033]">{q.question}</h3>
                    <div className="mt-4 space-y-2 text-sm">
                      {!isCorrect && (
                        <p className="text-[#EF4444]">
                          <span className="font-semibold">Your answer:</span> {userAnswer || 'Skipped'}
                        </p>
                      )}
                      <p className="text-[#18A86B]">
                        <span className="font-semibold">Correct answer:</span> {correctAnswer}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="ml-9 bg-[#F0ECFF] p-4 rounded-lg mt-4">
                  <p className="text-sm text-[#202033]">
                    <span className="font-semibold text-[#6347F5]">Explanation:</span> {q.explanation}
                  </p>
                  <p className="text-xs text-[#6F7182] mt-2">Source: {q.source}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)]">
      {mode === 1 && renderHub()}
      {mode === 2 && renderActiveQuiz()}
      {mode === 3 && renderResults()}
    </div>
  );
}
