// =============================================================================
// MOCK DATA — AI Study Coach
// TODO(backend): Replace each export with real API calls.
// All structures mirror expected backend response shapes.
// =============================================================================

// ─── Student Profile ─────────────────────────────────────────────────────────
export const mockUser = {
  id: 'u1',
  name: 'Ali',
  fullName: 'Ali Raza',
  email: 'ali.raza@student.fast.edu.pk',
  university: 'FAST National University',
  program: 'BS Computer Science',
  semester: '4th Semester',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  studyPreferences: {
    dailyStudyTime: '4 hours',
    preferredTime: 'Evening (6–10 PM)',
    studyGoal: 'Score above 80% in finals',
  },
};

// ─── Courses ─────────────────────────────────────────────────────────────────
export const mockCourses = [
  {
    id: 'c1',
    name: 'Digital Logic Design',
    code: 'DLD',
    teacher: 'Dr. Ahmed Khan',
    progress: 62,
    examDate: '2026-09-22',
    examType: 'Final',
    daysUntilExam: 18,
    topics: 8,
    materials: 12,
    quizzesTaken: 8,
    color: '#6347F5',
  },
  {
    id: 'c2',
    name: 'Data Structures & Algorithms',
    code: 'DSA',
    teacher: 'Dr. Sarah Ali',
    progress: 41,
    examDate: '2026-10-01',
    examType: 'Final',
    daysUntilExam: 27,
    topics: 10,
    materials: 8,
    quizzesTaken: 5,
    color: '#18A86B',
  },
  {
    id: 'c3',
    name: 'Calculus & Analytical Geometry',
    code: 'CAL',
    teacher: 'Prof. Tariq Mahmood',
    progress: 78,
    examDate: '2026-09-16',
    examType: 'Final',
    daysUntilExam: 12,
    topics: 7,
    materials: 6,
    quizzesTaken: 10,
    color: '#FF8A34',
  },
];

// ─── Topic Mastery (DLD) ─────────────────────────────────────────────────────
export const mockTopicMastery = [
  { id: 't1', name: 'Boolean Algebra', mastery: 82, trend: 'up', status: 'strong', courseId: 'c1' },
  { id: 't2', name: 'Logic Gates', mastery: 91, trend: 'stable', status: 'strong', courseId: 'c1' },
  { id: 't3', name: 'K-Maps', mastery: 43, trend: 'down', status: 'weak', courseId: 'c1' },
  { id: 't4', name: 'Sequential Logic', mastery: 61, trend: 'up', status: 'moderate', courseId: 'c1' },
  { id: 't5', name: 'Number Systems', mastery: 88, trend: 'stable', status: 'strong', courseId: 'c1' },
  { id: 't6', name: 'Counters & Registers', mastery: 35, trend: 'new', status: 'weak', courseId: 'c1' },
  { id: 't7', name: 'Flip-Flops', mastery: 55, trend: 'up', status: 'moderate', courseId: 'c1' },
  { id: 't8', name: 'Combinational Circuits', mastery: 72, trend: 'up', status: 'moderate', courseId: 'c1' },
];

// ─── Study Plan (8 days) ─────────────────────────────────────────────────────
export const mockStudyPlan = [
  {
    day: 1, date: '2026-09-02', label: 'Day 1', status: 'completed',
    tasks: [
      { id: 'sp1', topic: 'Boolean Algebra', duration: '35 min', priority: 'high', status: 'completed', type: 'Review', difficulty: 'medium' },
      { id: 'sp2', topic: 'Logic Gates', duration: '25 min', priority: 'medium', status: 'completed', type: 'Practice', difficulty: 'easy' },
    ],
  },
  {
    day: 2, date: '2026-09-03', label: 'Day 2', status: 'completed',
    tasks: [
      { id: 'sp3', topic: 'K-Maps', duration: '40 min', priority: 'high', status: 'completed', type: 'Study', difficulty: 'hard' },
      { id: 'sp4', topic: 'Number Systems', duration: '20 min', priority: 'low', status: 'completed', type: 'Review', difficulty: 'easy' },
    ],
  },
  {
    day: 3, date: '2026-09-04', label: 'Day 3', status: 'today', aiUpdated: true,
    aiReason: 'K-Maps revision moved here because your mastery dropped to 43% after the last quiz.',
    tasks: [
      { id: 'sp5', topic: 'Sequential Logic', duration: '30 min', priority: 'high', status: 'not-started', type: 'Study', difficulty: 'medium' },
      { id: 'sp6', topic: 'K-Maps Revision', duration: '25 min', priority: 'critical', status: 'not-started', type: 'Revision', difficulty: 'hard', aiAdded: true },
      { id: 'sp7', topic: 'Practice Quiz', duration: '15 questions', priority: 'high', status: 'not-started', type: 'Quiz', difficulty: 'mixed' },
    ],
  },
  {
    day: 4, date: '2026-09-05', label: 'Day 4', status: 'upcoming',
    tasks: [
      { id: 'sp8', topic: 'Counters & Registers', duration: '40 min', priority: 'medium', status: 'not-started', type: 'Study', difficulty: 'hard' },
      { id: 'sp9', topic: 'Flip-Flops', duration: '30 min', priority: 'medium', status: 'not-started', type: 'Review', difficulty: 'medium' },
    ],
  },
  {
    day: 5, date: '2026-09-06', label: 'Day 5', status: 'upcoming',
    tasks: [
      { id: 'sp10', topic: 'Combinational Circuits', duration: '35 min', priority: 'medium', status: 'not-started', type: 'Study', difficulty: 'medium' },
      { id: 'sp11', topic: 'K-Maps Deep Dive', duration: '30 min', priority: 'high', status: 'not-started', type: 'Practice', difficulty: 'hard', aiAdded: true },
    ],
  },
  {
    day: 6, date: '2026-09-07', label: 'Day 6', status: 'upcoming',
    tasks: [
      { id: 'sp12', topic: 'Boolean Algebra Advanced', duration: '30 min', priority: 'medium', status: 'not-started', type: 'Practice', difficulty: 'hard' },
      { id: 'sp13', topic: 'Mock Exam #1', duration: '45 min', priority: 'high', status: 'not-started', type: 'Exam Sim', difficulty: 'hard' },
    ],
  },
  {
    day: 7, date: '2026-09-08', label: 'Day 7', status: 'upcoming',
    tasks: [
      { id: 'sp14', topic: 'Sequential Logic Review', duration: '25 min', priority: 'medium', status: 'not-started', type: 'Review', difficulty: 'medium' },
      { id: 'sp15', topic: 'Past Paper Practice', duration: '40 min', priority: 'high', status: 'not-started', type: 'Practice', difficulty: 'hard' },
    ],
  },
  {
    day: 8, date: '2026-09-09', label: 'Day 8', status: 'upcoming',
    tasks: [
      { id: 'sp16', topic: 'Weak Areas Review', duration: '35 min', priority: 'critical', status: 'not-started', type: 'Revision', difficulty: 'mixed' },
      { id: 'sp17', topic: 'Full Mock Exam', duration: '60 min', priority: 'high', status: 'not-started', type: 'Exam Sim', difficulty: 'hard' },
    ],
  },
];

// ─── Today's Plan ────────────────────────────────────────────────────────────
export const mockTodayPlan = [
  { id: 'tp1', topic: 'Boolean Algebra', duration: '35 min', status: 'completed', type: 'Review', icon: '📖' },
  { id: 'tp2', topic: 'K-Maps', duration: '25 min', status: 'not-started', type: 'Study', icon: '📝' },
  { id: 'tp3', topic: 'Practice Quiz', duration: '15 questions', status: 'not-started', type: 'Quiz', icon: '🧪' },
];

// ─── Quiz History ────────────────────────────────────────────────────────────
export const mockQuizHistory = [
  { id: 'q1', topic: 'Boolean Algebra', score: 84, total: 10, correct: 8, date: '2026-09-01', courseId: 'c1' },
  { id: 'q2', topic: 'Logic Gates', score: 91, total: 10, correct: 9, date: '2026-09-02', courseId: 'c1' },
  { id: 'q3', topic: 'K-Maps', score: 48, total: 10, correct: 5, date: '2026-09-03', courseId: 'c1' },
  { id: 'q4', topic: 'Sequential Logic', score: 72, total: 10, correct: 7, date: '2026-09-02', courseId: 'c1' },
];

// ─── K-Maps Quiz (interactive) ───────────────────────────────────────────────
export const mockKMapsQuiz = {
  id: 'quiz-kmaps-1',
  topic: 'K-Maps',
  courseId: 'c1',
  totalQuestions: 10,
  timeEstimate: '15 min',
  difficulty: 'Medium',
  questions: [
    {
      id: 'kq1', question: 'What is the primary purpose of a Karnaugh Map?',
      options: ['Designing sequential circuits', 'Simplifying Boolean expressions', 'Converting between number systems', 'Drawing logic gate diagrams'],
      correctAnswer: 1, explanation: 'K-Maps are used to simplify Boolean expressions by visual grouping of adjacent minterms.',
      source: 'DLD Lecture 07 — K-Maps',
    },
    {
      id: 'kq2', question: 'How many cells are in a 3-variable K-Map?',
      options: ['4', '6', '8', '16'],
      correctAnswer: 2, explanation: 'A 3-variable K-Map has 2³ = 8 cells.',
      source: 'DLD Lecture 07 — K-Maps',
    },
    {
      id: 'kq3', question: 'In a K-Map, adjacent cells differ by how many variables?',
      options: ['0', '1', '2', '3'],
      correctAnswer: 1, explanation: 'Adjacent cells in a K-Map differ by exactly one variable (Gray code ordering).',
      source: 'DLD Lecture 07 — K-Maps',
    },
    {
      id: 'kq4', question: 'Which of the following is NOT a valid group size in a K-Map?',
      options: ['1', '2', '3', '8'],
      correctAnswer: 2, explanation: 'Valid group sizes are powers of 2: 1, 2, 4, 8, 16. Three is not a power of 2.',
      source: 'DLD Lecture 08 — K-Map Grouping',
    },
    {
      id: 'kq5', question: "Don't-care conditions in K-Maps are represented by:",
      options: ['0', '1', 'X', 'D'],
      correctAnswer: 2, explanation: "Don't-care conditions are marked with X and can be treated as either 0 or 1 during grouping.",
      source: 'DLD Lecture 08 — K-Map Grouping',
    },
    {
      id: 'kq6', question: 'When grouping 1s in a K-Map for SOP, overlapping groups are:',
      options: ['Not allowed', 'Required in all cases', 'Allowed and often necessary', 'Only for 4-variable maps'],
      correctAnswer: 2, explanation: 'Overlapping groups are allowed and often necessary to form the largest possible groups.',
      source: 'DLD Lecture 08 — K-Map Grouping',
    },
    {
      id: 'kq7', question: 'The corner cells of a 4-variable K-Map:',
      options: ['Cannot be grouped together', 'Are never adjacent', 'Can form a valid group of 4', 'Must always be don\'t-cares'],
      correctAnswer: 2, explanation: 'The four corner cells of a 4-variable K-Map are all adjacent and can form a valid group.',
      source: 'DLD Lecture 09 — Advanced K-Maps',
    },
    {
      id: 'kq8', question: 'A group of 4 cells in a K-Map eliminates how many variables?',
      options: ['1', '2', '3', '4'],
      correctAnswer: 1, explanation: 'A group of 2^n cells eliminates n variables. So 4 = 2² eliminates 2 variables.',
      source: 'DLD Lecture 08 — K-Map Grouping',
    },
    {
      id: 'kq9', question: 'For POS (Product of Sums) using a K-Map, you group:',
      options: ['The 1s', 'The 0s', 'The Xs', 'Both 1s and 0s'],
      correctAnswer: 1, explanation: 'For POS, you group the 0s in the K-Map and complement the result.',
      source: 'DLD Lecture 09 — Advanced K-Maps',
    },
    {
      id: 'kq10', question: 'What is the result of grouping ALL cells in a 2-variable K-Map?',
      options: ["A'B + AB'", 'A + B', '1', '0'],
      correctAnswer: 2, explanation: 'Grouping all cells covers every minterm, so the simplified expression is just 1 (always true).',
      source: 'DLD Lecture 07 — K-Maps',
    },
  ],
};

// ─── Past Papers ─────────────────────────────────────────────────────────────
export const mockPastPapers = [
  { id: 'pp1', title: 'DLD Final 2025', year: 2025, type: 'Final', course: 'DLD', questions: 8, status: 'analyzed', teacher: 'Dr. Ahmed Khan' },
  { id: 'pp2', title: 'DLD Midterm 2025', year: 2025, type: 'Midterm', course: 'DLD', questions: 6, status: 'analyzed', teacher: 'Dr. Ahmed Khan' },
  { id: 'pp3', title: 'DLD Final 2024', year: 2024, type: 'Final', course: 'DLD', questions: 8, status: 'analyzed', teacher: 'Dr. Ahmed Khan' },
];

export const mockPaperAnalysis = [
  { topic: 'K-Maps', percentage: 32, frequency: 'Very High', color: '#EF4444' },
  { topic: 'Boolean Algebra', percentage: 24, frequency: 'High', color: '#F59E0B' },
  { topic: 'Sequential Logic', percentage: 18, frequency: 'Medium', color: '#6347F5' },
  { topic: 'Counters', percentage: 12, frequency: 'Medium', color: '#18A86B' },
  { topic: 'Other', percentage: 14, frequency: 'Low', color: '#9CA3AF' },
];

export const mockPaperDifficulty = [
  { level: 'Easy', count: 5, percentage: 23 },
  { level: 'Medium', count: 10, percentage: 45 },
  { level: 'Hard', count: 7, percentage: 32 },
];

// ─── Materials ───────────────────────────────────────────────────────────────
export const mockMaterials = [
  { id: 'm1', name: 'DLD Lecture 01 — Number Systems.pdf', type: 'Lecture Slides', course: 'DLD', date: '2026-08-20', status: 'analyzed', size: '2.4 MB' },
  { id: 'm2', name: 'DLD Lecture 02 — Boolean Algebra.pdf', type: 'Lecture Slides', course: 'DLD', date: '2026-08-22', status: 'analyzed', size: '3.1 MB' },
  { id: 'm3', name: 'DLD Lecture 07 — K-Maps.pdf', type: 'Lecture Slides', course: 'DLD', date: '2026-08-28', status: 'analyzed', size: '4.2 MB' },
  { id: 'm4', name: 'DLD Lecture 08 — K-Map Grouping.pdf', type: 'Lecture Slides', course: 'DLD', date: '2026-08-29', status: 'analyzed', size: '3.8 MB' },
  { id: 'm5', name: 'DLD Syllabus Fall 2026.pdf', type: 'Syllabus', course: 'DLD', date: '2026-08-15', status: 'analyzed', size: '0.5 MB' },
  { id: 'm6', name: 'Chapter 3 Notes — Sequential Logic.docx', type: 'Notes', course: 'DLD', date: '2026-09-01', status: 'analyzed', size: '1.8 MB' },
  { id: 'm7', name: 'DLD Assignment 2 — K-Maps.pdf', type: 'Assignment', course: 'DLD', date: '2026-09-02', status: 'analyzed', size: '0.9 MB' },
  { id: 'm8', name: 'DLD Final 2025.pdf', type: 'Past Paper', course: 'DLD', date: '2026-09-03', status: 'analyzed', size: '1.2 MB' },
  { id: 'm9', name: 'DSA Lecture 05 — Trees.pptx', type: 'Lecture Slides', course: 'DSA', date: '2026-09-01', status: 'analyzed', size: '5.1 MB' },
  { id: 'm10', name: 'DLD Midterm 2025.pdf', type: 'Past Paper', course: 'DLD', date: '2026-09-04', status: 'processing', size: '1.4 MB' },
];

// ─── AI Coach Insights ───────────────────────────────────────────────────────
export const mockCoachInsights = [
  {
    id: 'ci1',
    message: 'You scored 48% on your last K-Map quiz. I\'ve moved K-Maps earlier in your study plan because this is currently your weakest topic and it appears frequently in your professor\'s past papers.',
    reason: 'Low quiz score + high exam frequency',
    relatedTopic: 'K-Maps',
    sourceMaterials: ['DLD Lecture 07 — K-Maps', 'DLD Final 2025'],
    recommendedAction: 'Review K-Map grouping rules before attempting another quiz',
    type: 'plan-update',
    priority: 'high',
  },
  {
    id: 'ci2',
    message: 'Your quiz performance improved by 18% over the last 7 days. Keep up the momentum!',
    reason: 'Performance trend analysis',
    relatedTopic: null,
    sourceMaterials: [],
    recommendedAction: 'Maintain current study schedule',
    type: 'encouragement',
    priority: 'medium',
  },
  {
    id: 'ci3',
    message: 'You consistently struggle with Sequential Logic. Consider reviewing Flip-Flops first, as they are foundational to this topic.',
    reason: 'Repeated low performance in related topics',
    relatedTopic: 'Sequential Logic',
    sourceMaterials: ['Chapter 3 Notes — Sequential Logic'],
    recommendedAction: 'Study Flip-Flops → then Sequential Logic',
    type: 'weakness',
    priority: 'medium',
  },
  {
    id: 'ci4',
    message: 'You perform best when studying in 30–45 minute sessions. Your plan has been optimized for this pattern.',
    reason: 'Study session analysis',
    relatedTopic: null,
    sourceMaterials: [],
    recommendedAction: 'Continue with focused 30-45 min sessions',
    type: 'optimization',
    priority: 'low',
  },
];

// ─── Coach Chat Messages ─────────────────────────────────────────────────────
export const mockCoachMessages = [
  {
    role: 'assistant',
    text: "Hi Ali! I'm your AI study coach. I've analyzed your DLD course materials and past papers from Dr. Ahmed Khan. How can I help you prepare today?",
    sources: [],
  },
  {
    role: 'user',
    text: 'Should I study K-Maps or Sequential Logic today?',
    sources: [],
  },
  {
    role: 'assistant',
    text: "K-Maps — definitely. Here's why:\n\n1. Your current mastery is only 43%, making it your weakest topic.\n2. It appeared in 32% of questions across Dr. Ahmed Khan's past papers.\n3. Your exam is in 18 days, so this is high priority.\n\nI've already prioritized it in today's study plan. Start with reviewing the grouping rules from Lecture 08, then try the practice quiz I've prepared.",
    sources: ['DLD Lecture 07 — K-Maps', 'DLD Lecture 08 — K-Map Grouping', 'DLD Final 2025'],
  },
];

export const mockSuggestedPrompts = [
  'What should I study today?',
  'Explain my weakest topic simply',
  'Create a quiz for me',
  'Analyze my progress this week',
  'What should I revise before my exam?',
  'Explain K-Map grouping from my lecture slides',
];

// ─── Progress / Analytics ────────────────────────────────────────────────────
export const mockWeeklyStudy = [
  { day: 'Mon', hours: 1.5, date: '2026-08-29' },
  { day: 'Tue', hours: 2.0, date: '2026-08-30' },
  { day: 'Wed', hours: 3.2, date: '2026-08-31' },
  { day: 'Thu', hours: 2.8, date: '2026-09-01' },
  { day: 'Fri', hours: 1.8, date: '2026-09-02' },
  { day: 'Sat', hours: 3.5, date: '2026-09-03' },
  { day: 'Sun', hours: 2.7, date: '2026-09-04' },
];

export const mockQuizTrend = [
  { date: 'Aug 28', score: 62 },
  { date: 'Aug 30', score: 68 },
  { date: 'Sep 01', score: 84 },
  { date: 'Sep 02', score: 72 },
  { date: 'Sep 03', score: 48 },
];

export const mockProgressStats = {
  overallProgress: 62,
  studyStreak: 7,
  totalHoursThisWeek: 17.5,
  topicsMastered: 3,
  totalTopics: 8,
  quizAverage: 74,
  planCompletion: 82,
  totalQuizzesTaken: 12,
};

// ─── AI Plan Changes ────────────────────────────────────────────────────────
export const mockPlanChanges = [
  {
    id: 'pc1',
    date: '2026-09-04',
    title: 'K-Maps revision moved forward',
    reason: 'You scored 48% on K-Maps, so revision was moved forward by 2 days. K-Maps appears in 32% of your professor\'s past paper questions.',
    affectedTopics: ['K-Maps', 'K-Maps Revision', 'K-Maps Deep Dive'],
    type: 'reprioritize',
  },
  {
    id: 'pc2',
    date: '2026-09-02',
    title: 'Practice quiz added',
    reason: 'You completed Boolean Algebra and Logic Gates ahead of schedule. A practice quiz was added to reinforce your understanding.',
    affectedTopics: ['Practice Quiz'],
    type: 'addition',
  },
];
