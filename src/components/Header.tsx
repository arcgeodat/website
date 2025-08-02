import React, { useState } from 'react';
import { Menu, X, Navigation } from 'lucide-react';

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  translations: any;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, translations, currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
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
            <button 
              onClick={() => handleNavigation('home')} 
              className={`text-sm font-medium transition-colors ${currentPage === 'home' ? 'text-blue-800 border-b-2 border-blue-800 pb-1' : 'text-gray-700 hover:text-blue-800'}`}
            >
              {translations.nav.home}
            </button>
            <button 
              onClick={() => handleNavigation('about')} 
              className={`text-sm font-medium transition-colors ${currentPage === 'about' ? 'text-blue-800 border-b-2 border-blue-800 pb-1' : 'text-gray-700 hover:text-blue-800'}`}
            >
              {translations.nav.about}
            </button>
            <button 
              onClick={() => handleNavigation('services')} 
              className={`text-sm font-medium transition-colors ${currentPage === 'services' ? 'text-blue-800 border-b-2 border-blue-800 pb-1' : 'text-gray-700 hover:text-blue-800'}`}
            >
              {translations.nav.services}
            </button>
            <button 
              onClick={() => handleNavigation('portfolio')} 
              className={`text-sm font-medium transition-colors ${currentPage === 'portfolio' ? 'text-blue-800 border-b-2 border-blue-800 pb-1' : 'text-gray-700 hover:text-blue-800'}`}
            >
              {translations.nav.portfolio}
            </button>
            <button 
              onClick={() => handleNavigation('contact')} 
              className={`text-sm font-medium transition-colors ${currentPage === 'contact' ? 'text-blue-800 border-b-2 border-blue-800 pb-1' : 'text-gray-700 hover:text-blue-800'}`}
            >
              {translations.nav.contact}
            </button>
          </nav>

          {/* Language Switcher & Mobile Menu */}
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
              <button 
                onClick={() => handleNavigation('home')} 
                className={`text-left font-medium transition-colors ${currentPage === 'home' ? 'text-blue-800' : 'text-gray-700 hover:text-blue-800'}`}
              >
                {translations.nav.home}
              </button>
              <button 
                onClick={() => handleNavigation('about')} 
                className={`text-left font-medium transition-colors ${currentPage === 'about' ? 'text-blue-800' : 'text-gray-700 hover:text-blue-800'}`}
              >
                {translations.nav.about}
              </button>
              <button 
                onClick={() => handleNavigation('services')} 
                className={`text-left font-medium transition-colors ${currentPage === 'services' ? 'text-blue-800' : 'text-gray-700 hover:text-blue-800'}`}
              >
                {translations.nav.services}
              </button>
              <button 
                onClick={() => handleNavigation('portfolio')} 
                className={`text-left font-medium transition-colors ${currentPage === 'portfolio' ? 'text-blue-800' : 'text-gray-700 hover:text-blue-800'}`}
              >
                {translations.nav.portfolio}
              </button>
              <button 
                onClick={() => handleNavigation('contact')} 
                className={`text-left font-medium transition-colors ${currentPage === 'contact' ? 'text-blue-800' : 'text-gray-700 hover:text-blue-800'}`}
              >
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