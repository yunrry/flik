// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import SavePage from './pages/SavePage';
import FlikPage from './pages/FlikPage';
import NationwidePage from './pages/NationwidePage';
import IconGallary from './pages/IconGallary';
import RegionPage from './pages/RegionPage'; // Added import for RegionPage

// Layouts
import NavigationLayout from './components/Layout/NavigationLayout';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Layout wrapper for navigation pages
const NavigationPageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NavigationLayout>
      {children}
    </NavigationLayout>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/icons" element={<IconGallary />} />
          
          {/* Protected Routes with Navigation */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <NavigationPageWrapper>
                  <HomePage />
                </NavigationPageWrapper>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/my" 
            element={
              <ProtectedRoute>
                <NavigationPageWrapper>
                  <MyPage />
                </NavigationPageWrapper>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/save" 
            element={
              <ProtectedRoute>
                <NavigationPageWrapper>
                  <SavePage />
                </NavigationPageWrapper>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/flik" 
            element={
              <ProtectedRoute>
                <NavigationPageWrapper>
                  <FlikPage />
                </NavigationPageWrapper>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/nationwide" 
            element={
              <ProtectedRoute>
                <NavigationPageWrapper>
                  <NationwidePage />
                </NavigationPageWrapper>
              </ProtectedRoute>
            } 
          />

          {/* Region Page Route */}
          <Route 
            path="/region/:region" 
            element={
              <ProtectedRoute>
                <NavigationPageWrapper>
                  <RegionPage />
                </NavigationPageWrapper>
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;