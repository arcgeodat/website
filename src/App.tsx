import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import PortfolioPage from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { translations } from './translations';

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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer translations={t} />
      </div>
    </Router>
  );
}

export default App;
