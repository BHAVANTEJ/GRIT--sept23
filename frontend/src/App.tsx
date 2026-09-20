import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Page components
import { Home } from './pages/Home/Home';
import { About } from './pages/About/About';
import { Courses } from './pages/Courses/Courses';
import { CourseDetails } from './pages/CourseDetails/CourseDetails';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { AuthCallback } from './pages/Auth/AuthCallback';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { ResetPassword } from './pages/Auth/ResetPassword';
import { Profile } from './pages/Profile/Profile';
import { Outcomes } from './pages/Outcomes/Outcomes';
import { Intro } from './pages/Intro/Intro';
import { Admin } from './pages/Admin/Admin';
import { NotFound } from './pages/NotFound/NotFound';

import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { PublicOnlyRoute } from './components/routing/PublicOnlyRoute';

/**
 * Application router — the single BrowserRouter in the app.
 *
 * Routes added here to fix the 404s: the navbar pointed at `/home`, and
 * `/signin`, `/register` and `/admin` were linked or expected but never
 * registered, so React Router fell through to the catch-all. `Signup` already
 * existed as a component but had no route at all.
 *
 * `/home`, `/login` and `/signup` are kept as redirect aliases rather than
 * duplicate pages, so any bookmark or stale link still resolves instead of
 * 404-ing.
 */
const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* ---- Public ---- */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:slug" element={<CourseDetails />} />
      <Route path="/outcomes" element={<Outcomes />} />
      <Route path="/intro" element={<Intro />} />

      {/* ---- Auth ---- */}
      <Route
        path="/signin"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Signup />
          </PublicOnlyRoute>
        }
      />
      {/* Supabase email links land here (OTP is the primary flow). */}
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ---- Authenticated ---- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* ---- Admin only ---- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <Admin />
          </ProtectedRoute>
        }
      />

      {/* ---- Legacy / alias redirects ---- */}
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Navigate to="/signin" replace />} />
      <Route path="/signup" element={<Navigate to="/register" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
