import React, { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface FooterProps {
  translations: any;
}

const Footer: React.FC<FooterProps> = ({ translations }) => {
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
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <MapPin className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-2xl font-bold">Arcgeodat</h3>
                <p className="text-gray-400 text-sm">{translations.tagline}</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              {translations.footer.description}
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{translations.footer.services}</h4>
            <ul className="space-y-3">
              <li onClick={() => handleNavigation('services')} className="text-gray-300 hover:text-white transition-colors cursor-pointer ">{translations.services.cadastral.title}</li>
              <li onClick={() => handleNavigation('services')} className="text-gray-300 hover:text-white transition-colors cursor-pointer ">{translations.services.surveying.title}</li>
              <li onClick={() => handleNavigation('services')} className="text-gray-300 hover:text-white transition-colors cursor-pointer ">{translations.services.topographic.title}</li>
              <li onClick={() => handleNavigation('services')} className="text-gray-300 hover:text-white transition-colors cursor-pointer ">{translations.services.modeling.title}</li>
              <li onClick={() => handleNavigation('services')} className="text-gray-300 hover:text-white transition-colors cursor-pointer ">{translations.services.consulting.title}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{translations.footer.contact}</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <a href="tel:+37368534760" className="text-gray-300 hover:text-blue-400 transition-colors">
                  +373 68 534 760
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <a href="mailto:arcgeodat@gmail.com" className="text-gray-300 hover:text-blue-400 transition-colors">
                  arcgeodat@gmail.com
                </a>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1" />
                <span className="text-gray-300">
                  str. Miron Costin 25, of 126<br />
                  Chișinău, Moldova
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2009 - {new Date().getFullYear()} Arcgeodat. {translations.footer.rights}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              {translations.footer.privacy}
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              {translations.footer.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
