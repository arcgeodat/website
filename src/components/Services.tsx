import React from 'react';
import { FileCheck, Ruler, Map, Box, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

interface ServicesProps {
  translations: any;
}

const Services: React.FC<ServicesProps> = ({ translations }) => {
  const navigate = useNavigate();
  const services = [
    {
      icon: FileCheck,
      title: translations.services.cadastral.title,
      description: translations.services.cadastral.description,
      features: translations.services.cadastral.features,
      color: 'blue'
    },
    {
      icon: Ruler,
      title: translations.services.surveying.title,
      description: translations.services.surveying.description,
      features: translations.services.surveying.features,
      color: 'green'
    },
    {
      icon: Map,
      title: translations.services.topographic.title,
      description: translations.services.topographic.description,
      features: translations.services.topographic.features,
      color: 'purple'
    },
    {
      icon: Box,
      title: translations.services.modeling.title,
      description: translations.services.modeling.description,
      features: translations.services.modeling.features,
      color: 'orange'
    },
    {
      icon: Users,
      title: translations.services.consulting.title,
      description: translations.services.consulting.description,
      features: translations.services.consulting.features,
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 group-hover:bg-blue-100',
      green: 'bg-green-50 text-green-700 group-hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-700 group-hover:bg-purple-100',
      orange: 'bg-orange-50 text-orange-700 group-hover:bg-orange-100',
      indigo: 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div id='services' className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
            {translations.services.badge}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{translations.services.title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {translations.services.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-2xl hover:shadow-xl transition-all duration-300 p-8 group border border-gray-100 hover:border-blue-200">
                <div className={`flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-colors ${getColorClasses(service.color)}`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">{service.description}</p>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature: string, featureIndex: number) => (
                    <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors group-hover:translate-x-1 transform duration-200"
                >
                  {translations.services.learnMore}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-12 text-white">
          <h3 className="text-2xl font-bold mb-4">{translations.services.cta.title}</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">{translations.services.cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('contact')}
              className="inline-flex items-center px-8 py-3 bg-white text-blue-800 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              {translations.services.cta.contact}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('portfolio')}
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-800 transition-colors font-semibold"
            >
              {translations.services.cta.portfolio}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;