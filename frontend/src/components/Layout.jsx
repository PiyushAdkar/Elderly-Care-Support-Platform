import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard, Pill, Video, Activity,
  FolderOpen, Music, Users, Mic, LogOut, Menu, X
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Home'       },
  { to: '/medicine',      icon: Pill,            label: 'Medicine'   },
  { to: '/telemedicine',  icon: Video,           label: 'Doctor'     },
  { to: '/activity',      icon: Activity,        label: 'Activity'   },
  { to: '/documents',     icon: FolderOpen,      label: 'Documents'  },
  { to: '/entertainment', icon: Music,           label: 'Fun'        },
  { to: '/contacts',      icon: Users,           label: 'Contacts'   },
];

export default function Layout({ onVoice }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* ── Top Bar ── */}
      <nav className="w-full bg-[#0B1C3F] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
          {/* Left Section (Logo) */}
          <div className="flex items-center flex-shrink-0">
            <div className="text-xl font-bold text-white flex items-center gap-2 whitespace-nowrap">
              <span className="text-2xl">🌿</span>
              <span className="hidden sm:block">Elderly Care</span>
            </div>
          </div>

          {/* Center Section (Navigation Links) */}
          <div className="hidden md:flex items-center md:gap-2 lg:gap-4 overflow-x-auto flex-nowrap scrollbar-hide mx-4">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to} to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 transition-colors flex-shrink-0 whitespace-nowrap text-sm ${
                    isActive
                      ? 'bg-white/15 text-white px-3 py-2 rounded-lg font-semibold'
                      : 'text-blue-100 hover:text-white px-3 py-2 font-medium'
                  }`
                }
              >
                <Icon size={18} /> {label}
              </NavLink>
            ))}
          </div>

          {/* Right Section (User Profile & Actions) */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Voice Assistant */}
            <button
              onClick={onVoice}
              className="flex items-center gap-2 text-white hover:text-blue-200 font-medium transition-colors"
              title="Voice Assistant"
            >
              <Mic size={20} />
              <span className="hidden lg:block">Voice</span>
            </button>

            {/* User Badge */}
            <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#0B1C3F] bg-white px-3 py-1.5 rounded-lg border border-transparent">
              👋 <span>{user?.name || 'Ramesh'}</span>
            </div>

            {/* Logout */}
            <button onClick={handleLogout}
              className="flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors font-medium" 
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden sm:block">Logout</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0B1C3F] border-t border-white/10 py-3 px-4 grid grid-cols-4 gap-2 shadow-md animate-slide-up">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to} to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 rounded-lg text-xs font-semibold transition-all
                 ${isActive ? 'bg-white/15 text-white' : 'text-blue-100 hover:bg-white/5'}`
              }
            >
              <Icon size={20} /> {label}
            </NavLink>
          ))}
        </div>
      )}

      {/* ── Page Content ── */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
