import React, { useState, useEffect } from 'react';
import { Book, BookOpen, Users, Clock, Plus, ArrowRight, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Item as BookType, BorrowedBook, DaySummary, Item, Review } from '../../types/index.ts';
import { useNavigate } from 'react-router-dom';
import { stat } from 'fs';

const LibrarianDashboard: React.FC = () => {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalItems: 0,
    borrowedItems: 0,
    activeClients: 0,
    overdueItems: 0,
    borrowRequests: 0,
    returnRequests: 0,
  });
  const [todayStats, setTodayStats] = useState({
    itemsBorrowed: 0,
    itemsReturned: 0,
    itemsAdded: 0
  })
  const [items, setItems] = useState<Item[]>([]);
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [recentRequests, setRecentRequests] = useState<Request[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [recentItemsMinimized, setRecentItemsMinimized] = useState(false);

  // useEffect(() => {
  //   fetchDashboardData();
  // }, []);

  useEffect(() => {
    if (stats.borrowRequests === 0)
      todaysTasks[0].completed = true;
    if (stats.returnRequests === 0)
      todaysTasks[1].completed = true;
  }, []);

  // const fetchDashboardData = async () => {
  //   try {

  //     getTheNumberOfAllEnabledItems().then(response => {
  //       setStats(prevStats => ({
  //         ...prevStats,
  //         totalItems: response.data
  //       }))
  //     }).catch(error => {
  //       console.error('Error fetching the number of enabled items: ', error)
  //     })

  //     fetchTheNumberOfAllEnabledClients().then((response) => {
  //       setStats(prevStats => ({
  //         ...prevStats,
  //         activeClients: response.data
  //       }));
  //     }).catch(error => {
  //       console.error('Error fetching clients:', error);
  //       throw error;
  //     });

  //     getEnabledRecentItems().then(response => {
  //       setRecentItems(response.data)
  //     }).catch(error => {
  //       console.error('Error fetching the number of enabled items: ', error)
  //     })

  //     getTodaySummary().then((response) => {
  //       const daySummary: DaySummary = response.data;
  //       setTodayStats(prevStats => ({
  //         ...prevStats,
  //         itemsAdded: daySummary.itemsAdded,
  //         itemsBorrowed: daySummary.itemsBorrowed,
  //         itemsReturned: daySummary.itemsReturned
  //       }))
  //     }).catch(error => {
  //       console.error('Error fetching today summary:', error);
  //       throw error;
  //     })

  //     getBorrowRequestNumber().then((response) => {
  //       setStats(prevStats => ({
  //         ...prevStats,
  //         borrowRequests: response.data,
  //       }))
  //     }).catch(error => {
  //       console.error('Error fetching the number of borrow requests:', error);
  //       throw error;
  //     })

  //     getReturnRequestNumber().then((response) => {
  //       setStats(prevStats => ({
  //         ...prevStats,
  //         returnRequests: response.data,
  //       }))
  //     }).catch(error => {
  //       console.error('Error fetching the number of return requests:', error);
  //       throw error;
  //     })

  //   } catch (error) {
  //     console.error('Failed to fetch dashboard data:', error);
  //   }



  // };

  const statCards = [
    {
      title: 'Total Items',
      value: stats.totalItems.toLocaleString(),
      icon: Book,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/items'
    },
    {
      title: 'Active Clients',
      value: stats.activeClients,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/clients'
    },
    {
      title: 'Borrow Requests',
      value: stats.borrowRequests,
      icon: ArrowRight,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      link: '/approvals'
    },
    {
      title: 'Return requests',
      value: stats.returnRequests,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/approvals'
    },
  ];

  const todaysTasks = [
    { task: 'Check out items', priority: 'High', count: stats.borrowRequests, completed: false, link: '/approvals' },
    { task: 'Check in items', priority: 'High', count: stats.returnRequests, completed: true, link: '/approvals' },
    // { task: 'Update book catalog', priority: 'Low', count: 3, completed: false },
  ];

  const recentActivities = {
    recentItems,
    recentReviews,
    recentRequests
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Librarian Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage items and help library's users</p>
        </div>
        <Link
          to="/books/add"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition transform hover:shadow-md hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate(stat.link)}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1 text-left">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Today's Tasks</h2>
                <span className="text-sm text-gray-500">
                  {todaysTasks.filter(task => task.completed).length} of {todaysTasks.length} completed
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {todaysTasks.map((item, index) => (
                  <button
                    key={index}
                    className={`
                      flex items-center justify-between
                      p-4 md:p-6 lg:p-8
                      border rounded-lg transition-all
                      ${item.completed
                        ? 'border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                      }
                      shadow-sm
                      w-full
                      min-h-[80px] md:min-h-[100px] lg:min-h-[120px]
                      group
                      
                    `}
                    style={{
                      marginBottom: '8px',
                      minHeight: '80px',
                      transition: 'background 0.2s, border 0.2s, box-shadow 0.2s, transform 0.2s',
                      boxShadow: item.completed
                        ? '0 2px 8px 0 rgba(16,185,129,0.08)'
                        : '0 2px 8px 0 rgba(0,0,0,0.04)'
                    }}
                    aria-label={`Task: ${item.task}, ${item.completed ? 'Completed' : 'Pending'}`}
                    onClick={() => navigate(item.link)}
                  >
                    <h3 className={`font-medium ${item.completed ? 'text-green-800 line-through group-hover:text-green-900' : 'text-gray-900 group-hover:text-gray-800'}`}>
                      {item.task}
                    </h3>
                    {!item.completed && (
                      <p className="text-sm text-gray-600 group-hover:text-gray-800">
                        {item.count} items pending
                      </p>
                    )}
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${item.priority === 'High'
                        ? 'bg-red-100 text-red-800 group-hover:bg-red-200 group-hover:text-red-900'
                        : item.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200 group-hover:text-yellow-900'
                          : 'bg-green-100 text-green-800 group-hover:bg-green-200 group-hover:text-green-900'
                      }
                    `}>
                      {item.priority}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats & Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                onClick={() => navigate('/approvals')} >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                    <Book className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Check In/Out Items</span>
                </div>
              </button>

              <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all group"
                onClick={() => navigate('/reviews')}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <span className="font-medium text-gray-900">Manage Reviews</span>
                </div>
              </button>
            </div>
          </div>

          {/* Daily Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Today's Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Borrowed Items</span>
                <span className="font-semibold text-gray-900">{todayStats.itemsBorrowed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Returned Items </span>
                <span className="font-semibold text-gray-900">{todayStats.itemsReturned}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Added Items</span>
                <span className="font-semibold text-gray-900">{todayStats.itemsAdded}</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {recentItems.length !== 0 && (

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">

              {/* Recent Items with minimize/expand functionality */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Book className="h-5 w-5 text-blue-500" />
                    Recently Added Items
                  </h3>
                  <button
                    type="button"
                    aria-label={recentItemsMinimized ? "Expand" : "Minimize"}
                    className="ml-2 p-1 rounded hover:bg-gray-100 transition"
                    onClick={() => setRecentItemsMinimized((m) => !m)}
                  >
                    <span className="inline-block transition-transform"
                      style={{
                        transform: recentItemsMinimized ? "rotate(-90deg)" : "rotate(0deg)",
                        transition: "transform 0.2s"
                      }}
                    >
                      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                        <path d="M7 8l3 3 3-3" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                </div>
                {!recentItemsMinimized && (
                  recentActivities.recentItems && recentActivities.recentItems.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {recentActivities.recentItems.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center gap-4 py-4 px-2 rounded-xl hover:bg-blue-50/40 transition group"
                        >
                          <div
                            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-gray-200 transition
                              ${item.available
                                ? 'bg-blue-100 group-hover:bg-blue-200'
                                : 'bg-yellow-100 group-hover:bg-yellow-200'
                              }`}
                          >
                            {item.available ? (
                              <BookOpen className="h-6 w-6 text-blue-600" />
                            ) : (
                              <Book className="h-6 w-6 text-yellow-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-semibold text-gray-900 truncate">{item.title}</span>
                              <span
                                className={`inline-block text-xs font-medium rounded px-2 py-0.5 ml-2
                                  ${!item.available ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'
                                  }`}
                              >
                                {item.availabilityStatus.charAt(0).toUpperCase() + item.availabilityStatus.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-500">{item.author}</span>
                              {item.yearPublished && (
                                <span className="text-xs text-gray-400">· {item.yearPublished}</span>
                              )}
                            </div>
                            {item.actionDate && (
                              <div className="mt-1 flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                  {new Date(item.actionDate).toLocaleString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                          <button
                            className="ml-auto text-blue-600 hover:text-blue-800 transition opacity-0 group-hover:opacity-100"
                            title="View Item"
                            onClick={() => navigate(`/items/${item.id}`)}
                          >
                            <ArrowRight className="h-5 w-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-400 text-sm text-center py-8 flex flex-col items-center">
                      <BookOpen className="h-8 w-8 mb-2 text-gray-200" />
                      No recent items.
                    </div>
                  )
                )}
              </section>

            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default LibrarianDashboard;