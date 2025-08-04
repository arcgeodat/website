import React, { useEffect, useState, useMemo } from 'react';
import {
  Book,
  Search,
  RefreshCw,
  User,
  Calendar,
  ArrowRight,
  CheckCircle2,
  XCircle,
  CalendarIcon,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Borrow, BorrowAction, RequestResponse } from '@/types';
import { ShinyButton } from '../magicui/shiny-button';
import { AnimatePresence, motion } from 'framer-motion';
import ReactDOM from 'react-dom';

const RequestInfoCard = ({
  req,
  accentColor,
  icon,
  type,
  onBorrowApprove,
  onReturnApprove,
  onBorrowDecline,
  onReturnDecline,
  onMoreInfo,
}: {
  req: Borrow;
  accentColor: string;
  icon: React.ReactNode;
  type: 'borrow_requested' | 'return_requested';
  onBorrowApprove?: (approveBorrowResponse: RequestResponse) => void;
  onReturnApprove?: (approveReturnResponse: RequestResponse) => void;
  onBorrowDecline?: (declineBorrowResponse: RequestResponse) => void;
  onReturnDecline?: (declineReturnResponse: RequestResponse) => void;
  onMoreInfo?: (clientId: string) => void;
}) => (
  <div
    className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-gradient-to-r from-white to-blue-50 border border-gray-100 rounded-xl shadow-sm p-5 transition hover:shadow-lg"
    style={{ marginBottom: 12 }}
  >
    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
      {icon}
    </div>
    <div className="flex-1 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg" style={{ color: accentColor }}>
              {req.item?.title || 'Untitled'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
            <span>
              <b>Author:</b> {req.item?.author || 'Unknown Author'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs">
            <User className="h-4 w-4" />
            <span>Borrowed by: {req.client?.name || 'Unknown User'}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
            <Calendar className="h-4 w-4" />
            {/* To print the request object here for debugging, use: */}
            {/* {process.env.NODE_ENV === 'development' && (
              <pre style={{ fontSize: '10px', color: '#888', margin: 0 }}>
                {JSON.stringify(req, null, 2)}
              </pre>
            )} */}
            <span>
              {type === 'return_requested'
                ? `Borrowed on: ${req.borrowDate ? new Date(req.borrowDate).toLocaleDateString() : 'N/A'}`
                : `Requested on: ${req.returnDate ? new Date(req.actionDate).toLocaleDateString() : 'N/A'}`}
            </span>
          </div>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0 items-center">
          {req.client?.clientId && (
            <ShinyButton
              className="ml-2 px-4 py-1 text-[10px] bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              onClick={() => onMoreInfo && onMoreInfo(String(req.client.clientId))}
              type="button"
            >
              More Info
            </ShinyButton>
          )}
          <Button
            variant="outline"
            size="icon"
            className="bg-green-100 hover:bg-green-200 text-green-700 border-green-200 hover:text-green-900 rounded-full shadow transition-all duration-150"
            onClick={() => {
              const response: RequestResponse = {
                item: req.item,
                client: req.client,
                responseReason: { reason: "Reason for approval" }
              };
              type === 'borrow_requested' ? onBorrowApprove?.(response) : onReturnApprove?.(response);
            }}
            aria-label="Approve"
          >
            <CheckCircle2 className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-red-100 hover:bg-red-200 text-red-700 border-red-200 hover:text-red-900 rounded-full shadow transition-all duration-150"
            onClick={() => {
              const response: RequestResponse = {
                item: req.item,
                client: req.client,
                responseReason: { reason: "Reason for approval" }
              };
              type === 'borrow_requested' ? onBorrowDecline?.(response) : onReturnDecline?.(response);
            }}
            aria-label="Decline"
          >
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  </div>
);

const ApprovalManagement: React.FC = () => {
  const [requests, setRequests] = useState<Borrow[]>([]);
  const [tab, setTab] = useState<'borrow' | 'return' | 'all'>('all');
  const [borrowsOnly, setBorrowsOnly] = useState(false);
  const [returnsOnly, setReturnsOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Borrow | null>(null);
  const [showItemInfo, setShowItemInfo] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(0);

  const [itemHistory, setItemHistory] = useState<BorrowAction[]>([]);
  const [clientHistory, setClientHistory] = useState<BorrowAction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'client' | 'admin', text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [typeNote, setTypeNote] = useState('');

  // Add popup notification state
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [actionPopupText, setActionPopupText] = useState('');
  const [actionPopupVisible, setActionPopupVisible] = useState(false);
  const actionPopupTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const ITEMS_PER_PAGE = 3;
  const [borrowPage, setBorrowPage] = useState(1);
  const [returnPage, setReturnPage] = useState(1);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   setError(null); // Reset error before fetching
  //   try {
  //     const res = await getAllBorrows();
  //     setRequests(res as Borrow[]);
  //   } catch (err: any) {
  //     // You can customize this message as needed
  //     setError(
  //       err?.message?.includes('Network Error') || err?.code === 'ERR_NETWORK'  || err?.code === 'ERR_CONNECTION_REFUSED'
  //         ? 'Could not connect to the server. Please check your connection or try again later.'
  //         : err?.message || 'An error occurred while fetching requests.'
  //     );
  //   }
  // };

  // Filter by search and tab
  const filteredRequests = useMemo(() => {
    let filtered = requests;
    if (searchTerm.trim()) {
      const s = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.client?.name?.toLowerCase().includes(s) ||
          r.client?.email?.toLowerCase().includes(s) ||
          r.item?.title?.toLowerCase().includes(s)
      );
    }
    return filtered;
  }, [requests, searchTerm, tab]);

  const borrowRequests = filteredRequests.filter((r) => r.status === 'borrow_requested');
  const returnRequests = filteredRequests.filter((r) => r.status === 'return_requested');

  // Calculate paginated requests
  const paginatedBorrowRequests = borrowRequests.slice((borrowPage - 1) * ITEMS_PER_PAGE, borrowPage * ITEMS_PER_PAGE);
  const borrowTotalPages = Math.ceil(borrowRequests.length / ITEMS_PER_PAGE);
  const paginatedReturnRequests = returnRequests.slice((returnPage - 1) * ITEMS_PER_PAGE, returnPage * ITEMS_PER_PAGE);
  const returnTotalPages = Math.ceil(returnRequests.length / ITEMS_PER_PAGE);

  // Reset to first page when filters/search/tab change
  useEffect(() => {
    setBorrowPage(1);
    setReturnPage(1);
  }, [searchTerm, tab, filteredRequests.length]);

  // Determine which cards to show based on tab
  const showBorrowCard = tab === 'all' || tab === 'borrow';
  const showReturnCard = tab === 'all' || tab === 'return';

  // Check if there are no requests at all (after filtering)
  const noRequests =
    borrowRequests.length === 0 && returnRequests.length === 0;

  // 1. Handler for approve
  // const handleBorrowApprove = async (approveBorrowResponse: RequestResponse) => {
  //   approveBorrowRequest(approveBorrowResponse)
  //     .then((response) => {
  //       setActionPopupText('Borrow request approved!');
  //       setShowActionPopup(true);
  //       fetchData();
  //     })
  //     .catch((error) => {
  //       setActionPopupText('Failed to approve borrow request.');
  //       setShowActionPopup(true);
  //       console.error('Error approving borrow request:', error);
  //     });
  // };

  // const handleBorrowDecline = async (declineBorrowResponse: RequestResponse) => {
  //   declineBorrowRequest(declineBorrowResponse)
  //     .then((response) => {
  //       setActionPopupText('Borrow request declined!');
  //       setShowActionPopup(true);
  //       fetchData();
  //     })
  //     .catch((error) => {
  //       setActionPopupText('Failed to decline borrow request.');
  //       setShowActionPopup(true);
  //       console.error('Error declining borrow request:', error);
  //     });
  // };

  // const handleReturnApprove = async (approveReturnResponse: RequestResponse) => {
  //   approveReturnRequest(approveReturnResponse)
  //     .then((response) => {
  //       setActionPopupText('Return request approved!');
  //       setShowActionPopup(true);
  //       fetchData();
  //     })
  //     .catch((error) => {
  //       setActionPopupText('Failed to approve return request.');
  //       setShowActionPopup(true);
  //       console.error('Error approving return request:', error);
  //     });
  // };

  // const handleReturnDecline = async (declineReturnResponse: RequestResponse) => {
  //   declineReturnRequest(declineReturnResponse)
  //     .then((response) => {
  //       setActionPopupText('Return request declined!');
  //       setShowActionPopup(true);
  //       fetchData();
  //     })
  //     .catch((error) => {
  //       setActionPopupText('Failed to decline return request.');
  //       setShowActionPopup(true);
  //       console.error('Error declining return request:', error);
  //     });
  // };

  // const handleMoreInfo = async (clientId: string, request?: Borrow) => {
  //   setShowClientModal(true);
  //   setSelectedRequest(request || null);
  //   setShowItemInfo(false);

  //   fetchRatingForItem(request?.item?.id as number).then((res: number) => {
  //     setAverageRating(res);
  //   });

  //   // Optionally, show loading state here
  //   const history = await fetchBorrowHistory();
  //   const clientHistory = history.filter((h: any) => String(h.client?.clientId) === clientId);
  //   setClientHistory(clientHistory);
  //   const itemHistory = history.filter((h: any) => String(h.item?.id) === String(request?.item?.id));
  //   setItemHistory(itemHistory);
  // };


  // When switching to Item Info, fetch item history if not already loaded
  // useEffect(() => {
  //   const fetchItemHistoryIfNeeded = async () => {
  //     if (
  //       showClientModal &&
  //       showItemInfo &&
  //       selectedRequest?.item?.id &&
  //       itemHistory.length === 0
  //     ) {
  //       const itemHist = await fetchBorrowHistory();
  //       setItemHistory(itemHist);
  //     }
  //   };
  //   fetchItemHistoryIfNeeded();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [showItemInfo, showClientModal, selectedRequest]);

  // Handler for type selection
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setShowTypeSelector(false);
    // You can add logic here to filter or fetch items of this type
  };

  // Handler for sending a chat message
  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages(prev => [...prev, { sender: 'client', text: chatInput.trim() }]);
      setChatInput(''); // Clear input after sending
    }
  };

  // Popup effect for action notification
  useEffect(() => {
    if (showActionPopup) {
      setActionPopupVisible(true);
      if (actionPopupTimeoutRef.current) clearTimeout(actionPopupTimeoutRef.current);
      actionPopupTimeoutRef.current = setTimeout(() => {
        setActionPopupVisible(false);
        setTimeout(() => setShowActionPopup(false), 350);
      }, 2500);
    }
    return () => {
      if (actionPopupTimeoutRef.current) {
        clearTimeout(actionPopupTimeoutRef.current);
        actionPopupTimeoutRef.current = null;
      }
    };
  }, [showActionPopup]);

  return (
    <div className="max-w-7xl mx-auto px-16 py-5">
      {/* Type Selector Popup */}
      {showTypeSelector && (
        <div className="fixed bottom-24 left-8 z-50 bg-white rounded-xl shadow-2xl p-6 border border-blue-100 flex flex-col gap-4 animate-pop-in-type w-64">
          <h3 className="text-lg font-bold text-blue-700 mb-2">What type of item do you want to choose?</h3>
          <button
            className="w-full py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
            onClick={() => handleTypeSelect('Book')}
          >
            Book
          </button>
          <button
            className="w-full py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition"
            onClick={() => handleTypeSelect('Magazine')}
          >
            Magazine
          </button>
          <button
            className="w-full py-2 rounded-lg bg-pink-100 text-pink-700 font-semibold hover:bg-pink-200 transition"
            onClick={() => handleTypeSelect('DVD')}
          >
            DVD
          </button>
          <button
            className="mt-2 text-xs text-gray-400 hover:text-gray-700 underline"
            onClick={() => setShowTypeSelector(false)}
          >
            Cancel
          </button>
          <style>{`
            .animate-pop-in-type {
              animation: popInTypeAnim 0.22s cubic-bezier(0.4,0,0.2,1);
            }
            @keyframes popInTypeAnim {
              0% { opacity: 0; transform: translateY(32px) scale(0.96); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
        </div>
      )}
      {/* Header */}
      <div className="mb-5">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl px-9 py-10 text-white flex flex-col gap-4 shadow-lg">
          <div className="flex items-center gap-4">
            <Book className="h-10 w-10 text-white drop-shadow" />
            <div>
              <h1 className="text-3xl font-bold mb-1">Approval Management</h1>
              <p className="text-blue-100 text-lg">Review and manage borrow and return requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* If there is an error, show ONLY the error message */}
      {error ? (
        <div className="mb-6">
          <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-xl shadow flex items-center gap-3">
            <XCircle className="h-6 w-6 text-red-400" />
            <span>{error}</span>
          </div>
        </div>
      ) : noRequests ? (
        // If no error and no requests, show "All caught up"
        <div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl shadow-md py-20 px-8 mt-12">
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-4"
          >
            <circle cx="28" cy="28" r="28" fill="#EEF2FF" />
            <path
              d="M18 29.5L25 36.5L38 23.5"
              stroke="#6366F1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-2xl font-bold text-blue-700 mb-2">
            All caught up!
          </div>
          <div className="text-gray-500 text-base">
            There are no pending borrow or return requests at the moment.
          </div>
        </div>
      ) : (
        <>
          {/* Only show filters/search if there are requests */}
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or book title..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gradient-to-r from-blue-50 to-purple-50"
                />
              </div>
              {/* Modern Filters */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Borrow/Return Only Filters */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-full px-4 py-2 shadow-inner">
                  <label className="flex items-center gap-1 cursor-pointer text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={borrowsOnly}
                      onChange={() => {
                        if (borrowsOnly) {
                          setBorrowsOnly(false);
                          setReturnsOnly(false);
                          setTab('all');
                        } else {
                          setBorrowsOnly(true);
                          setReturnsOnly(false);
                          setTab('borrow');
                        }
                      }}
                      className="accent-blue-500 h-4 w-4 rounded border-gray-300"
                    />
                    Borrows Only
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={returnsOnly}
                      onChange={() => {
                        if (returnsOnly) {
                          setReturnsOnly(false);
                          setBorrowsOnly(false);
                          setTab('all');
                        } else {
                          setReturnsOnly(true);
                          setBorrowsOnly(false);
                          setTab('return');
                        }
                      }}
                      className="accent-purple-500 h-4 w-4 rounded border-gray-300"
                    />
                    Returns Only
                  </label>
                </div>
                {/* Refresh Button */}
                <div>
                  <Button
                    // onClick={fetchData}
                    className="!px-4 !py-2 !rounded-full !bg-gradient-to-r from-blue-500 to-purple-500 !text-white !font-semibold !shadow-lg relative group transition-transform duration-200 hover:scale-90"
                    title="Refresh"
                  >
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-pulse" />
                      <span className="hidden sm:inline">Refresh</span>
                    </span>
                    {/* Shimmer effect */}
                    <span className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
                      <span className="block w-full h-full shimmer-bg" />
                    </span>
                  </Button>
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

          {/* Client & Item History Popup (bottom right) */}
          {showClientModal && (
            <div className="fixed z-50 bottom-8 right-8 max-w-sm w-full">
              <div className="bg-gradient-to-br from-white via-blue-50 to-purple-100 rounded-2xl shadow-2xl p-5 relative border border-blue-200 animate-pop-in-modern backdrop-blur-md flex flex-col gap-4">
                {/* Sleek Close Button */}
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-purple-600 transition-colors duration-150 text-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-full"
                  onClick={() => setShowClientModal(false)}
                  aria-label="Close"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>
                {/* Switch between Client and Item */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <button
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${!showItemInfo ? 'bg-blue-500 text-white shadow' : 'bg-white text-blue-700 border border-blue-200'
                      }`}
                    onClick={() => setShowItemInfo(false)}
                  >
                    Client History
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${showItemInfo ? 'bg-purple-500 text-white shadow' : 'bg-white text-purple-700 border border-purple-200'
                      }`}
                    onClick={() => setShowItemInfo(true)}
                  >
                    Item Info
                  </button>
                </div>
                {/* Content */}
                {!showItemInfo ? (
                  // Client History Section
                  <div>
                    <h2 className="text-lg font-extrabold mb-4 text-blue-900 flex items-center gap-2">
                      <span className="inline-block bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full px-3 py-1 text-xs font-semibold shadow-sm">
                        {selectedRequest?.client?.name}
                      </span>
                      <span className="text-base font-medium text-gray-500">Borrow History</span>
                    </h2>
                    <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                      {clientHistory.length === 0 ? (
                        <div className="text-gray-400 text-center py-8">
                          <svg className="mx-auto mb-2 h-8 w-8 text-blue-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" />
                            <path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 1 5 0" stroke="currentColor" strokeLinecap="round" />
                          </svg>
                          No history found.
                        </div>
                      ) : (
                        clientHistory.map((action, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col gap-1 bg-white/70 hover:bg-blue-50 transition rounded-lg px-3 py-2 border border-transparent hover:border-blue-200 shadow-sm"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-blue-800 truncate">{action.item.title}</span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-bold tracking-wide ml-2
                                  ${action.status === 'return_accepted'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700'}
                                `}
                              >
                                {action.status}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 italic">by {action.item.author}</span>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                              <CalendarIcon className="h-4 w-4 text-blue-300" />
                              <span>Action Date:</span>
                              <span className="text-gray-700">{action.actionDate ? new Date(action.actionDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                              <svg className="h-4 w-4 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {action.statusReason !== 'No reason provided' ? (
                                <span className="text-gray-500">Reason: {action.statusReason}</span>
                              ) : (
                                <span className="text-gray-500">No reason provided</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  // Item Info & Item History Section
                  selectedRequest && selectedRequest.item && (
                    <div>
                      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-100 via-purple-50 to-white border border-blue-200 shadow-inner mb-4">
                        <div className="font-bold text-blue-900 text-base mb-1 flex items-center gap-2">
                          <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12V4" />
                          </svg>
                          {selectedRequest.item.title}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">by {selectedRequest.item.author}</div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                          <span className="bg-blue-50 px-2 py-0.5 rounded-full">Info: {selectedRequest.item.description || 'N/A'}</span>
                          <span className="text-gray-300">|</span>
                          <span className="bg-purple-50 px-2 py-0.5 rounded-full">
                            Last borrowed: {selectedRequest.borrowDate ? new Date(selectedRequest.borrowDate).toLocaleDateString() : 'N/A'}
                          </span>
                          <span className="bg-purple-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            {averageRating === 0 ? (
                              "There aren't any ratings"
                            ) : (
                              <>
                                Rating: {averageRating}
                                <span className="flex items-center ml-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className={`h-4 w-4 ${averageRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                      fill={averageRating >= star ? 'currentColor' : 'none'}
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      viewBox="0 0 24 24"
                                    >
                                      <polygon
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points="12 17.27 18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27"
                                      />
                                    </svg>
                                  ))}
                                </span>
                              </>
                            )}

                          </span>
                        </div>
                      </div>

                      {/* Item Borrow History */}
                      <div>
                        <h3 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-1">
                          <svg className="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7" />
                            <rect width="20" height="12" x="2" y="7" rx="2" />
                          </svg>
                          Item Borrow History
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                          {itemHistory && itemHistory.length > 0 ? (
                            itemHistory.map((action: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex flex-col gap-0.5 bg-white/60 hover:bg-purple-50 transition rounded-lg px-3 py-1.5 border border-transparent hover:border-purple-200 shadow-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                      <CalendarIcon className="h-4 w-4 text-purple-300" />
                                      <span className="font-medium text-gray-500">Date:</span>
                                      <span className="text-gray-700">{action.actionDate ? new Date(action.actionDate).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                  </div>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-bold tracking-wide ml-auto
                                      ${action.status === 'return_accepted'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-blue-100 text-blue-700'}
                                    `}
                                  >
                                    {action.status === 'borrow_accepted'
                                      ? 'Borrowed'
                                      : action.status === 'borrow_declined'
                                        ? 'Borrow Declined'
                                        : action.status === 'return_accepted'
                                          ? 'Returned'
                                          : action.status === 'return_declined'
                                            ? 'Return Declined'
                                            : action.status}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 mt-0.5 gap-2">
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-500">Client:</span>
                                    <span className="text-gray-700">{action.client.name}</span>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-400 text-center py-6">
                              <svg className="mx-auto mb-2 h-7 w-7 text-purple-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" />
                                <path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 1 5 0" stroke="currentColor" strokeLinecap="round" />
                              </svg>
                              No item history found.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
              <style>{`
                .animate-pop-in-modern {
                  animation: popInAnimModern 0.22s cubic-bezier(0.4,0,0.2,1);
                }
                @keyframes popInAnimModern {
                  0% { opacity: 0; transform: translateY(32px) scale(0.96); }
                  100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 100%);
                  border-radius: 6px;
                }
                .custom-scrollbar {
                  scrollbar-width: thin;
                  scrollbar-color: #a5b4fc #f3f4f6;
                }
              `}</style>
            </div>
          )}

          {/* Main Content */}
          <AnimatePresence mode="wait">
            <div
              key={tab} // This ensures a new animation when tab changes
              className={`grid gap-8 ${showBorrowCard && showReturnCard ? 'md:grid-cols-2' : 'grid-cols-1'}`}
            >
              {/* Borrow Requests */}
              {showBorrowCard && (
                <motion.div
                  key="borrow"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  {borrowRequests.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 flex flex-col">
                      <div className="flex items-center gap-3 mb-6">
                        <Book className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-blue-900">Borrow Requests</h2>
                        <span className="ml-2 text-xs text-blue-400 font-medium">
                          {borrowRequests.length} pending
                        </span>
                      </div>
                      <div className="flex flex-col gap-4">
                        {paginatedBorrowRequests.map((req: Borrow) => (
                          <RequestInfoCard
                            key={req.requestId}
                            req={req}
                            type="borrow_requested"
                            accentColor="#2563eb"
                            icon={<ArrowRight className="h-7 w-7 text-blue-500" />}
                          // onBorrowApprove={handleBorrowApprove}
                          // onBorrowDecline={handleBorrowDecline}
                          // onMoreInfo={() => handleMoreInfo(String(req.client.clientId), req)}
                          />
                        ))}
                      </div>
                      {/* Pagination Controls for Borrow Requests */}
                      {borrowTotalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setBorrowPage((p) => Math.max(1, p - 1))}
                            disabled={borrowPage === 1}
                            className="px-4"
                          >
                            Previous
                          </Button>
                          <span className="text-gray-700 font-medium">
                            Page {borrowPage} of {borrowTotalPages}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setBorrowPage((p) => Math.min(borrowTotalPages, p + 1))}
                            disabled={borrowPage === borrowTotalPages}
                            className="px-4"
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 flex flex-col items-center justify-center min-h-[200px]">
                      <Book className="h-8 w-8 text-blue-300 mb-2" />
                      <div className="text-lg font-semibold text-blue-700 mb-1">No borrow requests found.</div>
                      <div className="text-gray-400 text-sm">There are currently no pending borrow requests.</div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Return Requests */}
              {showReturnCard && (
                <motion.div
                  key="return"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  {returnRequests.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-6 flex flex-col">
                      <div className="flex items-center gap-3 mb-6">
                        <Book className="h-6 w-6 text-purple-600" />
                        <h2 className="text-xl font-semibold text-purple-900">Return Requests</h2>
                        <span className="ml-2 text-xs text-purple-400 font-medium">
                          {returnRequests.length} pending
                        </span>
                      </div>
                      <div className="flex flex-col gap-4">
                        {paginatedReturnRequests.map((req: Borrow) => (
                          <RequestInfoCard
                            key={req.requestId}
                            req={req}
                            type="return_requested"
                            accentColor="#7c3aed"
                            icon={<ArrowRight className="h-7 w-7 text-purple-500" />}
                          // onReturnApprove={handleReturnApprove}
                          // onReturnDecline={handleReturnDecline}
                          // onMoreInfo={() => handleMoreInfo(String(req.client.clientId), req)}
                          />
                        ))}
                      </div>
                      {/* Pagination Controls for Return Requests */}
                      {returnTotalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setReturnPage((p) => Math.max(1, p - 1))}
                            disabled={returnPage === 1}
                            className="px-4"
                          >
                            Previous
                          </Button>
                          <span className="text-gray-700 font-medium">
                            Page {returnPage} of {returnTotalPages}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setReturnPage((p) => Math.min(returnTotalPages, p + 1))}
                            disabled={returnPage === returnTotalPages}
                            className="px-4"
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-6 flex flex-col items-center justify-center min-h-[200px]">
                      <Book className="h-8 w-8 text-purple-300 mb-2" />
                      <div className="text-lg font-semibold text-purple-700 mb-1">No return requests found.</div>
                      <div className="text-gray-400 text-sm">There are currently no pending return requests.</div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </>
      )}
      {showActionPopup && ReactDOM.createPortal(
        <div
          className={`fixed z-50 bottom-6 right-6 text-blue-800 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2
            ${actionPopupVisible ? 'popup-fadein' : 'popup-fadeout'}`}
          style={{
            minWidth: 220,
            fontWeight: 600,
            fontSize: '1rem',
            pointerEvents: 'none',
            opacity: actionPopupVisible ? 1 : 0,
            transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
            background: 'linear-gradient(90deg, #e0e7ff 0%, #f3e8ff 100%)',
            border: '1.5px solid #a5b4fc',
            boxShadow: '0 4px 24px 0 rgba(99,102,241,0.10), 0 1.5px 4px 0 rgba(168,85,247,0.08)',
          }}
        >
          <CheckCircle2 className="h-5 w-5 text-blue-500" />
          <span>{actionPopupText}</span>
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
    </div>
  );
};

export default ApprovalManagement;