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

import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import { AuthProvider } from './components/admin/AuthContext';
import Layout from './components/Layout/Layout';

function App() {
  const [language, setLanguage] = useState('en');
  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    // Load initial language from localStorage or default to English

  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Public website layout (Header/Footer shown here) */}
            <Route
              path="/"
              element={
                <>
                  <Header language={language} setLanguage={setLanguage} translations={t} />
                  <main className="flex-grow">
                    <Hero translations={t} />
                    <About translations={t} />
                    <Services translations={t} />
                  </main>
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

            {/* Admin routes (uncomment when stable) */}

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
            </Route>


            {/* Catch-all: redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}


export default App;
