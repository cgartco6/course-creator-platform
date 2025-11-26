import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './services/auth';

// Layout Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Page Components
import Home from './pages/Home/Home';
import CreateCourse from './pages/CreateCourse/CreateCourse';
import MyCourses from './pages/MyCourses/MyCourses';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CourseDetail from './pages/CourseDetail/CourseDetail';

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/my-courses" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/my-courses" />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          {/* Protected Routes */}
          <Route 
            path="/create-course" 
            element={user ? <CreateCourse /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/my-courses" 
            element={user ? <MyCourses /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/settings" 
            element={user ? <Settings /> : <Navigate to="/login" />} 
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
