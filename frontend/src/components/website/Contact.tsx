import React, { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { AnimatePresence, motion } from 'framer-motion';

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
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    console.log('issubmitted changed:', isSubmitted);
    if (isSubmitted !== null) {
      const timer = setTimeout(() => setIsSubmitted(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendEmail = () => {
    return emailjs.send("service_arcgeodat", "template_hc5wtcm", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      message: formData.message,
    }, {
      publicKey: import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await sendEmail();
      if (response.status === 200) {
        setMessageType('success');
      } else {
        setMessageType('error');
      }
      setIsSubmitted(true);
    } catch (error) {
      setMessageType('error');
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <section className="py-24 bg-white">
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
                    <a href="tel:+37368534760" className="text-blue-700 hover:text-blue-800 block">+373 68 534 760</a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{translations.contact.info.email}</h4>
                    <a href="mailto:info@arcgeodat.md" className="text-blue-700 hover:text-blue-800 block">arcgeodat@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{translations.contact.info.address}</h4>
                    <p className="text-gray-600">str. Miron Costin 25, of 126</p>
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
            {/* <div className="space-y-4">
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
            </div> */}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{translations.contact.form.title}</h3>

              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className={`mb-6 p-4 border rounded-xl flex items-center
                      ${messageType === "success"
                        ? "border-green-200 bg-green-50 text-green-800"
                        : "border-red-200 bg-red-50 text-red-800"
                      }
                  `}
                    key="notification"
                  >
                    {messageType === "success" ? (
                      <CheckCircle className="h-5 w-5 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-2" />
                    )}
                    <p className="font-medium">
                      {messageType === "success"
                        ? translations.contact.form.successfulMessage
                        : translations.contact.form.failureMessage}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

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
                      pattern="^[a-zA-ZăâîșțĂÂÎȘȚ\s]+$"
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
                      pattern="^0\d{8}$"
                      maxLength={9}
                      placeholder="ex: 061234567"
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
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="" disabled>
                        {translations.contact.form.selectService}
                      </option>
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
                  {isLoading ? translations.contact.form.submitting : translations.contact.form.submit}
                </button>
              </form>
            </div>

            {/* Map Section */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-6">
              <div className="bg-gray-200 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3437.0815184728795!2d28.866807876835978!3d47.049736126265145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97cfae9655245%3A0x6be813713ff9a183!2sStrada%20Miron%20Costin%2025%2C%20Chi%C8%99in%C4%83u%2C%20Moldova!5e1!3m2!1sro!2s!4v1754222033240!5m2!1sro!2s"
                  width="100%"
                  height="450"
                  loading="lazy"></iframe>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;