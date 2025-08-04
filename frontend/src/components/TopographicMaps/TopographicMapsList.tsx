import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Book, Search, Filter, Star, Eye, Heart, Grid, List, CheckCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { Item as BookType, ChatAPIResponse, Item, PaginatedItems } from '../../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ReactDOM from 'react-dom';
import { ShinyButton } from '../magicui/shiny-button';
import { InteractiveHoverButton } from '../magicui/interactive-hover-button';

// Define a type for chat messages
type ChatMessage = {
  type: 'client' | 'bot';
  text: string;
};

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const ItemList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const emptyPaginatedItems: PaginatedItems = {
    content: null,
    page: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    last: false,
    first: false,
    hasNext: false,
    hasPrevious: false
  }

  const params = new URLSearchParams(location.search);

  const initialSearch = params.get('search') || '';

  const [showTypeMessage, setShowTypeMessage] = useState(true);

  const [items, setItems] = useState<BookType[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // Further optimization can come from caching, to avoid duplicate fetches:
  const [resultsCache, setResultsCache] = useState<{ [key: string]: BookType[] }>({});

  // Use the new ChatMessage type
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Start with chat closed on mobile, open on desktop
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Add popup notification state
  const [showBorrowPopup, setShowBorrowPopup] = useState(false);
  const [borrowPopupVisible, setBorrowPopupVisible] = useState(false);
  const borrowPopupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add error popup state
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState('');
  const errorPopupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const genres = [...new Set(items.map(book => book.genre))];


  const [currentPage, setCurrentPage] = useState(0);

  const [paginatedItems, setPaginatedItems] = useState<PaginatedItems>(emptyPaginatedItems);

  // Responsive: close chat on mobile by default, open on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsChatOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    // On mount, set initial state
    if (window.innerWidth < 640) setIsChatOpen(false);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Popup effect for borrow notification
  useEffect(() => {
    if (showBorrowPopup) {
      setBorrowPopupVisible(true);
      if (borrowPopupTimeoutRef.current) clearTimeout(borrowPopupTimeoutRef.current);
      borrowPopupTimeoutRef.current = setTimeout(() => {
        setBorrowPopupVisible(false);
        setTimeout(() => setShowBorrowPopup(false), 350);
      }, 2500);
    }
    return () => {
      if (borrowPopupTimeoutRef.current) {
        clearTimeout(borrowPopupTimeoutRef.current);
        borrowPopupTimeoutRef.current = null;
      }
    };
  }, [showBorrowPopup]);

  // Error popup effect
  useEffect(() => {
    if (showErrorPopup) {
      if (errorPopupTimeoutRef.current) clearTimeout(errorPopupTimeoutRef.current);
      errorPopupTimeoutRef.current = setTimeout(() => setShowErrorPopup(false), 2500);
    }
    return () => {
      if (errorPopupTimeoutRef.current) {
        clearTimeout(errorPopupTimeoutRef.current);
        errorPopupTimeoutRef.current = null;
      }
    };
  }, [showErrorPopup]);

  const fetchItems = async () => {
    try {
      // fetchAllEnabledItems().then(data => {
      //   console.log('Fetched items:', data);
      //   const shuffled = data.sort(() => 0.5 - Math.random());
      //   const selected = shuffled.slice(0, 20);
      //   setItems(selected);
      // }).catch(error => {
      //   console.error('Error fetching books:', error);
      // });
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  function renderAvailability(status: string) {
    if (status.includes('pending'))
      return 'In pending ';
    else if (status.includes('available'))
      return 'Available';
    else if (status.includes('borrowed'))
      return 'Borrowed';
  }

  // Reset to first page when filters/search change
  // useEffect(() => {
  //   if (!searchTerm.trim()) {
  //     console.log('Resetting to first page due to search term change');
  //     setShowTypeMessage(true)
  //     setPaginatedItems(emptyPaginatedItems);
  //     setCurrentPage(0);
  //   } else {
  //     setShowTypeMessage(false);
  //     handleItemsRequests(searchTerm);
  //   }
  // }, [searchTerm, selectedGenre, showAvailableOnly, viewMode]);

  // In handleBorrowItem, show the popup on success
  // const handleBorrowItem = async (bookId: number) => {
  //   try {
  //     const itemToBorrow = items.find(book => book.id === bookId);
  //     const response = await sendBorrowRequest({
  //       itemTitle: itemToBorrow?.title || '',
  //       itemType: itemToBorrow?.itemType || '',
  //       authorName: itemToBorrow?.author || ''
  //     });

  //     if (response.status === 200) {
  //       console.log('Borrow request response:', response.data);

  //       // Removing the query from the cache to avoid showing the wrong status
  //       removeSearchQueryFromCache(searchTerm);

  //       // Always show the popup if no error is thrown
  //       setShowBorrowPopup(true);
  //       // Clear cache to force fresh fetch
  //       setResultsCache({});
  //       // Refresh the item list to update status
  //       fetchItems();
  //     } else
  //       throw new Error(response.data)
  //   } catch (error) {
  //     console.error('Failed to borrow item:', error);
  //     setErrorPopupMessage('Failed to borrow item. Please try again later.');
  //     setShowErrorPopup(true);
  //   }
  // };

  const handlePageChange = (newPage: number) => {
    console.log('Changing page to:', newPage);
    setCurrentPage(newPage);
  };

  // Fetch items when currentPage changes
  // useEffect(() => {
  //   if (searchTerm.trim() || selectedGenre || showAvailableOnly) {
  //     console.log('Current page changed, fetching items for query:', searchTerm);
  //     handleItemsRequests(searchTerm);
  //   }
  // }, [currentPage]);


  /**
   * Removes a specific search query and its results from the results cache.
   * This is useful when you want to invalidate cached results for a query,
   * for example after a borrow action that may change item availability.
   *
   * @param query - The search query string to remove from the cache.
   */
  const removeSearchQueryFromCache = (query: string) => {
    setResultsCache(prevCache => {
      const newCache = { ...prevCache };
      delete newCache[query];
      return newCache;
    });
  };

  // const handleItemsRequests = async (query: string) => {
  //   console.log('Handling items requests for query: \'', query, '\' \nCurrent Page:', currentPage);
  //   // setCurrentPage(0); // Only if you want to reset page on new search
  //   if (resultsCache[query]) {
  //     console.log('Using cached results for query:', query);
  //     setItems(resultsCache[query]);
  //     setLoading(false);
  //     return;
  //   }

  //   getAllEnabledItemsPaginatedByQuery(currentPage, query).then((response) => {
  //     console.log('Paginated items from request: ', response)
  //     console.log('UI Page: ', currentPage)
  //     console.log('Backend Page Number:', response.data.page);
  //     const {
  //       content,
  //       page,
  //       size,
  //       totalElements,
  //       totalPages,
  //       last,
  //       first,
  //       hasNext,
  //       hasPrevious
  //     } = response.data;

  //     setPaginatedItems(prevState => ({
  //       ...prevState,
  //       content,
  //       page,
  //       size,
  //       totalElements,
  //       totalPages,
  //       last,
  //       first,
  //       hasNext,
  //       hasPrevious
  //     }));


  //   }).catch(error => {
  //     console.error(error);
  //   })
  // }

  // Delay search execution by 500ms 
  // const debouncedSearch = useCallback(
  //   debounce((query: string) => {
  //     if (query.trim()) {
  //       handleItemsRequests(query);
  //     }
  //   }, 500), []
  // );

  // Update the URL when the search bar changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const newParams = new URLSearchParams(location.search);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    navigate({ search: newParams.toString() }, { replace: true });
    // Debounce API call
    // debouncedSearch(value);
  };

  // On initial mount, fetch items if search is present in URL (immediate)
  // useEffect(() => {
  //   // Only make the request if there is a search term (not empty/whitespace)
  //   if (initialSearch && initialSearch.trim()) {
  //     // handleItemsRequests(initialSearch);
  //   }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []); // Only run once on mount


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Bubble size and position
  const bubbleSize = 56;

  // Responsive chat: adjust position and size for mobile
  // Bubble button for closed state
  // Modern minimalist chat bubble, bottom right for visibility
  const ChatBubble = (
    <motion.button
      key="chat-bubble"
      initial={{ scale: 0.7, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 18 } }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 8px 32px 0 rgba(37, 99, 235, 0.18)",
        transition: { type: "tween", duration: 0.22, ease: [0.4, 0, 0.2, 1] }
      }}
      exit={{ scale: 0.7, opacity: 0, y: 40, transition: { duration: 0.18 } }}
      className="fixed z-50 flex items-center justify-center text-blue-600 shadow-xl rounded-full border border-blue-100 transition-all duration-200
        bottom-6 right-6 sm:bottom-8 sm:right-8"
      style={{
        width: bubbleSize,
        height: bubbleSize,
        cursor: 'pointer',
        boxShadow: "0 2px 16px 0 rgba(37, 99, 235, 0.10)",
        background: "linear-gradient(135deg, #f8fafc 10%, #bae6fd 50%, #a5b4fc 100%)"
      }}
      onClick={() => setIsChatOpen(true)}
      aria-label="Open chat"
    >
      <MessageSquare className="h-7 w-7" />
      <span className="sr-only">Open chat</span>
    </motion.button>
  );

  // Modern minimalist chat window, bottom right, floating above content
  const ChatWindow = (
    <motion.div
      key="chat-window"
      initial={{ scale: 0.92, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 22 } }}
      exit={{ scale: 0.92, opacity: 0, y: 40, transition: { duration: 0.18 } }}
      className={`
        fixed z-50 bg-white rounded-2xl shadow-2xl border border-blue-100 flex flex-col
        bottom-6 right-6 w-[95vw] max-w-[380px] h-[60vh] max-h-[420px]
        sm:bottom-8 sm:right-8 sm:w-96 sm:max-w-full sm:h-[380px]
      `}
      style={{
        boxShadow: "0 8px 32px 0 rgba(37, 99, 235, 0.13)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="relative bg-white border-b border-blue-100 rounded-t-2xl px-5 py-3 flex items-center justify-between">
        <span className="text-blue-700 font-semibold text-base tracking-wide">Librarian Chat</span>
        <button
          onClick={() => setIsChatOpen(false)}
          className="text-blue-400 hover:text-blue-700 rounded-full p-1 transition"
          aria-label="Close chat"
          style={{ lineHeight: 0 }}
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-sm"
        style={{
          background: "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 60%, #bae6fd 90%, #a5b4fc 100%)"
        }}
      >
        {chatMessages.length === 0 && (
          <div className="text-gray-400 italic text-center pt-8">No messages yet. Start typing below!</div>
        )}
        <AnimatePresence initial={false}>
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={
                "flex w-full " +
                (msg.type === 'client' ? "justify-end" : "justify-start")
              }
            >
              <motion.div
                initial={{
                  opacity: 0,
                  x: msg.type === 'client' ? 40 : -40,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { type: 'spring', stiffness: 400, damping: 30 }
                }}
                exit={{ opacity: 0, x: msg.type === 'client' ? 40 : -40 }}
                className={
                  `rounded-xl px-4 py-2 max-w-[80%] break-words mb-1 shadow-sm ` +
                  (msg.type === 'client'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800')
                }
                style={{
                  whiteSpace: 'pre-wrap',
                  fontSize: '1rem',
                  borderBottomLeftRadius: msg.type === 'client' ? '1rem' : '0.5rem',
                  borderBottomRightRadius: msg.type === 'client' ? '0.5rem' : '1rem',
                }}
              >
                {/* <ReactMarkdown>{msg.text}</ReactMarkdown> */}
              </motion.div>
            </div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <div
        className="border-t border-blue-100 px-3 py-2 flex items-center space-x-2"
        style={{
          background: "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 60%, #bae6fd 90%, #a5b4fc 100%)"
        }}
      >
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          // onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-grow border-0 bg-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base placeholder:text-gray-400"
          style={{ fontSize: '1rem' }}

        />
        <button
          // onClick={handleSendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-base font-medium shadow-sm"
          aria-label="Send message"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Item Catalog</h1>
        <p className="text-gray-600 mt-1">Browse and discover items in our collection</p>
      </div>

      {/* More info here: https://expertbeacon.com/how-to-add-high-performance-search-functionality-to-a-frontend-app/ */}
      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Modern Search Input */}
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search items by title or author..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gradient-to-r from-blue-50 to-purple-50"
            />
            {/* Modern toggle for available only */}
            <span className="ml-4">
              <ShinyButton
                onClick={() => setShowAvailableOnly((prev) => !prev)}
                className={`flex items-center px-3 py-2 rounded-lg border-0 bg-gradient-to-r from-blue-200 to-purple-200 text-gray-700 font-medium shadow-inner transition-colors
                  ${showAvailableOnly
                    ? 'ring-2 ring-blue-400 bg-gradient-to-r from-blue-300 to-purple-300 text-blue-900 font-semibold scale-105'
                    : 'hover:bg-blue-200'
                  }`}
                aria-pressed={showAvailableOnly}
                title="Show available only"
                style={{
                  boxShadow: "0 2px 8px 0 rgba(80, 80, 255, 0.07)",
                }}
              >
                <span>Available only</span>
              </ShinyButton>
            </span>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex border border-gray-200 rounded-full overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 shadow-inner">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-100'}`}
                title="Grid View"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-100'}`}
                title="List View"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
            {/* Refresh Button with shimmer and magicui hover */}
            <div>
              <button
                type="button"
                onClick={fetchItems}
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

      {!searchTerm.trim() && items.length === 0 && showTypeMessage ? (
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
              Start typing to find your desired item
            </motion.h3>
            <motion.p
              className="mt-1 text-sm text-gray-500"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              Use the search bar above to look for books, magazines, or DVDs.
            </motion.p>
          </motion.div>
        </AnimatePresence>
      ) : (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.content && paginatedItems.content.length > 0 ? (
              paginatedItems.content.map((item: any) => (
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
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500">{item.genre}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs text-gray-500">Published Year: {item.yearPublished}</span>
                        </div>
                        <div className="mt-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {renderAvailability(item.availabilityStatus)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                          <Heart className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                      {/* Only show borrow button if available */}
                      {item.available && (
                        <InteractiveHoverButton
                          // onClick={() => handleBorrowItem(item.id)}
                          className="px-6 py-2 bg-blue-600 text-white text-base rounded-lg hover:bg-blue-500 hover:shadow-lg transition-colors"
                        >
                          Borrow
                        </InteractiveHoverButton>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              null
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="divide-y divide-gray-100">
              {paginatedItems.content && paginatedItems.content.length > 0 ? (
                paginatedItems.content.map((item: any) => (
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
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500">{item.genre}</span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-xs text-gray-500">Published Year: {item.yearPublished}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}>
                              {item.available
                                ? `Available`
                                : 'Borrowed'
                              }
                            </span>
                            {/* Only show borrow button if available */}
                            {item.available && (
                              <InteractiveHoverButton
                                // onClick={() => handleBorrowItem(item.id)}
                                className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Borrow
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
                ))
              ) : (
                <div>No items found.</div>
              )}
            </div>
          </div>
        )
      )}

      <AnimatePresence>
        {searchTerm.trim() && paginatedItems.content?.length === 0 && !loading && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Book className="h-12 w-12 text-gray-400" />
            </motion.div>
            <motion.h3
              className="text-lg font-medium text-gray-900"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              No books found
            </motion.h3>
            <motion.p
              className="mt-1 text-sm text-gray-500"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              Try adjusting your search terms or filters.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination Controls */}
      {paginatedItems.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            type="button"
            // variant="outline"
            onClick={() => {
              handlePageChange(currentPage - 1);
            }}
            disabled={currentPage === 0}
            className="px-4"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage + 1} of {paginatedItems.totalPages}
          </span>
          <button
            type="button"
            // variant="outline"
            onClick={() => {
              handlePageChange(currentPage + 1);
            }}
            disabled={currentPage === paginatedItems.totalPages - 1}
            className="px-4"
          >
            Next
          </button>
        </div>
      )}

      {/* Chat Window Container */}
      {/* Chat Widget with open/close and smooth animation */}
      <AnimatePresence initial={false} mode="wait">
        {isChatOpen ? ChatWindow : ChatBubble}
      </AnimatePresence>

      {/* Render the popup notification using a portal */}
      {showBorrowPopup && ReactDOM.createPortal(
        <div
          className={`fixed z-50 bottom-6 right-6 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2
            ${borrowPopupVisible ? 'popup-fadein' : 'popup-fadeout'}`}
          style={{
            minWidth: 220,
            fontWeight: 600,
            fontSize: '1rem',
            pointerEvents: 'none',
            opacity: borrowPopupVisible ? 1 : 0,
            transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
            background: 'linear-gradient(to right, #ec4899, #a21caf)',
          }}
        >
          <CheckCircle className="h-5 w-5 text-white" />
          <span>Borrow request sent successfully!</span>
          <style>{`
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
          `}</style>
        </div>,
        document.body
      )}

      {/* Render the error popup notification using a portal */}
      {showErrorPopup && ReactDOM.createPortal(
        <div
          className={`fixed z-50 bottom-6 right-6 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 popup-fadein`}
          style={{
            minWidth: 220,
            fontWeight: 600,
            fontSize: '1rem',
            pointerEvents: 'none',
            opacity: 1,
            transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
            background: 'linear-gradient(to right, #ef4444, #a21caf)', // red to violet
          }}
        >
          <span>{errorPopupMessage}</span>
          <style>{`
            .popup-fadein {
              animation: fadeinpop 0.3s cubic-bezier(0.4,0,0.2,1);
            }
            @keyframes fadeinpop {
              from { opacity: 0; transform: translateY(30px) scale(0.97);}
              to { opacity: 1; transform: translateY(0) scale(1);}
            }
            @media (max-width: 600px) {
              .fixed.bottom-6.right-6 { right: 1rem; bottom: 1rem; }
            }
          `}</style>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ItemList;
