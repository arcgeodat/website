import React from 'react';
import { Target, Eye, Award, Users, Shield, CheckCircle } from 'lucide-react';

interface AboutProps {
  translations: any;
}

const About: React.FC<AboutProps> = ({ translations }) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div id='aboutus' className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
            {translations.about.badge}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{translations.about.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <p className="text-lg text-gray-600 leading-relaxed">
              {translations.about.description}
            </p>

            <div className="space-y-4">
              {translations.about.highlights.map((highlight: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{highlight}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-800 mb-2">15+</div>
                <div className="text-sm text-gray-600">{translations.about.stats.experience}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-800 mb-2">500+</div>
                <div className="text-sm text-gray-600">{translations.about.stats.projects}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl px-12 py-14 mb-12">
              <img
                src="https://images.pexels.com/photos/6615239/pexels-photo-6615239.jpeg"
                alt="Professional planning and surveying"
                className="rounded-xl w-full h-64 object-cover mb-6 -mt-6"
                loading='lazy'
              />
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-900">{translations.about.team.title}</h4>
                <p className="text-gray-600 text-sm">{translations.about.team.description}</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-blue-100 to-gray-100 rounded-2xl -z-10"></div>
          </div>
        </div>


        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <Target className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{translations.about.mission.title}</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{translations.about.mission.description}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{translations.about.vision.title}</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{translations.about.vision.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;