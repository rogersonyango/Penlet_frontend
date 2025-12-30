import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Layout
import Layout from './components/Layout/Layout';
import AuthLayout from './components/Layout/AuthLayout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import RoleSelection from './pages/Auth/RoleSelection';

// Main Pages (Student)
import Dashboard from './pages/Dashboard/Dashboard';
import Notes from './pages/Notes/Notes';
import NoteEditor from './pages/Notes/NoteEditor';
import Subjects from './pages/Subjects/Subjects';
import Timetable from './pages/Timetable/Timetable';
import Chatbot from './pages/Chatbot/Chatbot';
// import Chatroom from './pages/Chatroom/Chatroom';
import Quizzes from './pages/Quizzes/Quizzes';
import QuizDetail from './pages/Quizzes/QuizDetail';
import Videos from './pages/Videos/Videos';
import Flashcards from './pages/Flashcards/Flashcards';
import Games from './pages/Games/Games';
// import Documents from './pages/Documents/Documents';
import Resources3D from './pages/Resources3D/Resources3D';
import Alarms from './pages/Alarms/Alarms';
import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';
import Profile from './pages/Profile/Profile';

// Teacher Pages
import TeacherDashboard from './pages/Dashboard/TeacherDashboard';
import ContentManagement from './pages/Teacher/ContentManagement';
import CreateContent from './pages/Teacher/CreateContent';
import MySubjects from './pages/Teacher/MySubjects';
import StudentProgress from './pages/Teacher/StudentProgress';

// Admin Pages
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import SubjectManagement from './pages/Admin/SubjectManagement';
import ContentModeration from './pages/Admin/ContentModeration';

// Shared Pages
import AnalyticsDashboard from './pages/Shared/Analytics';

// Protected Route Component with Role-based Access
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, check if user has required role
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <RoleSelection />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <AuthLayout>
                <Register />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <AuthLayout>
                <ForgotPassword />
              </AuthLayout>
            </PublicRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* Student Routes (backward compatibility - no /student prefix) */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notes" element={<Notes />} />
          <Route path="notes/new" element={<NoteEditor />} />
          <Route path="notes/:id" element={<NoteEditor />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="chatbot" element={<Chatbot />} />
          {/* <Route path="chatroom" element={<Chatroom />} /> */}
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="quizzes/:id" element={<QuizDetail />} />
          <Route path="videos" element={<Videos />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="games" element={<Games />} />
          {/* <Route path="documents" element={<Documents />} /> */}
          <Route path="resources-3d" element={<Resources3D />} />
          <Route path="alarms" element={<Alarms />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Teacher Routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="content/create" element={<CreateContent />} />
          <Route path="content/edit/:id" element={<CreateContent />} />
          <Route path="subjects" element={<MySubjects />} />
          <Route path="subjects/create" element={<CreateContent />} />
          <Route path="subjects/edit/:id" element={<CreateContent />} />
          <Route path="subjects/:id" element={<MySubjects />} />
          <Route path="progress" element={<StudentProgress />} />
          <Route path="analytics" element={<AnalyticsDashboard userRole="teacher" />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/create" element={<UserManagement />} />
          <Route path="subjects" element={<SubjectManagement />} />
          <Route path="content" element={<ContentManagement userRole="admin" />} />
          <Route path="content/pending" element={<ContentModeration />} />
          <Route path="analytics" element={<AnalyticsDashboard userRole="admin" />} />
          <Route path="activity" element={<AnalyticsDashboard userRole="admin" />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;