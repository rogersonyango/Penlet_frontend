// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { useAuthStore } from './store/authStore';

// // Layout
// import Layout from './components/Layout/Layout';
// import AuthLayout from './components/Layout/AuthLayout';

// // Auth Pages
// import Login from './pages/Auth/Login';
// import Register from './pages/Auth/Register';
// import ForgotPassword from './pages/Auth/ForgotPassword';

// // Main Pages
// import Dashboard from './pages/Dashboard/Dashboard';
// import Subjects from './pages/Subjects/Subjects';
// import Chatbot from './pages/Chatbot/Chatbot';
// import Quizzes from './pages/Quizzes/Quizzes';
// import QuizDetail from './pages/Quizzes/QuizDetail';
// import Videos from './pages/Videos/Videos';
// import Flashcards from './pages/Flashcards/Flashcards';
// import Games from './pages/Games/Games';
// import Resources3D from './pages/Resources3D/Resources3D';
// import Alarms from './pages/Alarms/Alarms';
// import Analytics from './pages/Analytics/Analytics';
// import Settings from './pages/Settings/Settings';
// import Profile from './pages/Profile/Profile';
// // import { CommentsSection } from './pages/notes/CommentsSection';
// // import CreateNotePage from './pages/notes/CreateNotePage';
// // import { NoteCard } from './pages/notes/NotesCard';
// // import NoteDetailPage from './pages/notes/NoteDetailPage';
// // import NotesListPage from './pages/notes/NotesListPage';

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuthStore();
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// // Public Route Component (redirect to dashboard if authenticated)
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated } = useAuthStore();
//   return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
// };

// function App() {
//   const { checkAuth } = useAuthStore();

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   return (
//     <Router>
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             background: '#fff',
//             color: '#363636',
//           },
//           success: {
//             iconTheme: {
//               primary: '#10b981',
//               secondary: '#fff',
//             },
//           },
//           error: {
//             iconTheme: {
//               primary: '#ef4444',
//               secondary: '#fff',
//             },
//           },
//         }}
//       />
      
//       <Routes>
//         {/* Public Routes */}
//        <Route path="/login" element={<PublicRoute> <AuthLayout> <Login /> </AuthLayout></PublicRoute>}/>
//         <Route path="/register" element={ <PublicRoute> <AuthLayout> <Register /> </AuthLayout> </PublicRoute> }/>
//         <Route path="/forgot-password" element={ <PublicRoute> <AuthLayout> <ForgotPassword /> </AuthLayout></PublicRoute>}/> 
        

//         {/* Protected Routes */}
//         <Route path="/" element={ <ProtectedRoute> <Layout /> </ProtectedRoute>}>
//           <Route index element={<Navigate to="/dashboard" replace />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="subjects" element={<Subjects />} />

        
//           <Route path="chatbot" element={<Chatbot />} />
//           <Route path="chatroom" element={<Chatroom />} />
//           <Route path="quizzes" element={<Quizzes />} />
//           <Route path="quizzes/:id" element={<QuizDetail />} />
//           <Route path="videos" element={<Videos />} />
//           <Route path="flashcards" element={<Flashcards />} />
//           <Route path="games" element={<Games />} />
//           <Route path="documents" element={<Documents />} />
//           <Route path="resources-3d" element={<Resources3D />} />
//           <Route path="alarms" element={<Alarms />} />
//           <Route path="analytics" element={<Analytics />} />
//           <Route path="settings" element={<Settings />} />
//           <Route path="profile" element={<Profile />} />
//         </Route>

//         {/* 404 Route */}
//         <Route path="*" element={<Navigate to="/dashboard" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;














// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// === Notes Pages (existing) ===
import { CommentsSection } from './pages/notes/CommentsSection';
import CreateNotePage from './pages/notes/CreateNotePage';
import { NoteCard } from './pages/notes/NotesCard';
import NoteDetailPage from './pages/notes/NoteDetailPage';
import NotesListPage from './pages/notes/NotesListPage';

// === Timetable Pages (existing) ===
import TimetablePage from './pages/timetable/TimetablePage';
import DailyTimetablePage from './pages/timetable/DailyTimetablePage';
import TimetableEditorPage from './pages/timetable/TimetableEditorPage';

// === Alarms & Reminders Pages (existing) ===
import AlarmListPage from './pages/Alarms/AlarmListPage';
import CreateAlarmPage from './pages/Alarms/CreateAlarmPage';
import AlarmDetailPage from './pages/Alarms/AlarmDetailPage';
import ReminderListPage from './pages/Alarms/ReminderListPage';
import CreateReminderPage from './pages/Alarms/CreateReminderPage';
import ReminderDetailPage from './pages/Alarms/ReminderDetailPage';
import UpcomingRemindersPage from './pages/Alarms/UpcomingReminderPage';

// === ✅ NEW: Quiz Pages ===
import QuizListPage from './pages/Quizzes/QuizListPage';
import CreateQuizPage from './pages/Quizzes/CreateQuizPage';
import UpdateQuizPage from './pages/Quizzes/UpdateQuizPage';
import TakeQuizPage from './pages/Quizzes/TakeQuizPage';
import QuizResultsPage from './pages/Quizzes/QuizResultPage';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* === Notes Routes === */}
          <Route path="/note" element={<NotesListPage />} />
          <Route path="/note/comments" element={<CommentsSection />} />
          <Route path="/note/card" element={<NoteCard />} />
          <Route path="/note/new" element={<CreateNotePage />} />
          <Route path="/note/:id" element={<NoteDetailPage />} />

          {/* === Timetable Routes === */}
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/timetable/daily" element={<DailyTimetablePage />} />
          <Route path="/timetable/edit" element={<TimetableEditorPage />} />

          {/* === Alarms Routes === */}
          <Route path="/alarms" element={<AlarmListPage />} />
          <Route path="/alarms/new" element={<CreateAlarmPage />} />
          <Route path="/alarms/:alarmId" element={<AlarmDetailPage />} />

          {/* === Reminders Routes === */}
          <Route path="/reminders" element={<ReminderListPage />} />
          <Route path="/reminders/new" element={<CreateReminderPage />} />
          <Route path="/reminders/:reminderId" element={<ReminderDetailPage />} />
          <Route path="/reminders/upcoming" element={<UpcomingRemindersPage />} />

          {/* ===  Quiz Routes === */}
          <Route path="/quizzes" element={<QuizListPage />} />
          <Route path="/quiz/create" element={<CreateQuizPage />} />
          <Route path="/quiz/:quizId/edit" element={<UpdateQuizPage />} />
          <Route path="/quiz/:quizId" element={<TakeQuizPage />} />
          <Route path="/results/:attemptId" element={<QuizResultsPage />} />

          {/* === Default Redirect === */}
          <Route path="/" element={<AlarmListPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}