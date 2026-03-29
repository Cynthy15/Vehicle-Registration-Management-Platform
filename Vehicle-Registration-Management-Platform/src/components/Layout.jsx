import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, LayoutDashboard, PlusCircle, LogOut, LogIn, Home } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const Sidebar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Public Fleet', icon: Home, path: '/', public: true },
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', public: false },
    { label: 'Register Vehicle', icon: PlusCircle, path: '/vehicle/new', public: false },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-prime-50 flex items-center justify-center text-prime-600">
          <Car size={24} strokeWidth={2.5} />
        </div>
        <span className="text-lg font-bold text-gray-900 tracking-tight">AutoReg</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          if (!item.public && !isAuthenticated) return null;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-prime-50 text-prime-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <item.icon size={20} className={isActive ? 'text-prime-600' : 'text-gray-400'} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-prime-600 text-white rounded-xl font-medium hover:bg-prime-700 transition-colors shadow-md shadow-prime-500/20"
          >
            <LogIn size={20} />
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

const Layout = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
      <Toaster position="top-right" toastOptions={{
        className: 'font-sans text-sm shadow-xl border border-gray-100',
        duration: 4000,
      }} />
    </div>
  );
};

export default Layout;
