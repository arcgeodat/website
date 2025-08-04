import React, { useState, useEffect } from 'react';
import { Book, BookOpen, Star, TrendingUp, ArrowRight, Clock, Heart, Tag, ArrowUp, ArrowDown, MoreVertical, Mail, Phone, Calendar, User, Info, Type } from 'lucide-react';
import { Item } from '../../types/index.ts';
import { useNavigate, useLocation } from 'react-router-dom';

import ConfettiExplosion from 'react-confetti-explosion';
import { ShinyButton } from '../magicui/shiny-button.tsx';

// Replace welcomeMessages with an array of objects
const welcomeMessages = [
  {
    title: "Welcome back!",
    subtitle: "Dive into your next favorite book today."
  },
  {
    title: "Hello again!",
    subtitle: "Let's find something new for you to enjoy."
  },
  {
    title: "Good to see you!",
    subtitle: "The shelves are waiting."
  },
  {
    title: "Your library adventure continues now!",
    subtitle: "Start exploring new stories and genres."
  },
  {
    title: "Back for more?",
    subtitle: "The next great story is just a click away."
  }
];

const UserDashboard: React.FC = () => {

  const navigator = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get('tab') || 'all';

  const [activeTab, setActiveTab] = useState(initialTab);

  const [stats, setStats] = useState({
    totalItems: 0,
    borrowedItems: 0,
    reviewsWritten: 0,
    favoriteGenre: 'Fiction',
  });
  const [items, setItems] = useState<Item[]>([]);
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [returnedItemsNum, setReturnedItemsNum] = useState<number>(0);
  const [borrowedBooks, setBorrowedItems] = useState<Item[]>([]);
  const [currentylBorrowedItems, setCurrentlyBorrowedItems] = useState<Item[]>([]);

  const [mostBorrowedItems, setMostBorrowedItems] = useState<Item[]>([]);
  const [maxAppearances, setMaxAppearances] = useState(0);

  const [selectedBorrowedItem, setSelectedBorrowedItem] = useState<Item | null>(null);
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (date: any) => {
    if (!date) return '';
    if (typeof date === "string") {
      return date.split("T")[0];
    } else if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return '';
  };

  const randomWelcomeMessage = React.useMemo(() => {
    return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  }, []);

  const fetchDashboardData = async () => {
    console.log('Fetching dashboard data...');
    const storedClient = JSON.parse(localStorage.getItem('client') ?? '{}');
    console.log('Stored client:', storedClient);

    // try {

    //   getTheNumberOfAllEnabledItems().then(response => {
    //     setStats(prevStats => ({
    //       ...prevStats,
    //       totalItems: response.data
    //     }))
    //   }).catch(error => {
    //     console.error('Error fetching the number of enabled items: ', error)
    //   })

    //   getEnabledRecentItems().then(response => {
    //     setRecentItems(response.data)
    //   }).catch(error => {
    //     console.error('Error fetching the number of enabled items: ', error)
    //   })

    //   fetchMostBorrowedItems().then((response) => {
    //     console.log('Most borrowed items:', response);
    //     const maxAppearances = response.message;
    //     const mostBorrowedItems = response.data;
    //     setMaxAppearances(maxAppearances);
    //     setMostBorrowedItems(mostBorrowedItems);
    //   }).catch(error => {
    //     console.error('Error fetching most borrowed items:', error);
    //   });

    //   fetchNumberOfCurrentlyBorrowedItems().then(response => {
    //     setStats(prevStats => ({
    //       ...prevStats,
    //       borrowedItems: response.data
    //     }));
    //   }).catch(error => {
    //     console.error('Error fetching currently borrowed items:', error);
    //   });

    //   fetchTheNumberOfReturnedItemsThisMonth().then((response) => {
    //     setReturnedItemsNum(response.data);
    //   }).catch(error => {
    //     console.error('Error fetching the number of returned items this month:', error);
    //   });

    //   fetchTheNumberOfPersonalReviews().then((response) => {
    //     setStats(prevStats => ({
    //       ...prevStats,
    //       reviewsWritten: response.data
    //     }));
    //   }).catch(error => {
    //     console.error('Error fetching the number of personal reviews:', error);
    //   });


    // } catch (error) {
    //   console.error('Error fetching dashboard data:', error);
    // }
  };

  // Set up the goal 
  const goal = 5;

  // Calculate the progress towards the goal
  const progress = Math.min((returnedItemsNum / goal) * 100, 100);
  // Check if the goal has been achieved
  const goalAchieved = returnedItemsNum >= goal;
  const [showConfetti, setShowConfetti] = useState(false);

  // Show confetti if the goal is achieved
  useEffect(() => {
    if (goalAchieved) setShowConfetti(true);
    else setShowConfetti(false);
  }, [goalAchieved]);

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{randomWelcomeMessage.title}</h1>
            <p className="text-blue-100 text-lg">{randomWelcomeMessage.subtitle}</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Book className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
          onClick={() => navigator('/items')}
          title="View all available items"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Items</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalItems.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Book className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
          onClick={() => navigator('/borrowed')}
        >

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Currently Borrowed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.borrowedItems}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
          onClick={() => navigator('/reviews#my-reviews')}
          title="Go to your reviews"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reviews Written</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.reviewsWritten}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Favorite Genre</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{stats.favoriteGenre}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: All content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content (spans 2 columns on desktop) */}
        <div className="lg:col-span-2 space-y-8">

          {currentylBorrowedItems.length > 0 && (
            <div className="grid grid-cols-1 gap-8">
              {/* Borrowed Books List */}
              <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Currently Borrowed Items</h2>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                        onClick={() => navigator('/borrowed')}
                      >
                        View all <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {currentylBorrowedItems.length === 0 ? (
                        <div className="text-gray-500 text-center py-8">
                          You are not borrowing any items.
                        </div>
                      ) : (
                        currentylBorrowedItems.map((book) => (
                          <div
                            key={book.id}
                            className={`flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${selectedBorrowedItem && selectedBorrowedItem.id === book.id
                              ? 'ring-2 ring-blue-400 bg-blue-50'
                              : ''
                              }`}
                            onClick={() => setSelectedBorrowedItem(book)}
                          >
                            <div className="flex-shrink-0">
                              <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Book className="h-6 w-6 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
                              <p className="text-sm text-gray-600">Author: {book.author}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Most Borrowed Items */}
          {mostBorrowedItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Your Most Borrowed Items</h2>
                  <button
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                    onClick={() => navigator('/borrowed')}
                  >
                    Borrow more <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mostBorrowedItems.map((item) => (
                    <div
                      key={item.id + '-' + item.title}
                      className="p-4 rounded-lg hover:bg-gray-50 transition-colors flex flex-col gap-3 sm:flex-row sm:items-center sm:space-x-4"
                    >
                      {/* Row 1: Book icon and about the item */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Book className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                          <p className="text-sm text-gray-600">Author: {item.author}</p>
                          <p className="text-sm text-gray-600">Item Type: {item.itemType}</p>
                          <div className="flex items-center mt-1 flex-wrap gap-2">
                            <span className="text-xs text-gray-500">{item.genre}</span>
                            {maxAppearances !== 0 && (
                              <div className="flex items-center space-x-1 bg-blue-50 rounded-full px-2 py-0.5">
                                <TrendingUp className="h-4 w-4 text-blue-500" />
                                <span className="text-xs text-blue-700 font-semibold tracking-wide">
                                  {maxAppearances}x borrowed
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Row 2: Status, favorite, and borrow button */}
                      <div className="flex flex-row flex-wrap items-center gap-2 mt-2 sm:mt-0 sm:flex-col sm:items-end sm:justify-end">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.availabilityStatus === 'available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {item.availabilityStatus === 'available' ? 'Available' : 'Borrowed'}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        </button>
                        {item.availabilityStatus === 'available' && (
                          <ShinyButton
                            className="px-3 py-1 text-xs font-medium rounded-lg"
                            onClick={() => {
                              navigator(`/items?search=${encodeURIComponent(item.title)}`);
                            }}
                          >
                            Borrow
                          </ShinyButton>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {recentItems.length !== 0 && (
            <>
              {/* Recently Added Books */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Recently Added Books</h2>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                      onClick={() => navigator('/items')}
                    >
                      View more items  <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recentItems.map((book) => (
                      <div
                        key={book.id}
                        className="flex space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                        onClick={() => {
                          // Use + instead of %20 for spaces
                          const plusEncodedTitle = book.title.split(' ').join('+');
                          navigator(`/items?search=${plusEncodedTitle}`);
                        }}
                        title={`Search for "${book.title}"`}
                      >
                        <div className="w-16 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Book className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{book.title}</h3>
                          <p className="text-sm text-gray-600">{book.author}</p>
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${book.available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}>
                              {book.available ? 'Available' : 'Borrowed'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}


        </div>

        {/* Sidebar: Borrowed Item Details at the top, then Quick Actions, then Reading Progress */}
        <div className="space-y-6 self-start">

          {borrowedBooks.length !== 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
              {/* Borrowed Item Details Panel */}
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Borrowed Item Details</h2>
              </div>
              <div className="p-6 flex-1">
                {selectedBorrowedItem ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <Book className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{selectedBorrowedItem.title}</h3>
                      </div>
                    </div>
                    <div className="space-y-2 gap-2">
                      <div>
                        <div className="flex items-center text-gray-700">
                          <User className="h-5 w-5 mr-2 text-gray-400" />
                          <span>Author: {selectedBorrowedItem.author}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                        <span>Published Year: {selectedBorrowedItem.yearPublished}</span>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-5 w-5 mr-2 text-gray-400" />
                          <span>
                            {selectedBorrowedItem.borrowedOn
                              ? `Borrowed On: ${formatDate(selectedBorrowedItem.borrowedOn)}`
                              : 'Borrow date not available'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-700">
                          <Tag className="h-5 w-5 mr-2 text-gray-400" />
                          <span>Item Type: {selectedBorrowedItem.itemType}</span>
                        </div>
                        <div className="flex items-center text-gray-700 mt-2">
                          <Info className="h-5 w-5 mr-2 text-gray-400" />
                          <span>{selectedBorrowedItem.description ?? <span className="text-gray-400">No description</span>}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center mt-8">
                    Select a book to see more details.
                  </div>
                )}
              </div>
            </div>
          )}


          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                onClick={() => navigator('/items')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Book className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Browse Items</h3>
                    <p className="text-sm text-gray-600">Explore our collection</p>
                  </div>
                </div>
              </button>

              <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group"
                onClick={() => navigator('/borrowed')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">My Borrowed Items</h3>
                    <p className="text-sm text-gray-600">View current loans</p>
                  </div>
                </div>
              </button>

              <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all group"
                onClick={() => navigator('/reviews')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Write Review</h3>
                    <p className="text-sm text-gray-600">Share your thoughts</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Reading Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="p-6 border-b border-gray-100  ">
              <h2 className="text-xl font-semibold text-gray-900">Reading Progress</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Items read this month</span>
                  <span className="font-semibold text-gray-900">{returnedItemsNum}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${goalAchieved ? "bg-green-500" : "bg-blue-600"}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">Goal: {goal} items per month</p>
                {goalAchieved && (
                  <div className="flex items-center space-x-2 mt-2 text-green-600 font-semibold">
                    {showConfetti && <ConfettiExplosion />}
                    <span>🎉 Goal achieved this month! 🎉</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default UserDashboard;