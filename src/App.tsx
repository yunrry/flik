// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { KakaoMapProvider } from './contexts/KakaoMapProvider';
import { useAuth } from './hooks/useAuth';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import SavePage from './pages/SavePage';
import FlikPage from './pages/FlikPage';
import NationwidePage from './pages/NationwidePage';
import IconGallary from './pages/IconGallary';
import RegionPage from './pages/RegionPage';
import SpotMapPage from './pages/SpotMapPage';
import SpotDetailCardPage from './pages/SpotDetailCardPage';
import PostingPage from './pages/PostingPage';
import ProfileUpdatePage from './pages/ProfileUpdatePage.tsx';
import MapViewPage from './pages/MapViewPage';
import PostDetailPage from './pages/PostDetailPage';
import TravelSelectionPage from './pages/TravelSelectionPage';
import LocationSelectPage from './pages/LocationSelectPage';
import SearchPage from './pages/SearchPage';

// Layouts
import NavigationLayout from './components/Layout/NavigationLayout';

// Auth Components
import OAuthCallback from './components/Auth/OAuthCallback';
import NicknameSetup from './components/Auth/NicknameSetup';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import OAuthSignupPage from './pages/OAuthSignupPage';
import OAuthSuccessPage from './pages/OAuthSuccessPage';
import CoursePage from './pages/CoursePage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // 로딩 중일 때는 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-main-1 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-main-1  border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              로딩 중...
            </h2>
            <p className="text-gray-600">
              잠시만 기다려주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Nickname Required Route Component
const NicknameRequiredRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // 닉네임이 없거나 빈 문자열인 경우 닉네임 설정 페이지로
  if (!user?.nickname || user.nickname.trim() === '') {
    return (
      <NicknameSetup
        onComplete={() => {
          window.location.reload(); // 닉네임 설정 후 페이지 새로고침
        }}
        isRequired={true}
      />
    );
  }
  
  return <>{children}</>;
};

// Layout wrapper for navigation pages
const NavigationPageWrapper: React.FC<{ 
  children: React.ReactNode; 
  disableScroll?: boolean;
  requireNickname?: boolean;
}> = ({ 
  children, 
  disableScroll = false,
  requireNickname = false
}) => {
  const content = (
    <NavigationLayout disableScroll={disableScroll}>
      {children}
    </NavigationLayout>
  );

  if (requireNickname) {
    return (
      <NicknameRequiredRoute>
        {content}
      </NicknameRequiredRoute>
    );
  }

  return content;
};

// App Loading Component
const AppLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-main-1 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          FLIK
        </h2>
        {/* <p className="text-gray-600">
          앱을 시작하는 중...
        </p> */}
      </div>
    </div>
  );
};

function App() {
  const { isLoading: authLoading } = useAuth();

  // 인증 상태 로딩 중인 경우
  if (authLoading) {
    return <AppLoading />;
  }

  return (
    <Router>
      <KakaoMapProvider>
        <div className="App">
          <Routes>
            {/* Public Routes - Only login and auth callback */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="/auth/success" element={<OAuthSuccessPage />} />
            <Route path="/auth/signup" element={<OAuthSignupPage />} />
            <Route path="/auth/oauth/callback/kakao" element={<OAuthCallbackPage />} />
            <Route path="/auth/oauth/callback/google" element={<OAuthCallbackPage />} />
            <Route path="/api/v1/auth/oauth/callback/kakao" element={<OAuthCallbackPage />} />
            <Route path="/api/v1/auth/oauth/callback/google" element={<OAuthCallbackPage />} />
            <Route path="/icons" element={<IconGallary />} />
            
            {/* All other routes require authentication */}
            
            {/* Home Route - Login required */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <NavigationPageWrapper requireNickname={true}>
                    <HomePage />
                  </NavigationPageWrapper>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <NavigationPageWrapper requireNickname={true}>
                    <HomePage />
                  </NavigationPageWrapper>
                </ProtectedRoute>
              } 
            />

            {/* Region and Nationwide Routes - Login required */}
            <Route 
              path="/nationwide" 
              element={
                <ProtectedRoute>
                  <NavigationPageWrapper disableScroll={true} requireNickname={true}>
                    <NationwidePage />
                  </NavigationPageWrapper>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/region/:region" 
              element={
                <ProtectedRoute>
                  <NavigationPageWrapper requireNickname={true}>
                    <RegionPage />
                  </NavigationPageWrapper>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/save/:spotId" 
              element={
                <ProtectedRoute>
                  <NavigationPageWrapper disableScroll={true} requireNickname={true}>
                    <SpotDetailCardPage />
                  </NavigationPageWrapper>
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Routes - Login + Nickname required */}
            <Route 
              path="/my" 
              element={
                <ProtectedRoute>
                  <NavigationPageWrapper requireNickname={false}>
                    <MyPage />
                  </NavigationPageWrapper>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/location-select" 
              element={
                <ProtectedRoute>
                  <NicknameRequiredRoute>
                    <LocationSelectPage />
                  </NicknameRequiredRoute>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/save" 
              element={
                <ProtectedRoute>
                  <NavigationPageWrapper requireNickname={true}>
                    <SavePage />
                  </NavigationPageWrapper>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/travel-select" 
              element={
                <ProtectedRoute>
                  <NavigationPageWrapper disableScroll={false} requireNickname={true}>
                    <TravelSelectionPage />
                  </NavigationPageWrapper>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/course/:courseId" 
              element={
                <ProtectedRoute>
                  <NavigationPageWrapper disableScroll={false} requireNickname={true}>
                    <CoursePage />
                  </NavigationPageWrapper>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <NavigationPageWrapper disableScroll={false} requireNickname={true}>
                    <SearchPage />
                  </NavigationPageWrapper>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/course" 
              element={
                <ProtectedRoute>
                  <NavigationPageWrapper disableScroll={false} requireNickname={true}>
                    <CoursePage />
                  </NavigationPageWrapper>
                </ProtectedRoute>
              } 
            />
            
            {/* FlikPage - Login + Nickname required */}
            <Route 
              path="/flik" 
              element={
                <ProtectedRoute>
                  <NavigationPageWrapper disableScroll={true} requireNickname={true}>
                    <FlikPage />
                  </NavigationPageWrapper>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/spot-map" 
              element={
                <ProtectedRoute>
                  <NicknameRequiredRoute>
                    <SpotMapPage />
                  </NicknameRequiredRoute>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/posting" 
              element={
                <ProtectedRoute>
                  <NicknameRequiredRoute>
                    <PostingPage />
                  </NicknameRequiredRoute>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/post/:postId" 
              element={
                <ProtectedRoute>
                  <PostDetailPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/profile/:type" 
              element={
                <ProtectedRoute>
                  <NavigationPageWrapper requireNickname={false}>
                    <ProfileUpdatePage />
                  </NavigationPageWrapper>
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </KakaoMapProvider>
    </Router>
  );
}

export default App;