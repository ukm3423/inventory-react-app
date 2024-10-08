import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../src/Dashboard/components/Sidebar';
import Header from '../src/Dashboard/components/Header';
import MainComponent from '../src/Dashboard/components/MainContent';
// import Courses from './Dashboard/pages/Courses/Courses';
// import Students from './Dashboard/pages/Student/Students';
// import Instructors from './Dashboard/pages/Instructors';
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
import Supplier from './Dashboard/pages/SupplierMaster/Supplier';
import Order from './Dashboard/pages/Order/Order';
import OrderList from './Dashboard/pages/Order/OrderList';
import OrderRequestList from './Dashboard/Supplier/OrderRequestLiset';
import Sales from './Dashboard/pages/Sale/Sales';
import SaleList from './Dashboard/pages/Sale/SaleList';
import CurrentStock from './Dashboard/pages/CurrentStock';
import SaleReport from './Dashboard/pages/reports/sale/SaleReport';
import PurchaseReport from './Dashboard/pages/reports/purchase/PurchaseReport';
import ViewDetails from './Dashboard/pages/reports/purchase/ViewDetails';

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
                <Route path="/order-list" element={<ProtectedRoute allowedRoles={['admin']}><OrderList /></ProtectedRoute>} />
                <Route path="/sales" element={<ProtectedRoute allowedRoles={['admin']}><Sales /></ProtectedRoute>} />
                <Route path="/sales-list" element={<ProtectedRoute allowedRoles={['admin']}><SaleList /></ProtectedRoute>} />
                <Route path="/current-stock" element={<ProtectedRoute allowedRoles={['admin']}><CurrentStock /></ProtectedRoute>} />
                <Route path="/sale-reports" element={<ProtectedRoute allowedRoles={['admin']}><SaleReport /></ProtectedRoute>} />
                <Route path="/purchase-reports" element={<ProtectedRoute allowedRoles={['admin']}><PurchaseReport /></ProtectedRoute>}/>
                <Route path="/purchase-reports/view-details/:purchaseId" element={<ProtectedRoute allowedRoles={['admin']}><ViewDetails /></ProtectedRoute>} />



              </>
            )}

            {role === 'ROLE_USER' && (
              <>
                <Route path="/order-request-list" element={<ProtectedRoute allowedRoles={['student']}><OrderRequestList /></ProtectedRoute>} />

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
