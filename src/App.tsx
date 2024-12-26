import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { LandingPage } from '@/pages/landing';
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';
import { DashboardOverview } from '@/pages/dashboard/overview';
import { VideosPage } from '@/pages/dashboard/videos';
import { SubtitlesPage } from '@/pages/dashboard/subtitles';
import { ProfilePage } from '@/pages/dashboard/profile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <>
          <Header />
          <LandingPage />
          <Footer />
        </>
      } />
      <Route path="/login" element={
        <>
          <Header />
          <LoginPage />
          <Footer />
        </>
      } />
      <Route path="/register" element={
        <>
          <Header />
          <RegisterPage />
          <Footer />
        </>
      } />
      
      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <DashboardOverview />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/videos" element={
        <ProtectedRoute>
          <DashboardLayout>
            <VideosPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/subtitles" element={
        <ProtectedRoute>
          <DashboardLayout>
            <SubtitlesPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/profile" element={
        <ProtectedRoute>
          <DashboardLayout>
            <ProfilePage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;