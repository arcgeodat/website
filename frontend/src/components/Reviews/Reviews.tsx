import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Book, Search, Filter, Star, Eye, Heart, Grid, List, MessageSquare, Plus, Edit, Trash2, User, Calendar, RefreshCw, EyeOff, ArrowRight } from 'lucide-react';
import { ShinyButton } from "@/components/magicui/shiny-button";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Item as BookType, Item, Review, ReviewDTO, UpdateReviewDTO } from '../../types';
import { AnimatePresence, motion } from 'framer-motion';
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { useLocation, useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { useAuth } from '../context/AuthContext';

interface ReviewWithItem extends Review { }

// Helper debounce function (moved outside component for performance)
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const Reviews: React.FC = () => {
  const location = useLocation();
  const initialTab = location.hash.replace('#', '') || 'all';
  const navigate = useNavigate();

  const INITIAL_PAGE = 0;
  const { user } = useAuth();

  // State variables
  const [showTypeMessage, setShowTypeMessage] = useState(true);
  const [allReviews, setAllReviews] = useState<ReviewWithItem[]>([]);
  const [reviewableItems, setReviewableItems] = useState<BookType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'my-reviews' | 'write-review'>(initialTab as 'all' | 'my-reviews' | 'write-review');
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState<BookType | null>(null);
  const [reviewForm, setReviewForm] = useState({
    reviewId: 0,
    rating: 5,
    comment: '',
    isAnonymous: false
  });
  const [editingReview, setEditingReview] = useState<ReviewWithItem | null>(null);
  const [anonymousOnly, setAnonymousOnly] = useState(false);
  const [nonAnonymousOnly, setNonAnonymousOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Search-specific state
  const [searchResults, setSearchResults] = useState<ReviewWithItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreResults, setHasMoreResults] = useState(true);

  // Popup states
  const [showAnonPopup, setShowAnonPopup] = useState(false);
  const [anonPopupText, setAnonPopupText] = useState('');
  const [anonPopupVisible, setAnonPopupVisible] = useState(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deletePopupTimeout, setDeletePopupTimeout] = useState<NodeJS.Timeout | null>(null);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupText, setSuccessPopupText] = useState('');
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const successPopupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [showFailuarePopup, setShowFailuarePopup] = useState(false);
  const [failuarePopupText, setFailuarePopupText] = useState('');
  const [failuarePopupVisible, setFailuarePopupVisible] = useState(false);

  const [showModalAnonPopup, setShowModalAnonPopup] = useState(false);
  const [modalAnonPopupText, setModalAnonPopupText] = useState('');
  const [modalAnonPopupVisible, setModalAnonPopupVisible] = useState(false);
  const modalAnonPopupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [commentError, setCommentError] = useState("");

  // Search timeout ref
  const debouncedSearchRef = useRef<NodeJS.Timeout>();

  // Get client only once
  const client = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('client') ?? 'null');
    } catch {
      return null;
    }
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (debouncedSearchRef.current) {
        clearTimeout(debouncedSearchRef.current);
      }
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
      if (successPopupTimeoutRef.current) {
        clearTimeout(successPopupTimeoutRef.current);
      }
      if (modalAnonPopupTimeoutRef.current) {
        clearTimeout(modalAnonPopupTimeoutRef.current);
      }
      if (deletePopupTimeout) {
        clearTimeout(deletePopupTimeout);
      }
    };
  }, [deletePopupTimeout]);

  // Search functionality
  // const performSearch = async (query: string) => {
  //   if (!query.trim()) {
  //     setSearchResults([]);
  //     setIsSearching(false);
  //     setShowTypeMessage(true);
  //     return;
  //   }

  //   setIsSearching(true);
  //   setShowTypeMessage(false);

  //   try {
  //     console.log("Performing search for:", query);
  //     const results = await fetchAllEnabledReviewsPaginated(INITIAL_PAGE, query);
  //     setSearchResults(results);
  //     setCurrentPage(INITIAL_PAGE);
  //     setHasMoreResults(results.length > 0);
  //   } catch (error: any) {
  //     console.error("Search failed:", error);
  //     if (error.response && error.response.status === 400) {
  //       triggerErrorPopup('Failed to fetch reviews. Please try again later.');
  //     } else {
  //       triggerErrorPopup('An unexpected error occurred while fetching reviews.');
  //     }
  //     setSearchResults([]);
  //   } finally {
  //     setIsSearching(false);
  //   }
  // };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (debouncedSearchRef.current) {
      clearTimeout(debouncedSearchRef.current);
    }

    // Only search if there's a search term
    if (value.trim()) {
      setIsSearching(true);
      setShowTypeMessage(false);
      debouncedSearchRef.current = setTimeout(() => {
        // performSearch(value);
      }, 500);
    } else {
      setSearchResults([]);
      setIsSearching(false);
      setShowTypeMessage(true);
    }
  };

  // const loadMoreResults = async () => {
  //   if (!hasMoreResults || isSearching || !searchTerm.trim()) return;

  //   setIsSearching(true);
  //   try {
  //     const nextPage = currentPage + 1;
  //     const moreResults = await fetchAllEnabledReviewsPaginated(nextPage, searchTerm);

  //     if (moreResults.length > 0) {
  //       setSearchResults(prev => [...prev, ...moreResults]);
  //       setCurrentPage(nextPage);
  //     } else {
  //       setHasMoreResults(false);
  //     }
  //   } catch (error) {
  //     console.error("Failed to load more results:", error);
  //   } finally {
  //     setIsSearching(false);
  //   }
  // };

  // Data fetching
  // const fetchDataByQuery = async () => {
  //   setLoading(true);
  //   try {
  //     if (searchTerm.trim()) {
  //       await performSearch(searchTerm);
  //     } else {
  //       // Fetch all data when no search term
  //       const [allReviewsData, reviewableItemsData] = await Promise.all([
  //         fetchAllReviews(),
  //         fetchReturnedItems()
  //       ]);
  //       setAllReviews(allReviewsData);
  //       setReviewableItems(reviewableItemsData);
  //       setShowTypeMessage(true);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch data:", error);
  //     triggerErrorPopup('Failed to fetch data. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Initial data fetch
  useEffect(() => {
    // Don't run on initial mount if searchTerm is empty
    if (searchTerm.trim() === '') {
      setLoading(false);
      return
    };

    console.log("Fetching data by query on mount or search term change:", searchTerm);
    const debounceTimer = setTimeout(() => {
      // fetchDataByQuery();
    }, 300); // 300ms debounce delay

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]); // Only run once on mount

  // Data source logic
  const getDataSource = () => {
    // If searching, use search results
    if (searchTerm.trim() && searchResults.length > 0) {
      return searchResults;
    }

    // Otherwise use filtered reviews based on active tab
    switch (activeTab) {
      case 'my-reviews':
        return personalFilteredReviews;
      case 'write-review':
        return filteredItems;
      default:
        return filteredReviews;
    }
  };

  // Popup for anonymous filter change (main page)
  useEffect(() => {
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }

    let shouldShow = false;
    let text = '';
    if (anonymousOnly && !nonAnonymousOnly) {
      text = "Showing only anonymous reviews";
      shouldShow = true;
    } else if (nonAnonymousOnly && !anonymousOnly) {
      text = "Showing only non-anonymous reviews";
      shouldShow = true;
    } else if (anonymousOnly && nonAnonymousOnly) {
      text = "Showing all reviews";
      shouldShow = true;
    }

    if (shouldShow) {
      setAnonPopupText(text);
      setShowAnonPopup(true);
      setAnonPopupVisible(true);
      popupTimeoutRef.current = setTimeout(() => {
        setAnonPopupVisible(false);
        setTimeout(() => setShowAnonPopup(false), 350);
      }, 2500);
    }

    if (showAnonPopup) {
      setAnonPopupVisible(false);
      setTimeout(() => setShowAnonPopup(false), 350);
    }

    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
        popupTimeoutRef.current = null;
      }
    };
  }, [anonymousOnly, nonAnonymousOnly]);

  // Modal-specific anonymous popup effect
  useEffect(() => {
    if (showModalAnonPopup) {
      setModalAnonPopupVisible(true);
      if (modalAnonPopupTimeoutRef.current) clearTimeout(modalAnonPopupTimeoutRef.current);
      modalAnonPopupTimeoutRef.current = setTimeout(() => {
        setModalAnonPopupVisible(false);
        setTimeout(() => setShowModalAnonPopup(false), 350);
      }, 2500);
    }
    return () => {
      if (modalAnonPopupTimeoutRef.current) {
        clearTimeout(modalAnonPopupTimeoutRef.current);
        modalAnonPopupTimeoutRef.current = null;
      }
    };
  }, [showModalAnonPopup]);

  // Popup for review modal anonymous toggle
  useEffect(() => {
    if (showWriteReviewModal) {
      setShowAnonPopup(false);
      setAnonPopupVisible(false);
    }
  }, [showWriteReviewModal]);

  // Memoize filtered reviews for performance
  const filteredReviews = React.useMemo(() => {
    return allReviews.filter(review => {
      const matchesSearch =
        review.item?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.item?.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === '' || review.item?.genre === selectedGenre;
      const matchesAnonymous =
        (anonymousOnly && review.anonymous) ||
        (nonAnonymousOnly && !review.anonymous) ||
        (!anonymousOnly && !nonAnonymousOnly);
      const matchesMinRating = review.rating >= minRating;
      return matchesSearch && matchesGenre && matchesAnonymous && matchesMinRating;
    });
  }, [allReviews, searchTerm, selectedGenre, anonymousOnly, nonAnonymousOnly, minRating]);

  // Memoize personal reviews and filtered personal reviews
  const personalReviews = React.useMemo(() => {
    if (!client) return [];
    return allReviews.filter(review => review.client?.clientId === client.clientId);
  }, [allReviews, client]);

  const personalFilteredReviews = React.useMemo(() => {
    return personalReviews.filter(review => {
      const matchesSearch =
        review.item?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.item?.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === '' || review.item?.genre === selectedGenre;
      const matchesAnonymous =
        (anonymousOnly && review.anonymous) ||
        (nonAnonymousOnly && !review.anonymous) ||
        (!anonymousOnly && !nonAnonymousOnly);
      const matchesMinRating = review.rating >= minRating;
      return matchesSearch && matchesGenre && matchesAnonymous && matchesMinRating;
    });
  }, [personalReviews, searchTerm, selectedGenre, anonymousOnly, nonAnonymousOnly, minRating]);

  // Memoize filtered items for write-review tab
  const filteredItems = React.useMemo(() => {
    return reviewableItems.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === '' || item.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [reviewableItems, searchTerm, selectedGenre]);

  // Review handlers
  const handleWriteReview = (item: Item) => {
    setSelectedItemForReview(item || null);
    setReviewForm({ reviewId: 0, rating: 5, comment: '', isAnonymous: false });
    setShowWriteReviewModal(true);
  };

  // const handleSubmitReview = async () => {
  //   if (!selectedItemForReview) {
  //     triggerErrorPopup('No item selected for review.');
  //     return;
  //   }

  //   try {
  //     await createReview({
  //       itemId: selectedItemForReview.id,
  //       rating: reviewForm.rating,
  //       comment: reviewForm.comment,
  //       isAnonymous: reviewForm.isAnonymous
  //     });

  //     setShowWriteReviewModal(false);
  //     setSelectedItemForReview(null);
  //     setReviewForm({ reviewId: 0, rating: 5, comment: '', isAnonymous: false });
  //     triggerSuccessPopup('Review submitted successfully!');
  //     fetchDataByQuery();
  //   } catch (error) {
  //     console.error('Failed to submit review:', error);
  //     triggerErrorPopup('Failed to submit review. Please try again.');
  //   }
  // };

  const handleEditReview = (review: ReviewWithItem) => {
    setEditingReview(review);
    setReviewForm({
      reviewId: review.reviewId,
      rating: review.rating,
      comment: review.comment,
      isAnonymous: review.anonymous,
    });
    setShowWriteReviewModal(true);
  };

  // const handleUpdateReview = async (review: ReviewDTO) => {
  //   if (!editingReview || !review.comment.trim()) {
  //     triggerErrorPopup('Please provide a comment for your review.');
  //     return;
  //   }
  //   review.reviewId = editingReview.reviewId;
  //   console.log("Updating Review In the tsx: ", review);

  //   try {
  //     await updateReview(review);
  //     setShowWriteReviewModal(false);
  //     setEditingReview(null);
  //     setReviewForm({ reviewId: 0, rating: 5, comment: '', isAnonymous: false });
  //     triggerSuccessPopup('Review updated successfully!');
  //     fetchDataByQuery();
  //   } catch (error) {
  //     console.error('Failed to update review:', error);
  //     triggerErrorPopup('Failed to update review. Please try again.');
  //   }
  // };

  // const handleDeleteReviewByClient = async (reviewId: number) => {
  //   try {
  //     await disableReviewByClient(reviewId);
  //     triggerSuccessPopup('Review deleted successfully!');
  //     fetchDataByQuery();
  //   } catch (error) {
  //     console.error('Failed to delete review:', error);
  //     triggerErrorPopup('Failed to delete review. Please try again.');
  //   }
  // };

  // const handleDeleteReview = async (reviewId: number) => {
  //   console.warn("Deleting review with ID:", reviewId, ' as an admin/librarian');
  //   try {
  //     await disableReview(reviewId);
  //     triggerSuccessPopup('Review deleted successfully!');
  //     fetchDataByQuery();
  //   } catch (error) {
  //     console.error('Failed to delete review:', error);
  //     triggerErrorPopup('Failed to delete review. Please try again.');
  //   }
  // };

  const askDeleteReview = (reviewId: number) => {
    setPendingDeleteId(reviewId);
    setShowDeletePopup(true);
    setDeletePopupVisible(true);
    if (deletePopupTimeout) clearTimeout(deletePopupTimeout);
    setDeletePopupTimeout(setTimeout(() => {
      setDeletePopupVisible(false);
      setTimeout(() => setShowDeletePopup(false), 350);
      setPendingDeleteId(null);
    }, 6000));
  };

  // const confirmDeleteReview = async () => {
  //   if (pendingDeleteId !== null) {
  //     if (
  //       activeTab === 'my-reviews' ||
  //       (user?.role && user.role.toLowerCase() === 'user')
  //     ) {
  //       await handleDeleteReviewByClient(pendingDeleteId);
  //     } else {
  //       await handleDeleteReview(pendingDeleteId);
  //     }
  //     setDeletePopupVisible(false);
  //     setTimeout(() => setShowDeletePopup(false), 350);
  //     setPendingDeleteId(null);
  //   }
  // };

  const cancelDeleteReview = () => {
    setDeletePopupVisible(false);
    setTimeout(() => setShowDeletePopup(false), 350);
    setPendingDeleteId(null);
  };

  // Helper popup functions
  const triggerSuccessPopup = (text: string) => {
    setSuccessPopupText(text);
    setShowSuccessPopup(true);
    setSuccessPopupVisible(true);
    if (successPopupTimeoutRef.current) clearTimeout(successPopupTimeoutRef.current);
    successPopupTimeoutRef.current = setTimeout(() => {
      setSuccessPopupVisible(false);
      setTimeout(() => setShowSuccessPopup(false), 350);
    }, 2500);
  };

  const triggerErrorPopup = (text: string) => {
    console.log("Triggering error popup with text:", text);
    setFailuarePopupText(text);
    setShowFailuarePopup(true);
    setFailuarePopupVisible(true);
    setTimeout(() => {
      setFailuarePopupVisible(false);
      setTimeout(() => setShowFailuarePopup(false), 3500);
    }, 2500);
  };

  // Helper functions
  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            disabled={!interactive}
          >
            <Star
              className={`h-5 w-5 ${star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
                }`}
            />
          </button>
        ))}
      </div>
    );
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

  const reviewCardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 24 },
  };

  const handleTabChange = (tab: 'all' | 'my-reviews' | 'write-review') => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  // Render logic helpers
  const isLoading = loading || isSearching;

  const shouldShowEmptyState = () => {
    const dataSource = getDataSource();
    return !isLoading && dataSource.length === 0 && !shouldShowTypeMessage();
  };

  const shouldShowTypeMessage = () => {
    return !searchTerm.trim() && !isLoading && showTypeMessage;
  };

  const renderGridView = (dataSource: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {dataSource.map((item) => (
          <motion.div
            key={item.reviewId || item.id}
            variants={reviewCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            layout
          >
            {activeTab === 'write-review' ? (
              // Write-review grid card
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {item.author}</p>
                  <p className="text-xs text-gray-500">{item.genre}</p>
                </div>
                <button
                  onClick={() => handleWriteReview(item)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Write Review
                </button>
              </div>
            ) : (
              // Review grid card
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{item.item?.title}</h3>
                    <p className="text-sm text-gray-600">by {item.item?.author}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(item.rating)}
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{item.comment}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    {item.anonymous ? (
                      <span className="flex items-center gap-1">
                        <EyeOff className="h-3 w-3" />
                        Anonymous
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {item.client?.firstName} {item.client?.lastName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.reviewDate)}
                  </div>
                </div>

                {(activeTab === 'my-reviews' || (user?.role && ['admin', 'librarian'].includes(user.role.toLowerCase()))) && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    {activeTab === 'my-reviews' && (
                      <button
                        onClick={() => handleEditReview(item)}
                        className="flex-1 px-3 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => askDeleteReview(item.reviewId)}
                      className="flex-1 px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  const renderListView = (dataSource: any[]) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="divide-y divide-gray-100">
        <AnimatePresence>
          {dataSource.length === 0 ? (
            <motion.div
              key="no-items"
              variants={reviewCardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-6 text-center text-gray-500">
                {activeTab === 'write-review' ? 'No items available for review.' : 'No reviews found.'}
              </div>
            </motion.div>
          ) : (
            dataSource.map(item => (
              <motion.div
                key={item.reviewId || item.id}
                variants={reviewCardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                {activeTab === 'write-review' ? (
                  // Write-review list item
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">by {item.author}</p>
                      <p className="text-xs text-gray-500">{item.genre}</p>
                    </div>
                    <button
                      onClick={() => handleWriteReview(item)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Write Review
                    </button>
                  </div>
                ) : (
                  // Review list item
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.item?.title}</h3>
                          <p className="text-sm text-gray-600">by {item.item?.author}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStars(item.rating)}
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm mb-3">{item.comment}</p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          {item.anonymous ? (
                            <span className="flex items-center gap-1">
                              <EyeOff className="h-3 w-3" />
                              Anonymous
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {item.client?.firstName} {item.client?.lastName}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.reviewDate)}
                          </span>
                        </div>

                        {(activeTab === 'my-reviews' || (user?.role && ['admin', 'librarian'].includes(user.role.toLowerCase()))) && (
                          <div className="flex gap-2">
                            {activeTab === 'my-reviews' && (
                              <button
                                onClick={() => handleEditReview(item)}
                                className="px-3 py-1 text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors flex items-center gap-1"
                              >
                                <Edit className="h-3 w-3" />
                                Edit
                              </button>
                            )}
                            <button
                              onClick={() => askDeleteReview(item.reviewId)}
                              className="px-3 py-1 text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          {isSearching && (
            <p className="ml-4 text-gray-600">Searching...</p>
          )}
        </div>
      );
    }

    if (shouldShowTypeMessage()) {
      return (
        <AnimatePresence>
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Search className="h-12 w-12 text-blue-400" />
            </motion.div>
            <motion.h3
              className="text-lg font-medium text-gray-900"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              Start typing to find desired reviews
            </motion.h3>
            <motion.p
              className="mt-1 text-sm text-gray-500"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              Use the search bar above to look for reviews.
            </motion.p>
          </motion.div>
        </AnimatePresence>
      );
    }

    if (shouldShowEmptyState()) {
      return (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-12 w-12 text-gray-400" />
          </div>
          {failuarePopupText ? (
            <>
              <h3 className="text-lg font-medium text-gray-900">
                {failuarePopupText}
              </h3>
              <button>
                Go to dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900">
                {searchTerm.trim() ? 'No results found' : (
                  activeTab === 'all' ? 'No reviews found' :
                    activeTab === 'my-reviews' ? 'You haven\'t written any reviews yet' :
                      'No items available for review'
                )}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm.trim() ? `No results for "${searchTerm}". Try different keywords.` : (
                  activeTab === 'all' ? 'Be the first to write a review!' :
                    activeTab === 'my-reviews' ? 'Start reviewing items you\'ve borrowed to share your thoughts.' :
                      'You can only review items you have borrowed. Start borrowing items to write reviews!'
                )}
              </p>
              {activeTab === 'write-review' && (
                <button
                  onClick={() => window.location.href = '/items'}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Book className="h-4 w-4 mr-2" />
                  Browse Items
                </button>
              )}
            </>
          )}
        </div>
      );
    }

    // Render the main content
    const dataSource = getDataSource();
    return viewMode === 'grid' ? renderGridView(dataSource) : renderListView(dataSource);
  };

  if (loading && !isSearching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        {user?.role?.toLowerCase() === 'user' ? (
          <p className="text-gray-600 mt-1">
            Read and write reviews for items you've borrowed
          </p>
        ) : user?.role?.toLowerCase() === 'librarian' || user?.role?.toLowerCase() === 'admin' ? (
          <p className="text-gray-600 mt-1">
            View and manage all user reviews for the items in the library
          </p>
        ) : (
          <p className="text-gray-600 mt-1">
            View reviews for items in the library
          </p>
        )}
      </div>

      {/* Tab Navigation */}
      {(user?.role.toLowerCase() === 'user') && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
          <div className="flex space-x-1">
            <button
              onClick={() => handleTabChange('all')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => handleTabChange('my-reviews')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'my-reviews'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              My Reviews
            </button>
            <button
              onClick={() => handleTabChange('write-review')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'write-review'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              Write Review
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder={
                activeTab === 'write-review'
                  ? "Search items you can review..."
                  : "Search reviews by title, author, or comment..."
              }
              value={searchTerm}
              onChange={handleSearchTermChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gradient-to-r from-blue-50 to-purple-50"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {/* Modern Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Anonymous Filter */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-full px-4 py-2 shadow-inner">
              <label className="flex items-center gap-1 cursor-pointer text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={anonymousOnly}
                  onChange={() => {
                    setAnonymousOnly((prev) => !prev);
                    if (!anonymousOnly && nonAnonymousOnly) setNonAnonymousOnly(false);
                  }}
                  className="accent-blue-500 h-4 w-4 rounded border-gray-300"
                />
                Anonymous Only
              </label>
              <label className="flex items-center gap-1 cursor-pointer text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={nonAnonymousOnly}
                  onChange={() => {
                    setNonAnonymousOnly((prev) => !prev);
                    if (!nonAnonymousOnly && anonymousOnly) setAnonymousOnly(false);
                  }}
                  className="accent-purple-500 h-4 w-4 rounded border-gray-300"
                />
                Not Anonymous
              </label>
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full px-4 py-2 shadow-inner">
              <span className="text-sm font-medium text-gray-700">Min Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="rounded-full border-0 bg-white px-2 py-1 text-gray-700 font-semibold focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all"
              >
                <option value={0}>Any</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r}+</option>
                ))}
              </select>
            </div>

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

            {/* Refresh Button */}
            <div>
              <button
                // onClick={fetchDataByQuery}
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

      {/* Main Content */}
      {renderContent()}

      {/* Load More Button */}
      {searchTerm.trim() && hasMoreResults && !isSearching && searchResults.length > 0 && (
        <div className="text-center">
          <button
            // onClick={loadMoreResults}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load More Results
          </button>
        </div>
      )}

      {/* Write Review Modal */}
      {showWriteReviewModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #eff6ff 0%, #fff 50%, #f3e8ff 100%)",
            backgroundColor: "rgba(255,255,255,0.40)",
            transition: "background 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)",
            animation: "fadeInBg 0.4s cubic-bezier(0.4,0,0.2,1)"
          }}
          aria-hidden="true"
        >
          <style>
            {`
              @keyframes fadeInBg {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes modalPopIn {
                0% {
                  opacity: 0;
                  transform: translateY(40px) scale(0.97);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
            `}
          </style>
          <div
            className="relative bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-full max-w-xl mx-4 border border-blue-100 min-h-[540px]"
            style={{
              animation: "modalPopIn 0.45s cubic-bezier(0.4,0,0.2,1)",
              minHeight: "540px",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {editingReview ? 'Edit Review' : 'Write Review'}
                </span>
              </h2>
              <button
                onClick={() => {
                  setShowWriteReviewModal(false);
                  setSelectedItemForReview(null);
                  setEditingReview(null);
                  setReviewForm({ reviewId: 0, rating: 5, comment: '', isAnonymous: false });
                  setShowModalAnonPopup(false);
                  setModalAnonPopupVisible(false);
                  setCommentError("");
                }}
                className="text-gray-400 hover:text-blue-500 transition-colors text-2xl font-bold"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {selectedItemForReview && (
              <div className="mb-7 p-5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl shadow-inner">
                <h3 className="font-semibold text-gray-900 text-lg">{selectedItemForReview.title}</h3>
                <p className="text-sm text-gray-600">{selectedItemForReview.author}</p>
              </div>
            )}

            <form
              className="space-y-8"
              onSubmit={e => {
                e.preventDefault();
                if (!reviewForm.comment.trim()) {
                  setCommentError('Don\'t forget to share your thoughts!');
                  return;
                }
                setCommentError("");
                const review = {
                  reviewId: reviewForm.reviewId,
                  rating: reviewForm.rating,
                  comment: reviewForm.comment,
                  isAnonymous: reviewForm.isAnonymous,
                  item: selectedItemForReview,
                  client: client,
                  isEnabled: true,
                };
                // editingReview ? handleUpdateReview(review) : handleSubmitReview();
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-3">
                  {renderStars(reviewForm.rating, true, (rating) =>
                    setReviewForm(prev => ({ ...prev, rating }))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => {
                    setReviewForm(prev => ({ ...prev, comment: e.target.value }));
                    if (commentError && e.target.value.trim()) setCommentError("");
                  }}
                  rows={6}
                  className={`w-full px-4 py-4 border ${commentError ? 'border-red-400' : 'border-blue-200'} rounded-xl bg-white/70 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm placeholder:text-gray-400`}
                  placeholder="Share your thoughts about this item..."
                  maxLength={500}
                />
                <div className="text-xs text-gray-400 text-right mt-1">{reviewForm.comment.length}/500</div>
                <AnimatePresence>
                  {commentError && (
                    <motion.div
                      key="comment-error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="mt-2 text-lg text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                    >
                      {commentError}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <ShinyButton
                  type="button"
                  className={`px-4 py-2 font-medium transition-colors ${!reviewForm.isAnonymous ? 'bg-gray-200 text-gray-700' : 'bg-blue-300 text-white hover:bg-blue-400'
                    } flex items-center gap-2`}
                  onClick={() => {
                    setReviewForm(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }));
                    setModalAnonPopupText(!reviewForm.isAnonymous ? "Your review will be anonymous" : "Your name will be shown");
                    setShowModalAnonPopup(true);
                  }}
                >
                  {!reviewForm.isAnonymous ? (
                    <span className="flex items-center whitespace-nowrap">
                      <EyeOff className="h-4 w-4 mr-1 shrink-0" />
                      Post review anonymously
                    </span>
                  ) : (
                    <span className="flex items-center whitespace-nowrap">
                      <User className="h-4 w-4 mr-1" />
                      Post review visible
                    </span>
                  )}
                </ShinyButton>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowWriteReviewModal(false);
                    setSelectedItemForReview(null);
                    setEditingReview(null);
                    setReviewForm({ reviewId: 0, rating: 5, comment: '', isAnonymous: false });
                    setCommentError("");
                  }}
                  className="flex-1 px-4 py-3 border border-blue-200 text-blue-700 rounded-xl bg-white/70 hover:bg-blue-50 transition-colors font-medium shadow"
                >
                  Cancel
                </button>
                <InteractiveHoverButton
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  {editingReview ? 'Update Review' : 'Submit Review'}
                </InteractiveHoverButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* All Popups */}
      {/* Bottom-right anonymous filter popup */}
      {showAnonPopup && (
        <div
          className={`fixed z-50 bottom-6 right-6 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2
            ${anonPopupVisible ? 'popup-fadein' : 'popup-fadeout'}`}
          style={{
            minWidth: 220,
            fontWeight: 600,
            fontSize: '1rem',
            pointerEvents: 'none',
            opacity: anonPopupVisible ? 1 : 0,
            transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
            background: 'linear-gradient(to right, #3b82f6, #a21caf)',
          }}
        >
          {!anonPopupText.toLowerCase().includes('non-anonymous') ? (
            <EyeOff className="h-5 w-5 text-white" />
          ) : (
            <Eye className="h-5 w-5 text-white" />
          )}
          <span>{anonPopupText}</span>
          <style>
            {`
              @media (max-width: 600px) {
                .fixed.bottom-6.right-6 { right: 1rem; bottom: 1rem; }
              }
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
            `}
          </style>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div
          className={`fixed z-50 bottom-6 right-6 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4
            ${deletePopupVisible ? 'popup-fadein' : 'popup-fadeout'}`}
          style={{
            minWidth: 280,
            fontWeight: 600,
            fontSize: '1rem',
            opacity: deletePopupVisible ? 1 : 0,
            pointerEvents: 'auto',
            transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
            background: 'linear-gradient(to right, #ef4444, #a21caf)',
          }}
        >
          <Trash2 className="h-5 w-5 text-white" />
          <span>Are you sure you want to delete this review?</span>
          <button
            // onClick={confirmDeleteReview}
            className="ml-2 px-4 py-2 rounded-lg bg-white text-red-600 font-bold hover:bg-red-100 transition"
            style={{ fontSize: '0.95rem' }}
          >
            Yes, Delete
          </button>
          <button
            onClick={cancelDeleteReview}
            className="ml-1 px-4 py-2 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-100 transition"
            style={{ fontSize: '0.95rem' }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div
          className={`fixed z-50 bottom-6 right-6 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3
            ${successPopupVisible ? 'popup-fadein' : 'popup-fadeout'}`}
          style={{
            minWidth: 220,
            fontWeight: 600,
            fontSize: '1rem',
            opacity: successPopupVisible ? 1 : 0,
            pointerEvents: 'none',
            transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
            background: 'linear-gradient(to right, #10b981, #3b82f6)',
          }}
        >
          <Star className="h-5 w-5 text-white" />
          <span>{successPopupText}</span>
        </div>
      )}

      {/* Error Popup */}
      {showFailuarePopup && (
        <div
          className={`fixed z-50 bottom-6 right-6 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3
            ${failuarePopupVisible ? 'popup-fadein' : 'popup-fadeout'}`}
          style={{
            minWidth: 220,
            fontWeight: 600,
            fontSize: '1rem',
            opacity: failuarePopupVisible ? 1 : 0,
            pointerEvents: 'none',
            transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
            background: 'linear-gradient(to right, #ff3333, #b30000)'
          }}
        >
          {/* <ExclamationTriangleIcon className="h-5 w-5 text-white" /> */}
          <span>{failuarePopupText}</span>
        </div>
      )}

      {/* Modal-specific anonymous popup */}
      {showModalAnonPopup && ReactDOM.createPortal(
        <div
          className={`fixed z-50 bottom-6 right-6 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2
            ${modalAnonPopupVisible ? 'popup-fadein' : 'popup-fadeout'}`}
          style={{
            minWidth: 220,
            fontWeight: 600,
            fontSize: '1rem',
            pointerEvents: 'none',
            opacity: modalAnonPopupVisible ? 1 : 0,
            transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
            background: 'linear-gradient(to right, #3b82f6, #a21caf)',
          }}
        >
          {!modalAnonPopupText.toLowerCase().includes('name will be shown') ? (
            <EyeOff className="h-5 w-5 text-white" />
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
          <span>{modalAnonPopupText}</span>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Reviews;