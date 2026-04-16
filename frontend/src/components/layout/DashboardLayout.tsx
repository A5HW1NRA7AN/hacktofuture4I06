
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Plug, Settings, LogOut, Bot } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'overview', icon: LayoutDashboard, path: '/', label: 'Overview' },
    { name: 'chat', icon: MessageSquare, path: '/chat', label: 'Copilot Chat' },
    { name: 'integrations', icon: Plug, path: '/integrations', label: 'Integrations' },
    { name: 'settings', icon: Settings, path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-[#0a0d12] text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0f1318]/80 backdrop-blur-xl flex flex-col">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-lg mr-3 shadow-lg shadow-indigo-500/20">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">VoxBridge</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] border border-transparent'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                {user?.first_name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-white truncate">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="text-xs text-gray-500 truncate">{user?.email}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <Outlet />
      </main>
    </div>
  );
}
