import React, { useState, useEffect } from 'react';
import { Users, Book, BookOpen, TrendingUp, Plus, UserPlus, ArrowUp, ArrowDown, MoreVertical, Mail, Phone, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';


type DashboardUser = {
  id: string;
  name: string;
  username: string;
  role: string;
  phone: string;
  createdAt: string;
  // add other fields as needed
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    borrowedItems: 0,
    availableItems: 0,
    users: {}
  });

  const [selectedUser, setSelectedUser] = useState<DashboardUser | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleItems = (items: any[]) => {
    setStats(prevStats => ({
      ...prevStats,
      totalItems: items.length,
      availableItems: items.filter((item: any) => item.available).length,
    }));
  };

  const handleUsers = (users: any[]) => {
    setStats(prevStats => ({
      ...prevStats,
      totalUsers: users.filter((user: any) => user.role === 'USER').length,
      users: users
    }));
  };

  const fetchDashboardData = async () => {
    try {
      // fetchItems().then(handleItems);
      // fetchAllUsers().then(handleUsers);
      // console.log(stats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'increase',
    },
    {
      title: 'Total Books',
      value: stats.totalItems.toLocaleString(),
      icon: Book,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'increase',
    },
    {
      title: 'Borrowed Books',
      value: stats.borrowedItems,
      icon: BookOpen,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      change: '+5%',
      changeType: 'increase',
    },
    {
      title: 'Available Items',
      value: stats.availableItems,
      icon: TrendingUp,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      change: '-3%',
      changeType: 'decrease',
    },
  ];

  const recentActivities = [
    { action: 'Book borrowed', book: 'The Midnight Library', user: 'John Doe', time: '2 hours ago', type: 'borrow' },
    { action: 'Book returned', book: 'Project Hail Mary', user: 'Jane Smith', time: '4 hours ago', type: 'return' },
    { action: 'New book added', book: 'Atomic Habits', user: 'Admin', time: '1 day ago', type: 'add' },
    { action: 'Book overdue', book: 'The Great Gatsby', user: 'Bob Johnson', time: '2 days ago', type: 'overdue' },
    { action: 'User registered', book: 'New user account', user: 'Alice Brown', time: '3 days ago', type: 'user' },
  ];

  const topBooks = [
    { title: 'The Midnight Library', author: 'Matt Haig', borrowed: 45, available: 2 },
    { title: 'Atomic Habits', author: 'James Clear', borrowed: 38, available: 4 },
    { title: 'Project Hail Mary', author: 'Andy Weir', borrowed: 32, available: 1 },
    { title: 'The Seven Husbands', author: 'Taylor Jenkins Reid', borrowed: 28, available: 0 },
  ];

  // Helper to format date
  const formatDate = (date: any) => {
    if (!date) return '';
    if (typeof date === "string") {
      return date.split("T")[0];
    } else if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return '';
  };

  const userRoleClass =
    selectedUser?.role?.toLowerCase() === "admin"
      ? "bg-blue-200 text-blue-800"
      : selectedUser?.role?.toLowerCase() === "librarian"
        ? "bg-green-200 text-green-800"
        : "bg-gray-200 text-gray-800";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your library system efficiently</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/items/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Link>
          <Link
            to="/users/add"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'increase' ? (
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ml-1 ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Users and User Details */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Users List - now wider and taller */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Users</h2>
            </div>
            <div className="p-6 flex-1 overflow-y-auto" style={{ maxHeight: 500 }}>
              <div className="space-y-4">
                {Array.isArray(stats.users) && stats.users.length === 0 && (
                  <div className="text-gray-500 text-center">No users found.</div>
                )}
                {Object.values(stats.users).map((user: any) => {
                  // Choose icon and color based on role
                  let RoleIcon;
                  let iconBg = "";
                  let iconColor = "";
                  switch (user.role?.toLowerCase()) {
                    case "admin":
                      RoleIcon = UserPlus;
                      iconBg = "bg-blue-100";
                      iconColor = "text-blue-600";
                      break;
                    case "librarian":
                      RoleIcon = Users;
                      iconBg = "bg-green-100";
                      iconColor = "text-green-600";
                      break;
                    default:
                      RoleIcon = User;
                      iconBg = "bg-gray-100";
                      iconColor = "text-gray-600";
                  }
                  // Format date
                  return (
                    <div
                      key={user.id}
                      className='flex items-center justify-between p-4 rounded-lg border border-gray-100 cursor-pointer transition-colors hover:bg-gray-50'
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${iconBg} mr-4`}>
                        <RoleIcon className={`h-7 w-7 ${iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 truncate text-lg">{user.username}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${user.role?.toLowerCase() === "admin"
                              ? "bg-blue-200 text-blue-800"
                              : user.role?.toLowerCase() === "librarian"
                                ? "bg-green-200 text-green-800"
                                : "bg-gray-200 text-gray-800"
                            }`}>
                            {user.role?.toLowerCase()}
                          </span>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* User Details Panel */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
            </div>
            <div className="p-6 flex-1">
              {selectedUser ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h3>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${userRoleClass}`}>
                        {selectedUser.role?.toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <Mail className="h-5 w-5 mr-2 text-gray-400" />
                      <span>{selectedUser.username ?? <span className="text-gray-400">No username</span>}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-5 w-5 mr-2 text-gray-400" />
                      <span>{selectedUser.phone ?? <span className="text-gray-400">No phone</span>}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                      <span>Created At: {formatDate(selectedUser.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center mt-8">
                  Select a user to see more details.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity - moved lower */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.type === 'borrow' ? 'bg-blue-100' :
                        activity.type === 'return' ? 'bg-green-100' :
                          activity.type === 'add' ? 'bg-purple-100' :
                            activity.type === 'overdue' ? 'bg-red-100' :
                              'bg-gray-100'
                      }`}>
                      {activity.type === 'borrow' && <BookOpen className="h-5 w-5 text-blue-600" />}
                      {activity.type === 'return' && <Book className="h-5 w-5 text-green-600" />}
                      {activity.type === 'add' && <Plus className="h-5 w-5 text-purple-600" />}
                      {activity.type === 'overdue' && <TrendingUp className="h-5 w-5 text-red-600" />}
                      {activity.type === 'user' && <Users className="h-5 w-5 text-gray-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600">{activity.book}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">by {activity.user}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Books & System Health */}
        <div className="space-y-6">
          {/* Top Books */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Most Borrowed</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topBooks.map((book, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{book.title}</h3>
                      <p className="text-sm text-gray-600">{book.author}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{book.borrowed}</p>
                      <p className="text-xs text-gray-500">{book.available} available</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">System Health</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Server Status</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600 font-medium">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Database</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600 font-medium">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Backup Status</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-yellow-600 font-medium">Scheduled</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">API Response</span>
                  <span className="text-sm font-medium text-gray-900">~200ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;