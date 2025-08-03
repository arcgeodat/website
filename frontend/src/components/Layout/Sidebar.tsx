import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Book,
  Users,
  BookOpen,
  Star,
  Settings,
  Plus,
  UserPlus,
  Check,
} from 'lucide-react';
import { useAuth } from '../admin/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Automatically close sidebar on mobile when route changes
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      console.log('Auto-closing sidebar on mobile due to route change');
      onClose();
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  useEffect(() => {
    console.log('Sidebar mounted');
    return () => console.log('Sidebar unmounted');
  }, []);

  if (!isOpen) {
    console.warn('Sidebar is not open, cannot render menu items');
    return null
  } else {
    console.log('Rendering sidebar menu items for user:', user);
    console.log('User role:', user?.role);
    console.log('Current location:', location.pathname);
  }

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      roles: ['ADMIN'],
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      roles: ['ADMIN'],
    },
    {
      name: 'Add User',
      href: '/users/add',
      icon: UserPlus,
      roles: ['ADMIN'],
    },
    {
      name: 'Approvals',
      href: '/approvals',
      icon: Check,
      roles: ['ADMIN'],
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['ADMIN'],
    },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user?.role ?? 'USER')
  );

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          aria-label="Close sidebar overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 z-30 w-64 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-3 space-y-2">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive(item.href)
                        ? 'text-blue-700'
                        : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User info at bottom */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;