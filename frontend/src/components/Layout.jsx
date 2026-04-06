import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
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
    <div className="min-h-screen flex flex-col bg-[#f0f6ff]">
      {/* ── Top Bar ── */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-primary-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-black text-primary-700 hidden sm:block">ElderCare AI</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to} to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold transition-all
                   ${isActive
                     ? 'bg-primary-600 text-white shadow-md'
                     : 'text-primary-600 hover:bg-primary-50'}`
                }
              >
                <Icon size={18} /> {label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Voice */}
            <button
              onClick={onVoice}
              className="flex items-center gap-1.5 bg-primary-50 hover:bg-primary-100
                         text-primary-700 font-bold px-4 py-2 rounded-2xl text-sm
                         border-2 border-primary-200 transition-all"
              title="Voice Assistant"
            >
              <Mic size={18} />
              <span className="hidden sm:block">Voice</span>
            </button>

            {/* Greeting */}
            <span className="hidden md:block text-sm font-bold text-primary-700 bg-primary-50
                             px-4 py-2 rounded-2xl border border-primary-100">
              👋 {user?.name || 'Ramesh'}
            </span>

            {/* Logout */}
            <button onClick={handleLogout}
              className="p-2 rounded-2xl text-primary-400 hover:bg-red-50 hover:text-red-500
                         transition-all" title="Logout">
              <LogOut size={20} />
            </button>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-2xl text-primary-600 hover:bg-primary-50 transition-all">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-primary-100 py-3 px-4
                          grid grid-cols-4 gap-2 animate-slide-up">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to} to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-3 rounded-2xl text-xs font-bold transition-all
                   ${isActive ? 'bg-primary-600 text-white' : 'text-primary-600 hover:bg-primary-50'}`
                }
              >
                <Icon size={22} /> {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* ── Page Content ── */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
