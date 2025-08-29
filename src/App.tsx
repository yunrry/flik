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
import RegionPage from './pages/RegionPage';
import RestaurantMapPage from './pages/RestaurantMapPage';

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
const NavigationPageWrapper: React.FC<{ children: React.ReactNode; disableScroll?: boolean }> = ({ 
  children, 
  disableScroll = false 
}) => {
  return (
    <NavigationLayout disableScroll={disableScroll}>
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
          
          {/* Home Route - No login required */}
          <Route 
            path="/" 
            element={
              <NavigationPageWrapper>
                <HomePage />
              </NavigationPageWrapper>
            } 
          />

          {/* Region and Nationwide Routes - No login required */}
          <Route 
            path="/nationwide" 
            element={
              <NavigationPageWrapper>
                <NationwidePage />
              </NavigationPageWrapper>
            } 
          />

          <Route 
            path="/region/:region" 
            element={
              <NavigationPageWrapper>
                <RegionPage />
              </NavigationPageWrapper>
            } 
          />
          
          {/* Protected Routes - Login required */}
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
          
          {/* FlikPage만 disableScroll=true */}
          <Route 
            path="/flik" 
            element={
              <ProtectedRoute>
                <NavigationPageWrapper disableScroll={true}>
                  <FlikPage />
                </NavigationPageWrapper>
              </ProtectedRoute>
            } 
          />

        <Route 
            path="/restaurant-map" 
            element={
              <ProtectedRoute>
                <RestaurantMapPage />
                </ProtectedRoute>
            } 
          />
          
          {/* 404 Redirect */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;