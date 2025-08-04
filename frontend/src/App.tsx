import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Header from './components/website/Header';
import Hero from './components/website/Hero';
import About from './components/website/About';
import Services from './components/website/Services';
import PortfolioPage from './components/website/Portfolio';
import Contact from './components/website/Contact';
import Footer from './components/website/Footer';
import { translations } from './translations';

import Login from './components/auth/Login';
import Layout from './components/Layout/Layout';
import { AuthProvider, useAuth } from './components/context/AuthContext';
import AdminDashboard from './components/dashboard/AdminDashboard';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import UserDashboard from './components/dashboard/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import TopographicMapsList from './components/TopographicMaps/TopographicMapsList';
import AddMap from './components/TopographicMaps/AddMap';
import BorrowedMaps from './components/TopographicMaps/BorrowedMaps';
import ApprovalManagement from './components/TopographicMaps/ApprovalManagement';
import Settings from './components/settings/Setting';

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  console.log('Identifying user role');
  console.log(user);

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  switch ((user?.role ?? 'USER').toUpperCase()) {
    case 'ADMIN':
      console.log('Admin role identified');
      return <AdminDashboard />;
    case 'LIBRARIAN':
      console.log('Librarian role identified');
      return <EmployeeDashboard />;
    case 'USER':
      console.log('User role identified');
      return <UserDashboard />;
    default:
      console.log('Default role identified');
      return <UserDashboard />;
  }
};

function App() {
  const [language, setLanguage] = useState('en');
  const t = translations[language as keyof typeof translations];

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public website layout (Header/Footer shown here) */}
          <Route
            path="/"
            element={
              <>
                <Header language={language} setLanguage={setLanguage} translations={t} />
                <Hero translations={t} />
                <About translations={t} />
                <Services translations={t} />
                <Footer translations={t} />
              </>
            }
          />

          <Route
            path="/portfolio"
            element={
              <>
                <Header language={language} setLanguage={setLanguage} translations={t} />
                <main className="flex-grow">
                  <PortfolioPage translations={t} />
                </main>
                <Footer translations={t} />
              </>
            }
          />

          <Route
            path="/contact"
            element={
              <>
                <Header language={language} setLanguage={setLanguage} translations={t} />
                <main className="flex-grow">
                  <Contact translations={t} />
                </main>
                <Footer translations={t} />
              </>
            }
          />

          {/* Public login page (no header/footer) */}
          <Route path="/login" element={<Login />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route path="dashboard" element={<DashboardRouter />} />

            {/* TopographicMaps */}
            <Route path="items" element={<TopographicMapsList />} />
            <Route
              path="maps/add"
              element={
                <ProtectedRoute allowedRoles={['admin', 'librarian']}>
                  <AddMap />
                </ProtectedRoute>
              }
            />

            {/* Borrowed & Reviews */}
            <Route path="borrowed" element={<BorrowedMaps />} />
            {/* <Route path="reviews" element={<Reviews />} /> */}

            {/* Users */}
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div>User Management Coming Soon</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="users/add"
              element={
                <ProtectedRoute allowedRoles={['admin', 'librarian']}>
                  <AddMap />
                </ProtectedRoute>
              }
            />

            {/* Approval Management */}
            <Route
              path="approvals"
              element={
                <ProtectedRoute allowedRoles={['admin', 'librarian']}>
                  <ApprovalManagement />
                </ProtectedRoute>
              }
            />

            {/* Settings */}
            <Route path="settings" element={<Settings />} />

            {/* Default route inside layout */}
            <Route path="" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider >
  );
}


export default App;
