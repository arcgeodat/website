import React, { useState } from 'react';
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

function App() {
  const [language, setLanguage] = useState('en');
  const t = translations[language as keyof typeof translations];

  return (
    <Router>
      <div className="min-h-screen">
        <Header
          language={language}
          setLanguage={setLanguage}
          translations={t}
        />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero translations={t} />
                  <About translations={t} />
                  <Services translations={t} />
                </>
              }
            />
            <Route path="/about" element={<About translations={t} />} />
            <Route path="/services" element={<Services translations={t} />} />
            <Route path="/portfolio" element={<PortfolioPage translations={t} />} />
            <Route path="/contact" element={<Contact translations={t} />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Redirect any unknown path */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer translations={t} />
      </div>
    </Router>
  );
}

export default App;
