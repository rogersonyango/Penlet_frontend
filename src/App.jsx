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

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Notes from './pages/Notes/Notes';
import NoteEditor from './pages/Notes/NoteEditor';
import Subjects from './pages/Subjects/Subjects';
import Timetable from './pages/Timetable/Timetable';
import Chatbot from './pages/Chatbot/Chatbot';
import Chatroom from './pages/Chatroom/Chatroom';
import Quizzes from './pages/Quizzes/Quizzes';
import QuizDetail from './pages/Quizzes/QuizDetail';
import Videos from './pages/Videos/Videos';
import Flashcards from './pages/Flashcards/Flashcards';
import Games from './pages/Games/Games';
import Documents from './pages/Documents/Documents';
import Resources3D from './pages/Resources3D/Resources3D';
import Alarms from './pages/Alarms/Alarms';
import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';
import Profile from './pages/Profile/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
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

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notes" element={<Notes />} />
          <Route path="notes/new" element={<NoteEditor />} />
          <Route path="notes/:id" element={<NoteEditor />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="chatroom" element={<Chatroom />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="quizzes/:id" element={<QuizDetail />} />
          <Route path="videos" element={<Videos />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="games" element={<Games />} />
          <Route path="documents" element={<Documents />} />
          <Route path="resources-3d" element={<Resources3D />} />
          <Route path="alarms" element={<Alarms />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;