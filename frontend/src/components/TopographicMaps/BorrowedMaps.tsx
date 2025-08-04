import React, { useState, useEffect, useRef } from 'react';
import { Book, Search, Filter, Star, Eye, Heart, Grid, List, Clock, Calendar, ArrowLeft, RefreshCw, X, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
// import { ShinyButton } from "@/components/magicui/shiny-button";
// import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Item as BookType, Item } from '../../types';
import { useAuth } from '../context/AuthContext';
import { InteractiveHoverButton } from '../magicui/interactive-hover-button';
import { ShinyButton } from '../magicui/shiny-button';
// import { fetchCurrentlyBorrowedItems, fetchAllBorrows } from '../../utils/ClientService';
// import { sendReturnRequest, sendBorrowRequest } from '../../utils/UserBorrowService';
// import { Button } from '../ui/button';

const BorrowedMaps: React.FC = () => {
  const [borrowedItems, setBorrowedItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [returnLoading, setReturnLoading] = useState(false);

  const [itemsToBeShown, setItemsToBeShown] = useState<Item[]>([]);

  // Popup notification state
  const [popup, setPopup] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // useEffect(() => {
  //   fetchBorrowedItems();
  // }, [activeTab]);

  useEffect(() => {
    // Cleanup popup timeout on unmount
    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
    };
  }, []);

  const showPopup = (type: 'success' | 'error', message: string) => {
    setPopup({ type, message });
    if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
    popupTimeoutRef.current = setTimeout(() => setPopup(null), 3500);
  };

  // const fetchBorrowedItems = async () => {
  //   try {
  //     setLoading(true);
  //     if (activeTab === 'current') {
  //       const data = await fetchCurrentlyBorrowedItems();
  //       setBorrowedItems(data);
  //     } else {
  //       const data = await fetchAllBorrows();
  //       setBorrowedItems(data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching borrowed items:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const filteredItems = borrowedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === '' || item.genre === selectedGenre;
    if (showOverdueOnly && activeTab === 'current') {
      return matchesSearch && matchesGenre && isOverdue(item.borrowedOn);
    }
    return matchesSearch && matchesGenre;
  });

  // Calculate paginated items for each tab
  let paginatedItems: (Item & { count?: number })[] = [];
  let totalPages = 1;
  let groupedArray: (Item & { count: number })[] = [];
  if (activeTab === 'history') {
    // Group items by title+author+itemType
    const grouped = filteredItems.reduce((acc, item) => {
      const key = `${item.title}__${item.author}__${item.itemType}`;
      if (!acc[key]) {
        acc[key] = { ...item, count: 1 };
      } else {
        acc[key].count += 1;
      }
      return acc;
    }, {} as Record<string, Item & { count: number }>);
    groupedArray = Object.values(grouped);
    totalPages = Math.ceil(groupedArray.length / ITEMS_PER_PAGE);
    paginatedItems = groupedArray.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  } else {
    totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }

  // Reset to first page when filters/search/tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGenre, showOverdueOnly, viewMode, activeTab]);

  const genres = [...new Set(borrowedItems.map(item => item.genre))];

  // const handleReturnItem = async (itemTitle: string, itemType: string, authorName: string) => {
  //   try {
  //     setReturnLoading(true);

  //     const response = await sendReturnRequest(itemTitle, itemType, authorName);
  //     console.log('Response after the request to return the item: ', response)
  //     if (response.status === 200) {
  //       setBorrowedItems(borrowedItems.filter(item => item.title !== itemTitle && item.author !== authorName && item.itemType !== itemType));
  //       setShowReturnModal(false);
  //       setSelectedItem(null);
  //       showPopup('success', 'Return request sent successfully!');
  //     } else {
  //       showPopup('error', 'Failed to return item. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error('Failed to return item:', error);
  //     showPopup('error', 'Failed to return item. Please try again.');
  //   } finally {
  //     setReturnLoading(false);
  //   }
  // };

  const openReturnModal = (item: Item) => {
    setSelectedItem(item);
    setShowReturnModal(true);
  };

  const closeReturnModal = () => {
    setShowReturnModal(false);
    setSelectedItem(null);
  };

  const isOverdue = (borrowedOn?: string) => {
    if (!borrowedOn) return false;
    const borrowedDate = new Date(borrowedOn);
    const dueDate = new Date(borrowedDate.getTime() + (14 * 24 * 60 * 60 * 1000));
    return new Date() > dueDate;
  };

  const getDaysRemaining = (borrowedOn?: string) => {
    if (!borrowedOn) return null;
    const borrowedDate = new Date(borrowedOn);
    const dueDate = new Date(borrowedDate.getTime() + (14 * 24 * 60 * 60 * 1000));
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    if (typeof date === "string") {
      return date.split("T")[0];
    } else if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Popup Notification */}
      {popup && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in slide-in-from-right
            ${popup.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
          style={{
            minWidth: 260,
            fontWeight: 500,
            fontSize: '1rem',
            pointerEvents: 'auto',
            opacity: 1,
            transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          {popup.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span>{popup.message}</span>
        </div>
      )}

      {/* Return Confirmation Modal */}
      {showReturnModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Book className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedItem.title}</h3>
                <p className="text-sm text-gray-600">{selectedItem.author}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to return "{selectedItem.title}"? This action will send a return request.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={closeReturnModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={returnLoading}
              >
                Cancel
              </button>
              <button
                // onClick={() => handleReturnItem(selectedItem.title, selectedItem.itemType, selectedItem.author)}
                disabled={returnLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {returnLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  'Confirm Return'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Borrowed Items</h1>
        <p className="text-gray-600 mt-1">Manage your borrowed items and track due dates</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'current'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            Currently Borrowed
          </button>
          <button
            onClick={() => { setActiveTab('history') }}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'history'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            Borrow History
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sleek Search Input */}
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search borrowed items by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gradient-to-r from-blue-50 to-purple-50"
            />
          </div>
          {/* Filters and View Mode */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* View Mode Toggle */}
            <div className="flex border border-gray-200 rounded-full overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 shadow-inner">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-100'}`}
                title="Grid View"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-100'}`}
                title="List View"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
            {/* Refresh Button with shimmer */}
            <div>
              <button
                type="button"
                // onClick={fetchBorrowedItems}
                className="!px-4 !py-2 !rounded-full !bg-gradient-to-r from-blue-500 to-purple-500 !text-white !font-semibold !shadow-lg relative group transition-transform duration-200 hover:scale-90"
                title="Refresh"
              >

                <span className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-pulse" />
                  <span className="hidden sm:inline">Refresh</span>
                </span>
                <span className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
                  <span className="block w-full h-full shimmer-bg" />
                </span>
              </button>
              <style>{`
                .shimmer-bg {
                  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
                  animation: shimmer 1.5s infinite;
                }
                @keyframes shimmer {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>

      {/* Items Display */}
      {activeTab === 'history' ? (
        // Grouped Borrow History View
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((item) => (
              <div key={`${item.title}__${item.author}__${item.itemType}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Book className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.author}</p>
                      <p className="text-sm text-gray-600">Item type: {item.itemType}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{item.genre}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-xs text-gray-500 block">Published Year: {item.yearPublished}</span>
                      </div>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Borrowed {item.count ?? ''} {item.count === 1 ? 'time' : 'times'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="divide-y divide-gray-100">
              {paginatedItems.map((item) => (
                <div key={`${item.title}__${item.author}__${item.itemType}`} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Book className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.author}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500">{item.genre}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-xs text-gray-500">{item.yearPublished}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Borrowed {item.count ?? ''} {item.count === 1 ? 'time' : 'times'}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        // Current Borrowed Items (original display)
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((item) => {
              const overdue = isOverdue(item.borrowedOn);
              const daysRemaining = getDaysRemaining(item.borrowedOn);

              return (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Book className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.author}</p>
                        <p className="text-sm text-gray-600">Item type: {item.itemType}</p>
                        <p className="text-sm text-gray-500">Borrowed on: { }</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500">{item.genre}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs text-gray-500 block">Published Year: {item.yearPublished}</span>
                        </div>
                        <div className="mt-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.availabilityStatus !== 'available'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                            }`}>
                            {overdue
                              ? 'Overdue'
                              : daysRemaining && daysRemaining <= 3
                                ? `Due in ${daysRemaining} days`
                                : daysRemaining
                                  ? `Due in ${daysRemaining} days`
                                  : 'Borrowed'
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p> */}

                    {/* Borrow Date Info */}
                    {item.borrowedOn && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Borrowed on: {formatDate(item.borrowedOn)}</span>
                        </div>
                        {daysRemaining && (
                          <div className="flex items-center text-sm mt-1">
                            <Clock className={`h-4 w-4 mr-2 ${overdue ? 'text-red-500' : daysRemaining <= 3 ? 'text-yellow-500' : 'text-green-500'}`} />
                            <span className={overdue ? 'text-red-600' : daysRemaining <= 3 ? 'text-yellow-600' : 'text-green-600'}>
                              {overdue
                                ? `${Math.abs(daysRemaining)} days overdue`
                                : `${daysRemaining} days remaining`
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {activeTab !== 'current' && activeTab === 'history' ? (
                          <>
                            <span className="text-xs text-gray-500">Active tab: {activeTab}</span>
                            <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors rounded-lg hover:bg-yellow-50">
                              <Star className="h-4 w-4" />
                              <h1>Salut</h1>
                            </button>
                          </>
                        ) : null}
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                          <Heart className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                      {/* Show return button only for current borrows */}
                      {activeTab === 'current' && (
                        <InteractiveHoverButton
                          // onClick={() => handleReturnItem(item.title, item.itemType, item.author)}
                          className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-base rounded-lg shadow-md hover:from-green-500 hover:via-blue-500 hover:to-blue-700 hover:shadow-lg transition-all font-semibold"
                        >
                          Return
                        </InteractiveHoverButton>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="divide-y divide-gray-100">
              {paginatedItems.map((item) => {
                const overdue = isOverdue(item.borrowedOn);
                const daysRemaining = getDaysRemaining(item.borrowedOn);

                return (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Book className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.author}</p>
                            <p className="text-sm text-gray-600">Item type: {item.itemType}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500">{item.genre}</span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-xs text-gray-500">Published Year: {item.yearPublished}</span>
                            </div>
                            {item.availabilityStatus !== 'available' && (
                              <div className="flex items-center mt-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Borrowed: {formatDate(item.borrowedOn)}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-4 py-2 rounded-lg text-xs font-medium ${item.availabilityStatus !== 'available'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                              }`}>
                              {item.availabilityStatus !== 'available'
                                ? 'Borrowed' : 'Available'
                              }
                            </span>
                            {/* Show return button only for current borrows */}
                            {activeTab === 'current' && (
                              <InteractiveHoverButton
                                // onClick={() => handleReturnItem(item.title, item.itemType, item.author)}
                                className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-base rounded-lg shadow-md hover:from-green-500 hover:via-blue-500 hover:to-blue-700 hover:shadow-lg transition-all font-semibold"
                              >
                                Return
                              </InteractiveHoverButton>
                            )}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Book className="h-12 w-12 text-blue-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {activeTab === 'current' ? 'No borrowed items found' : 'No borrowing history found'}
          </h3>
          <p className="mt-1 text-base text-gray-500 mb-4">
            {activeTab === 'current'
              ? "You haven't borrowed any items yet. Start exploring our collection!"
              : 'Your borrowing history will appear here once you borrow items.'
            }
          </p>
          {activeTab === 'current' && (
            <ShinyButton
              onClick={() => window.location.href = '/items'}
              className="mt-6 inline-flex items-center px-7 py-3 rounded-xl font-semibold text-base bg-gradient-to-r from-blue-100 to-purple-200 text-blue-900 shadow-lg hover:from-blue-200 hover:to-purple-300 transition-all relative group border border-blue-100"
              style={{ overflow: 'hidden' }}
            >
              Browse Items
              {/* Shimmer effect */}
              <span className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden">
                <span className="block w-full h-full shimmer-bg" />
              </span>
              <style>
                {`
                  .shimmer-bg {
                    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 100%);
                    animation: shimmer 1.5s infinite;
                  }
                  @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                  }
                `}
              </style>
            </ShinyButton>
          )}
        </div>
      )}
    </div>
  );
};

export default BorrowedMaps; 