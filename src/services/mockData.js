export const mockNotes = [
  {
    id: '1',
    title: 'Introduction to Physics',
    content: '# Newton\'s Laws of Motion\n\nNewton\'s laws of motion describe the relationship between motion and force...',
    subjectId: '1',
    userId: '1',
    tags: ['physics', 'mechanics'],
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    title: 'Chemical Reactions',
    content: '# Types of Chemical Reactions\n\n1. Synthesis\n2. Decomposition\n3. Combustion...',
    subjectId: '2',
    userId: '1',
    tags: ['chemistry', 'reactions'],
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-01-16').toISOString(),
  },
  {
    id: '3',
    title: 'Calculus Basics',
    content: '# Derivatives\n\nThe derivative of a function represents its rate of change...',
    subjectId: '3',
    userId: '1',
    tags: ['mathematics', 'calculus'],
    createdAt: new Date('2024-01-17').toISOString(),
    updatedAt: new Date('2024-01-17').toISOString(),
  },
];

export const mockSubjects = [
  { id: '1', name: 'Physics', color: '#3b82f6', icon: 'Atom', userId: '1' },
  { id: '2', name: 'Chemistry', color: '#10b981', icon: 'Flask', userId: '1' },
  { id: '3', name: 'Mathematics', color: '#f59e0b', icon: 'Calculator', userId: '1' },
  { id: '4', name: 'Biology', color: '#8b5cf6', icon: 'Microscope', userId: '1' },
  { id: '5', name: 'History', color: '#ef4444', icon: 'Book', userId: '1' },
];

export const mockTimetable = [
  { id: '1', subjectId: '1', dayOfWeek: 1, startTime: '08:00', endTime: '09:30', room: 'Lab 101', userId: '1' },
  { id: '2', subjectId: '2', dayOfWeek: 1, startTime: '10:00', endTime: '11:30', room: 'Lab 102', userId: '1' },
  { id: '3', subjectId: '3', dayOfWeek: 2, startTime: '08:00', endTime: '09:30', room: 'Room 201', userId: '1' },
  { id: '4', subjectId: '4', dayOfWeek: 2, startTime: '10:00', endTime: '11:30', room: 'Lab 103', userId: '1' },
  { id: '5', subjectId: '5', dayOfWeek: 3, startTime: '08:00', endTime: '09:30', room: 'Room 301', userId: '1' },
];

export const mockQuizzes = [
  {
    id: '1',
    title: 'Physics Quiz - Motion',
    subjectId: '1',
    duration: 1800,
    totalQuestions: 10,
    passingScore: 70,
    questions: [
      {
        id: '1',
        question: 'What is Newton\'s First Law?',
        options: [
          'An object in motion stays in motion',
          'Force equals mass times acceleration',
          'Every action has an equal reaction',
          'Energy cannot be created or destroyed'
        ],
        correctAnswer: 0,
        type: 'multiple-choice'
      },
      {
        id: '2',
        question: 'Calculate the velocity after 5 seconds with acceleration of 2 m/s²',
        options: ['5 m/s', '10 m/s', '15 m/s', '20 m/s'],
        correctAnswer: 1,
        type: 'multiple-choice'
      }
    ],
    createdAt: new Date('2024-01-10').toISOString(),
  },
];

export const mockVideos = [
  {
    id: '1',
    title: 'Introduction to Quantum Mechanics',
    url: 'https://example.com/video1',
    thumbnail: 'https://via.placeholder.com/320x180',
    duration: 1200,
    subjectId: '1',
    description: 'Learn the basics of quantum mechanics',
    views: 1234,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '2',
    title: 'Organic Chemistry Fundamentals',
    url: 'https://example.com/video2',
    thumbnail: 'https://via.placeholder.com/320x180',
    duration: 900,
    subjectId: '2',
    description: 'Understanding organic compounds',
    views: 856,
    createdAt: new Date('2024-01-02').toISOString(),
  },
];

export const mockFlashcards = [
  {
    id: '1',
    front: 'What is the speed of light?',
    back: '299,792,458 meters per second',
    subjectId: '1',
    userId: '1',
    mastered: false,
    reviewCount: 0,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '2',
    front: 'Define photosynthesis',
    back: 'The process by which plants convert light energy into chemical energy',
    subjectId: '4',
    userId: '1',
    mastered: false,
    reviewCount: 0,
    createdAt: new Date('2024-01-02').toISOString(),
  },
];

export const mockGames = [
  {
    id: '1',
    title: 'Math Quiz Game',
    type: 'quiz',
    description: 'Test your math skills',
    icon: 'Calculator',
    difficulty: 'medium',
  },
  {
    id: '2',
    title: 'Word Puzzle',
    type: 'puzzle',
    description: 'Solve word puzzles',
    icon: 'Puzzle',
    difficulty: 'easy',
  },
  {
    id: '3',
    title: 'Memory Match',
    type: 'memory',
    description: 'Match pairs of cards',
    icon: 'Brain',
    difficulty: 'hard',
  },
];

export const mockAlarms = [
  {
    id: '1',
    title: 'Study Physics',
    time: '08:00',
    repeat: ['Monday', 'Wednesday', 'Friday'],
    enabled: true,
    userId: '1',
  },
  {
    id: '2',
    title: 'Complete Math Assignment',
    time: '15:00',
    repeat: ['Tuesday'],
    enabled: true,
    userId: '1',
  },
];

export const mockAnalytics = {
  studyTime: {
    today: 120,
    week: 840,
    month: 3600,
  },
  subjectProgress: [
    { subject: 'Physics', progress: 75 },
    { subject: 'Chemistry', progress: 60 },
    { subject: 'Mathematics', progress: 85 },
    { subject: 'Biology', progress: 70 },
  ],
  quizScores: [
    { date: '2024-01-15', score: 85 },
    { date: '2024-01-16', score: 90 },
    { date: '2024-01-17', score: 78 },
    { date: '2024-01-18', score: 92 },
  ],
};