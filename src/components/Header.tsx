import React, { useState } from 'react';
import { Menu, X, Navigation } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  translations: any;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, translations }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (partId: string) => {
    // If already on Home page (assuming '/' is home)
    if (location.pathname === '/') {
      const element = document.getElementById(partId);
      if (element) {
        const offset = -100;
        const y = element.getBoundingClientRect().top + window.scrollY + offset;

        window.scrollTo({
          top: y,
          behavior: 'smooth',
        });
        setIsMenuOpen(false);
        return;
      }
    }

    // If not on Home or element not found on home, navigate to the route
    // Map your IDs to routes here:
    const routesMap: Record<string, string> = {
      contact: '/contact',
      portfolio: '/portfolio',
      about: '/',      // About is on home page, so navigate home then scroll
      services: '/',   // Same here
    };

    const targetRoute = routesMap[partId] || '/';

    if (location.pathname !== targetRoute) {
      navigate(targetRoute);
    }

    // If target is home page, delay scroll to element after navigation
    if (targetRoute === '/') {
      // Scroll after navigation completes, wait a bit for the DOM to render
      setTimeout(() => {
        const el = document.getElementById(partId);
        if (el) {
          const offset = -100;
          const y = el.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({
            top: y,
            behavior: 'smooth',
          });
        }
      }, 200);
    }

    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Navigation className="h-10 w-10 text-blue-800" />
            <div>
              <h1 className="text-2xl font-bold text-blue-800 tracking-tight">ARCGEODAT</h1>
              <p className="text-xs text-gray-500 font-medium">{translations.tagline}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleNavigation('home')} className="text-sm font-medium text-gray-700 hover:text-blue-800 transition-colors">
              {translations.nav.home}
            </button>
            <button onClick={() => handleNavigation('aboutus')} className="text-sm font-medium text-gray-700 hover:text-blue-800 transition-colors">
              {translations.nav.about}
            </button>
            <button onClick={() => handleNavigation('services')} className="text-sm font-medium text-gray-700 hover:text-blue-800 transition-colors">
              {translations.nav.services}
            </button>
            <button onClick={() => { navigate('/portfolio'); console.log('Navigating') }} className="text-sm font-medium text-gray-700 hover:text-blue-800 transition-colors">
              {translations.nav.portfolio}
            </button>
            <button onClick={() => navigate('/contact')} className="text-sm font-medium text-gray-700 hover:text-blue-800 transition-colors">
              {translations.nav.contact}
            </button>
          </nav>

          {/* Language & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">EN</option>
              <option value="ro">RO</option>
              <option value="ru">RU</option>
            </select>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <nav className="flex flex-col space-y-4">
              <button onClick={() => handleNavigation('home')} className="text-left font-medium text-gray-700 hover:text-blue-800 transition-colors">
                {translations.nav.home}
              </button>
              <button onClick={() => handleNavigation('aboutus')} className="text-left font-medium text-gray-700 hover:text-blue-800 transition-colors">
                {translations.nav.about}
              </button>
              <button onClick={() => handleNavigation('services')} className="text-left font-medium text-gray-700 hover:text-blue-800 transition-colors">
                {translations.nav.services}
              </button>
              <button onClick={() => handleNavigation('portfolio')} className="text-left font-medium text-gray-700 hover:text-blue-800 transition-colors">
                {translations.nav.portfolio}
              </button>
              <button onClick={() => handleNavigation('contact')} className="text-left font-medium text-gray-700 hover:text-blue-800 transition-colors">
                {translations.nav.contact}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
