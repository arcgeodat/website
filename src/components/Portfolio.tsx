import React from 'react';
import { Calendar, MapPin, ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';

interface PortfolioPageProps {
  translations: any;
  setCurrentPage: (page: string) => void;
}

const PortfolioPage: React.FC<PortfolioPageProps> = ({ translations, setCurrentPage }) => {
  const projects = [
    {
      id: 1,
      title: translations.portfolio.projects.residential.title,
      description: translations.portfolio.projects.residential.description,
      fullDescription: translations.portfolio.projects.residential.fullDescription,
      image: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=800",
      location: translations.portfolio.projects.residential.location,
      year: "2024",
      category: translations.portfolio.categories.residential,
      area: "2,500 m²",
      duration: "3 weeks",
      services: [
        translations.services.cadastral.title,
        translations.services.surveying.title
      ]
    },
    {
      id: 2,
      title: translations.portfolio.projects.commercial.title,
      description: translations.portfolio.projects.commercial.description,
      fullDescription: translations.portfolio.projects.commercial.fullDescription,
      image: "https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=800",
      location: translations.portfolio.projects.commercial.location,
      year: "2023",
      category: translations.portfolio.categories.commercial,
      area: "15,000 m²",
      duration: "8 weeks",
      services: [
        translations.services.topographic.title,
        translations.services.modeling.title
      ]
    },
    {
      id: 3,
      title: translations.portfolio.projects.infrastructure.title,
      description: translations.portfolio.projects.infrastructure.description,
      fullDescription: translations.portfolio.projects.infrastructure.fullDescription,
      image: "https://images.pexels.com/photos/1098365/pexels-photo-1098365.jpeg?auto=compress&cs=tinysrgb&w=800",
      location: translations.portfolio.projects.infrastructure.location,
      year: "2023",
      category: translations.portfolio.categories.infrastructure,
      area: "50 km",
      duration: "12 weeks",
      services: [
        translations.services.topographic.title,
        translations.services.surveying.title
      ]
    },
    {
      id: 4,
      title: translations.portfolio.projects.agricultural.title,
      description: translations.portfolio.projects.agricultural.description,
      fullDescription: translations.portfolio.projects.agricultural.fullDescription,
      image: "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=800",
      location: translations.portfolio.projects.agricultural.location,
      year: "2024",
      category: translations.portfolio.categories.agricultural,
      area: "100 ha",
      duration: "6 weeks",
      services: [
        translations.services.cadastral.title,
        translations.services.surveying.title
      ]
    },
    {
      id: 5,
      title: translations.portfolio.projects.industrial.title,
      description: translations.portfolio.projects.industrial.description,
      fullDescription: translations.portfolio.projects.industrial.fullDescription,
      image: "https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=800",
      location: translations.portfolio.projects.industrial.location,
      year: "2023",
      category: translations.portfolio.categories.industrial,
      area: "25,000 m²",
      duration: "10 weeks",
      services: [
        translations.services.modeling.title,
        translations.services.consulting.title
      ]
    },
    {
      id: 6,
      title: translations.portfolio.projects.topographic.title,
      description: translations.portfolio.projects.topographic.description,
      fullDescription: translations.portfolio.projects.topographic.fullDescription,
      image: "https://images.pexels.com/photos/87611/pexels-photo-87611.jpeg?auto=compress&cs=tinysrgb&w=800",
      location: translations.portfolio.projects.topographic.location,
      year: "2024",
      category: translations.portfolio.categories.residential,
      area: "5,000 m²",
      duration: "4 weeks",
      services: [
        translations.services.topographic.title,
        translations.services.modeling.title
      ]
    }
  ];

  const categories = [
    translations.portfolio.categories.all,
    translations.portfolio.categories.residential,
    translations.portfolio.categories.commercial,
    translations.portfolio.categories.infrastructure,
    translations.portfolio.categories.agricultural,
    translations.portfolio.categories.industrial
  ];

  const [selectedCategory, setSelectedCategory] = React.useState(translations.portfolio.categories.all);
  const [selectedProject, setSelectedProject] = React.useState<any>(null);

  const filteredProjects = selectedCategory === translations.portfolio.categories.all 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  if (selectedProject) {
    return (
      <section className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button 
            onClick={() => setSelectedProject(null)}
            className="inline-flex items-center text-blue-700 hover:text-blue-800 mb-8 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {translations.portfolio.backToPortfolio}
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative h-96">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    {selectedProject.category}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    {selectedProject.year}
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{selectedProject.title}</h1>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedProject.location}
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-800 mb-1">{selectedProject.area}</div>
                  <div className="text-sm text-gray-600">{translations.portfolio.projectDetails.area}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-800 mb-1">{selectedProject.duration}</div>
                  <div className="text-sm text-gray-600">{translations.portfolio.projectDetails.duration}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-800 mb-1">{selectedProject.year}</div>
                  <div className="text-sm text-gray-600">{translations.portfolio.projectDetails.completed}</div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{translations.portfolio.projectDetails.description}</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProject.fullDescription}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{translations.portfolio.projectDetails.services}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.services.map((service: string, index: number) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <button 
                    onClick={() => setCurrentPage('contact')}
                    className="inline-flex items-center px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-semibold"
                  >
                    {translations.portfolio.projectDetails.contactUs}
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
            {translations.portfolio.badge}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{translations.portfolio.title}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {translations.portfolio.subtitle}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {project.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {project.year}
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-800 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.location}
                  </div>
                  <div className="text-sm font-medium text-blue-700">
                    {project.area}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{translations.portfolio.cta.title}</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">{translations.portfolio.cta.description}</p>
          <button 
            onClick={() => setCurrentPage('contact')}
            className="inline-flex items-center px-8 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-semibold"
          >
            {translations.portfolio.cta.contact}
            <ExternalLink className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPage;