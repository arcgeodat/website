import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, ArrowLeft, CheckCircle, ArrowRight, Circle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { CreateItemRequest } from '@/types';


const AddMap: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    publishedYear: '',
    itemType: '',
  });

  // Popup state
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const successPopupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [failMessage, setFailMessage] = useState('');
  const [showFailPopup, setShowFailPopup] = useState(false);
  const [failPopupVisible, setFailPopupVisible] = useState(false);

  const genres = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Romance',
    'Thriller',
    'Biography',
    'History',
    'Self-Help',
    'Poetry',
    'Drama',
  ];

  const itemTypes = [
    'Book',
    'Magazine',
    'DVD',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  // Success popup helper
  const triggerSuccessPopup = (text: string) => {
    setSuccessMessage(text);
    setShowSuccessPopup(true);
    setSuccessPopupVisible(true);

    // Always start 5-second timer on popup show
    successPopupTimeoutRef.current = setTimeout(() => {
      setSuccessPopupVisible(false);
      setTimeout(() => setShowSuccessPopup(false), 350);
    }, 5000);
  };

  const triggerFailPopup = (text: string) => {
    setFailMessage(text);
    setShowFailPopup(true);
    setFailPopupVisible(true);

    successPopupTimeoutRef.current = setTimeout(() => {
      setFailPopupVisible(false);
      setTimeout(() => setShowFailPopup(false), 350);
    }, 5000);
  };

  const handleMouseEnter = () => {
    if (successPopupTimeoutRef.current) {
      clearTimeout(successPopupTimeoutRef.current);
      successPopupTimeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    successPopupTimeoutRef.current = setTimeout(() => {
      setSuccessPopupVisible(false);
      setTimeout(() => setShowSuccessPopup(false), 350);
    }, 5000);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const requestData: CreateItemRequest = {
      title: formData.title,
      author: formData.author,
      yearPublished: formData.publishedYear,
      itemType: formData.itemType,
    };

    // try {
    //   await addItem(requestData).then((response) => {
    //     console.log('Response:', response);
    //   })
    //   triggerSuccessPopup('Item added successfully!');
    // } catch (error: any) {
    //   if (error.response && error.response.data) {
    //     // Handle specific error messages from the server
    //     const errorMessage = error.response.data.message || 'An error occurred while adding the item.';
    //     triggerFailPopup(errorMessage);
    //   } else {
    //     // Handle generic errors
    //     triggerFailPopup('An unexpected error occurred. Please try again later.');
    //   }
    //   console.error('Failed to add item:', error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Item</h1>
          <p className="text-gray-600">Add a new item to the library collection.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                Genre
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a genre</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="itemType" className="block text-sm font-medium text-gray-700">
                Item Type *
              </label>
              <select
                id="itemType"
                name="itemType"
                required
                value={formData.itemType}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select an item type</option>
                {itemTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700">
                Published Year *
              </label>
              <input
                type="number"
                id="publishedYear"
                name="publishedYear"
                required
                min="1"
                max={new Date().getFullYear()}
                value={formData.publishedYear}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter item description..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-30 px-2 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <Book className="h-4 w-4" />
              <span>{isLoading ? 'Adding...' : 'Add Item'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            className="fixed z-50 bottom-6 right-6 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
            style={{
              minWidth: 220,
              fontWeight: 600,
              fontSize: '1rem',
              opacity: successPopupVisible ? 1 : 0,
              pointerEvents: successPopupVisible ? 'auto' : 'none',
              transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
              background: 'linear-gradient(to right,rgb(192, 75, 202), #3b82f6)',
            }}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <CheckCircle className="h-5 w-5 text-white" />
            <span>{successMessage}</span>
            <button
              className="ml-auto flex items-center px-4 py-1 rounded-md bg-white text-blue-600 font-semibold shadow-md
                hover:bg-blue-200 hover:text-blue-800 hover:shadow-lg transition duration-300 ease-in-out
                transform  group"
              onClick={() => {
                const plusEncodedTitle = formData.title.split(' ').join('+');
                navigate(`/items?search=${plusEncodedTitle}`);
                setShowSuccessPopup(false);
              }}
            >
              See item
              <ArrowRight className="inline h-4 w-4 ml-2 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
            </button>

            <style>
              {`
                .popup-fadein {
                  animation: fadeinpop 0.3s cubic-bezier(0.4,0,0.2,1);
                }
                .popup-fadeout {
                  animation: fadeoutpop 0.35s cubic-bezier(0.4,0,0.2,1);
                }
                @keyframes fadeinpop {
                  from { opacity: 0; transform: translateY(30px) scale(0.97);}
                  to { opacity: 1; transform: translateY(0) scale(1);}
                }
                @keyframes fadeoutpop {
                  from { opacity: 1; transform: translateY(0) scale(1);}
                  to { opacity: 0; transform: translateY(30px) scale(0.97);}
                }
                @media (max-width: 600px) {
                  .fixed.bottom-6.right-6 { right: 1rem; bottom: 1rem; }
                }
              `}
            </style>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Fail Popup */}
      <AnimatePresence>
        {showFailPopup && (
          <motion.div
            className="fixed z-50 bottom-6 right-6 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
            style={{
              minWidth: 220,
              fontWeight: 600,
              fontSize: '1rem',
              opacity: failPopupVisible ? 1 : 0,
              pointerEvents: failPopupVisible ? 'auto' : 'none',
              transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
              background: 'linear-gradient(to right, rgb(221, 72, 72), rgb(216, 153, 153))',
            }}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
          >
            <Circle className="h-5 w-5 text-white" />
            <span>{failMessage}</span>
            <style>
              {`
                .popup-fadein {
                  animation: fadeinpop 0.3s cubic-bezier(0.4,0,0.2,1);
                }
                .popup-fadeout {
                  animation: fadeoutpop 0.35s cubic-bezier(0.4,0,0.2,1);
                }
                @keyframes fadeinpop {
                  from { opacity: 0; transform: translateY(30px) scale(0.97);}
                  to { opacity: 1; transform: translateY(0) scale(1);}
                }
                @keyframes fadeoutpop {
                  from { opacity: 1; transform: translateY(0) scale(1);}
                  to { opacity: 0; transform: translateY(30px) scale(0.97);}
                }
                @media (max-width: 600px) {
                  .fixed.bottom-6.right-6 { right: 1rem; bottom: 1rem; }
                }
              `}
            </style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddMap;