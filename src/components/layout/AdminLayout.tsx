import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Building, 
  Wrench, 
  FileSpreadsheet, 
  Mail, 
  MessageSquareQuote, 
  Users, 
  BookOpen, 
  UserCheck, 
  Image, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  HardHat, 
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { profile, role, signOut, isConfigured } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Projects & Galleries', path: '/admin/projects', icon: Building },
    { name: 'Services Catalog', path: '/admin/services', icon: Wrench },
    { name: 'Quote Requests', path: '/admin/quotes', icon: FileSpreadsheet },
    { name: 'Contact Messages', path: '/admin/messages', icon: Mail },
    { name: 'Client Reviews', path: '/admin/testimonials', icon: MessageSquareQuote },
    { name: 'Engineering Team', path: '/admin/team', icon: Users },
    { name: 'Technical Blog', path: '/admin/blog', icon: BookOpen },
    { name: 'Customer Accounts', path: '/admin/customers', icon: UserCheck },
    { name: 'Media Storage', path: '/admin/media', icon: Image },
    { name: 'Company Settings & SQL', path: '/admin/settings', icon: Settings },
  ];

  const isLinkActive = (item: typeof navItems[0]) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F9FAFB] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0F1115] border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-amber-500 flex items-center justify-center text-black font-bold">
            <HardHat className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-sm uppercase tracking-tight">
            APEX<span className="text-amber-500">BUILD</span> ADMIN
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded-sm bg-white/5 border border-white/10 text-gray-300 hover:text-white"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileNavOpen ? 'fixed inset-0 z-50 flex flex-col' : 'hidden'
        } md:flex md:flex-col md:w-64 lg:w-72 bg-[#0F1115] border-r border-white/10 shrink-0 md:sticky md:top-0 md:h-screen`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-sm bg-amber-500 flex items-center justify-center text-black font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <HardHat className="w-4 h-4 text-black stroke-[2.2]" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1 uppercase">
                APEX<span className="text-amber-500">BUILD</span>
              </span>
              <span className="block text-[9px] uppercase font-bold tracking-widest text-gray-400">
                Executive Control
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="md:hidden p-1 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Supabase connection status badge */}
        <div className="px-5 py-2.5 bg-[#0A0B0D] border-b border-white/10 flex items-center justify-between text-xs">
          <span className="text-gray-400 flex items-center gap-1.5 font-medium text-[11px]">
            <Database className="w-3.5 h-3.5 text-amber-500" /> Engine:
          </span>
          {isConfigured ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-sm">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Live Supabase
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-sm">
              <AlertCircle className="w-3 h-3 text-amber-500" /> Local / Preview
            </span>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all ${
                  active
                    ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-black' : 'text-gray-400'}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar User Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0A0B0D]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-7 h-7 rounded-sm bg-white/5 border border-white/10 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {profile?.full_name || 'Administrator'}
                </p>
                <p className="text-[10px] text-amber-500 uppercase font-bold tracking-wider">
                  Role: {role}
                </p>
              </div>
            </div>

            <Link
              to="/"
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
              title="View Public Website"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate('/');
            }}
            className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-rose-950/60 hover:text-rose-400 text-gray-300 border border-white/10 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
