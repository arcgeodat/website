import React, { useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState('home');
  const t = translations[language as keyof typeof translations];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero translations={t} setCurrentPage={setCurrentPage} />
            <About translations={t} />
            <Services translations={t} setCurrentPage={setCurrentPage} />
          </>
        );
      case 'about':
        return <About translations={t} />;
      case 'services':
        return <Services translations={t} setCurrentPage={setCurrentPage} />;
      case 'portfolio':
        return <PortfolioPage translations={t} setCurrentPage={setCurrentPage} />;
      case 'contact':
        return <Contact translations={t} />;
      default:
        return (
          <>
            <Hero translations={t} setCurrentPage={setCurrentPage} />
            <About translations={t} />
            <Services translations={t} setCurrentPage={setCurrentPage} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        translations={t} 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <main>
        {renderCurrentPage()}
      </main>
      <Footer translations={t} />
    </div>
  );
}

export default App;