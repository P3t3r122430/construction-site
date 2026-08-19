import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  HardHat, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle,
  Building,
  Briefcase
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedRole = searchParams.get('role') || searchParams.get('portal') || 'client';

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'manager' | 'client'>(
    requestedRole === 'admin' ? 'admin' : requestedRole === 'manager' || requestedRole === 'project_manager' ? 'manager' : 'client'
  );

  const { signIn, isConfigured } = useAuth();
  const { success, error, warning } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;

  useEffect(() => {
    if (requestedRole === 'admin') setActiveTab('admin');
    else if (requestedRole === 'manager' || requestedRole === 'project_manager') setActiveTab('manager');
    else setActiveTab('client');
  }, [requestedRole]);

  const handleTabChange = (tab: 'admin' | 'manager' | 'client') => {
    setActiveTab(tab);
    setSearchParams({ portal: tab });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      error('Missing credentials', 'Please provide both your registered email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await signIn(email, password);
      
      if (!res.success) {
        error('Authentication Failed', res.error || 'Invalid email or password.');
        return;
      }

      // Authorization check based strictly on real database role
      const userRole = res.role || 'customer';
      const isStaffRole = userRole === 'admin' || userRole === 'manager' || userRole === 'project_manager';

      success('Welcome Back', `Authenticated successfully as ${userRole.toUpperCase()}.`);

      if (from) {
        // If they were navigating to /admin but are a customer, redirect to customer dashboard
        if (from.startsWith('/admin') && !isStaffRole) {
          warning('Access Restricted', 'Your account has Client permissions. Redirecting to your Customer Portal.');
          navigate('/account', { replace: true });
          return;
        }
        navigate(from, { replace: true });
        return;
      }

      // Default routing based on verified database role
      if (isStaffRole) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/account', { replace: true });
      }
    } catch (err: unknown) {
      error('Sign In Error', err instanceof Error ? err.message : 'Authentication system error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <HardHat className="w-7 h-7 text-slate-950 stroke-[2.2]" />
          </div>
        </Link>
        <h2 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-white">
          Sign In to ApexBuild Portal
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Enter your institutional credentials to access your verified account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 space-y-6">
          {!isConfigured && (
            <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Supabase Credentials Required</span>
              </div>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                Live authentication is enforced. To log in or register, set <code className="font-mono bg-black/40 px-1 py-0.5 rounded text-amber-300">VITE_SUPABASE_URL</code> and <code className="font-mono bg-black/40 px-1 py-0.5 rounded text-amber-300">VITE_SUPABASE_ANON_KEY</code> in the project Settings.
              </p>
            </div>
          )}
          
          {/* Portal Selection Tabs (Informational Navigation Only - Requires Full Password Auth) */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Select Portal Target
            </span>
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleTabChange('admin')}
                className={`py-2 px-1.5 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Executive Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('manager')}
                className={`py-2 px-1.5 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'manager'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Site Manager</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('client')}
                className={`py-2 px-1.5 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                  activeTab === 'client'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Client Account</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activeTab === 'admin' 
                      ? 'admin@apexbuild.co.ke' 
                      : activeTab === 'manager' 
                      ? 'manager@apexbuild.co.ke' 
                      : 'client@company.com'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? 'Authenticating Credentials...' : 'Authenticate & Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security Notice */}
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex items-start gap-2.5 text-[11px] text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              Administrative and manager privileges are verified directly against the PostgreSQL security database. Frontend role selection does not grant elevated privileges.
            </p>
          </div>

          {/* Sign up prompt */}
          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            Don't have an institutional account?{' '}
            <Link to="/register" className="font-bold text-amber-400 hover:text-amber-300">
              Register Client Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
