import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../src/Dashboard/components/Sidebar';
import Header from '../src/Dashboard/components/Header';
import MainComponent from '../src/Dashboard/components/MainContent';
import Courses from './Dashboard/pages/Courses/Courses';
import Students from './Dashboard/pages/Student/Students';
import Instructors from './Dashboard/pages/Instructors';
import Overview from './Dashboard/pages/Overview';
import { AuthProvider, useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Certification from './Dashboard/pages/Certification';
import StudentRegistration from './Dashboard/pages/Student/StudentRegistration';
import LoginPanel from './Dashboard/components/auth/LoginPanel';
import NotFound from './Dashboard/components/auth/NotFound';
import AdminLogin from './Dashboard/pages/Login';
import StudentLogin from './Dashboard/pages/Student/StudentLogin';
import OTPPage from './Dashboard/pages/Student/OTPPage';
import Category from './Dashboard/pages/Category/Category';
import Product from './Dashboard/pages/Product/Product';
import Supplier from './Dashboard/pages/Supplier/Supplier';
import Order from './Dashboard/pages/Order/Order';

function AppContent() {
  const location = useLocation();
  const { role } = useAuth();

  const publicPages = [
    '/login-panel',
    '/login',
    '/student-login',
    '/otp-page',
    '/student-registration-form',
    '/404'
  ];

  const isPublicPage = publicPages.includes(location.pathname);

  return (
    <div className="flex h-screen">
      {!isPublicPage && <Sidebar />}
      <div className="flex flex-col flex-1">
        {!isPublicPage && <Header />}
        <main className={`flex-1 overflow-y-auto ${!isPublicPage ? 'bg-gray-100' : ''}`}>
          <Routes>
            
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/login-panel" element={<LoginPanel />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/student-registration-form" element={<StudentRegistration />} />
            <Route path="/otp-page" element={<OTPPage />} />
            <Route path="*" element={<ProtectedRoute allowedRoles={['admin', 'student']}><NotFound /></ProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute allowedRoles={['admin', 'student']}><Overview /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin', 'student']}><MainComponent /></ProtectedRoute>} />
            <Route path="/certification" element={<ProtectedRoute allowedRoles={['admin', 'student']}><Certification /></ProtectedRoute>} />

            {role === 'ROLE_ADMIN' && (
              <>
                {/* <Route path="/courses" element={<ProtectedRoute allowedRoles={['admin']}><Courses /></ProtectedRoute>} />
                <Route path="/instructors" element={<ProtectedRoute allowedRoles={['admin']}><Instructors /></ProtectedRoute>} />
                <Route path="/students/*" element={<ProtectedRoute allowedRoles={['admin']}><Students /></ProtectedRoute>} /> */}


                <Route path="/categories" element={<ProtectedRoute allowedRoles={['admin']}><Category /></ProtectedRoute>} />
                <Route path="/suppliers" element={<ProtectedRoute allowedRoles={['admin']}><Supplier /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute allowedRoles={['admin']}><Product /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute allowedRoles={['admin']}><Order /></ProtectedRoute>} />


                
              </>
            )}

            {role === 'ROLE_USER' && (
              <>
                
              </>)}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
