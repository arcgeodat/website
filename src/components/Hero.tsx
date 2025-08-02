import React from 'react';
import { ArrowRight, Award, Users, CheckCircle, Phone } from 'lucide-react';

interface HeroProps {
  translations: any;
  setCurrentPage: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ translations, setCurrentPage }) => {

  return (
    <section className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
                <CheckCircle className="h-4 w-4 mr-2" />
                {translations.hero.certified}
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {translations.hero.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                {translations.hero.subtitle}
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-blue-700" />
                </div>
                <span className="text-sm font-medium text-gray-700">{translations.hero.experience}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{translations.hero.clients}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{translations.hero.precision}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{translations.hero.licensed}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setCurrentPage('contact')}
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-semibold shadow-lg group"
              >
                {translations.hero.cta}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="tel:+37369123456"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-800 text-blue-800 rounded-lg hover:bg-blue-800 hover:text-white transition-colors font-semibold"
              >
                <Phone className="mr-2 h-5 w-5" />
                {translations.hero.callNow}
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8">
              <img
                src="https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Professional surveying equipment"
                className="rounded-xl w-full h-80 object-cover"
              />
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-800">15+</div>
                  <div className="text-xs text-gray-600">{translations.hero.stats.years}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-800">500+</div>
                  <div className="text-xs text-gray-600">{translations.hero.stats.projects}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-800">100%</div>
                  <div className="text-xs text-gray-600">{translations.hero.stats.accuracy}</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-blue-200 to-slate-200 rounded-2xl -z-10"></div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{translations.hero.trustedBy}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700">{translations.hero.certifications.iso}</div>
              <div className="text-xs text-gray-500">ISO 9001:2015</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700">{translations.hero.certifications.licensed}</div>
              <div className="text-xs text-gray-500">{translations.hero.certifications.moldovaLicense}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700">{translations.hero.certifications.experience}</div>
              <div className="text-xs text-gray-500">{translations.hero.certifications.established}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700">{translations.hero.certifications.insured}</div>
              <div className="text-xs text-gray-500">{translations.hero.certifications.liability}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;