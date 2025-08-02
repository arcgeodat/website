import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, Clock, Globe, CheckCircle } from 'lucide-react';

interface ContactProps {
  translations: any;
}

const Contact: React.FC<ContactProps> = ({ translations }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
            {translations.contact.badge}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{translations.contact.title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {translations.contact.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{translations.contact.info.title}</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                    <Phone className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{translations.contact.info.phone}</h4>
                    <a href="tel:+37369123456" className="text-blue-700 hover:text-blue-800 block">+373 69 123 456</a>
                    <a href="tel:+37378654321" className="text-blue-700 hover:text-blue-800 block">+373 78 654 321</a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{translations.contact.info.email}</h4>
                    <a href="mailto:info@arcgeodat.md" className="text-blue-700 hover:text-blue-800 block">info@arcgeodat.md</a>
                    <a href="mailto:office@arcgeodat.md" className="text-blue-700 hover:text-blue-800 block">office@arcgeodat.md</a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{translations.contact.info.address}</h4>
                    <p className="text-gray-600">Strada Mihai Eminescu 123</p>
                    <p className="text-gray-600">Chișinău, Moldova</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{translations.contact.info.hours}</h4>
                    <p className="text-gray-600">{translations.contact.info.weekdays}</p>
                    <p className="text-gray-600">{translations.contact.info.weekend}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="space-y-4">
              <a 
                href="https://wa.me/37369123456" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-colors font-semibold shadow-lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp
              </a>
              <a 
                href="https://t.me/arcgeodat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg"
              >
                <Send className="h-5 w-5 mr-2" />
                Telegram
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{translations.contact.form.title}</h3>
              
              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-green-800 font-medium">{translations.contact.form.success}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                      {translations.contact.form.name}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                      {translations.contact.form.email}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                      {translations.contact.form.phone}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-bold text-gray-700 mb-2">
                      {translations.contact.form.service}
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">{translations.contact.form.selectService}</option>
                      <option value="cadastral">{translations.services.cadastral.title}</option>
                      <option value="surveying">{translations.services.surveying.title}</option>
                      <option value="topographic">{translations.services.topographic.title}</option>
                      <option value="modeling">{translations.services.modeling.title}</option>
                      <option value="consulting">{translations.services.consulting.title}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                    {translations.contact.form.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none"
                    placeholder={translations.contact.form.messagePlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-800 text-white py-4 px-6 rounded-xl hover:bg-blue-900 transition-colors flex items-center justify-center font-semibold shadow-lg"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {translations.contact.form.submit}
                </button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-6">
              <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">{translations.contact.map.placeholder}</p>
                  <p className="text-sm text-gray-500 mt-2 font-medium">Strada Mihai Eminescu 123, Chișinău</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;