import React, { useState } from 'react';
import { CheckSquare, User as UserIcon, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, name?: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isSignUp && !name) return;

    // Client-side password validation for signup
    if (isSignUp) {
      if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return;
      }
      if (passwordScore < 3) {
        setPasswordError('Password is too weak. Use uppercase, lowercase, numbers and special characters.');
        return;
      }
      setPasswordError('');
    }

    setIsLoading(true);

    const endpoint = isSignUp ? 'http://localhost:5000/api/auth/signup' : 'http://localhost:5000/api/auth/login';
    const body = isSignUp ? { name, email, password } : { email, password };

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Auth failed');
        // store token (remember -> localStorage, otherwise sessionStorage)
        if (data.token) {
          if (remember) localStorage.setItem('token', data.token);
          else sessionStorage.setItem('token', data.token);
        }
        // call parent to set UI state using returned user if available
        if (data.user && data.user.name) {
          onLogin(data.user.email, data.user.name);
        } else {
          onLogin(email, isSignUp ? name : undefined);
        }
      })
      .catch((err) => {
        console.error('Auth error', err);
        alert(err.message || 'Authentication failed');
      })
      .finally(() => setIsLoading(false));
  };

  // Password strength utils (0..4)
  const calcPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\\\/\[\];'`~+=]/.test(pwd);
    score += Number(hasLower) + Number(hasUpper) + Number(hasDigit) + Number(hasSpecial);
    if (pwd.length >= 10) score = Math.min(4, score + 1);
    return Math.min(4, score);
  };

  const strengthLabelAndColor = (score: number) => {
    if (score <= 1) return { label: 'Very weak', color: 'bg-rose-500' };
    if (score === 2) return { label: 'Weak', color: 'bg-amber-500' };
    if (score === 3) return { label: 'Good', color: 'bg-yellow-500' };
    return { label: 'Strong', color: 'bg-emerald-500' };
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200">
              <CheckSquare className="text-white" size={32} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-center text-slate-500 mb-8">
            {isSignUp ? 'Start organizing your life today' : 'Sign in to access your workspace'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-2">
              <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4" />
              <label htmlFor="remember" className="text-sm text-slate-600">Remember me</label>
            </div>
            {isSignUp && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserIcon size={18} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    placeholder="John Doe"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordScore(calcPasswordStrength(e.target.value));
                    }}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
                {isSignUp && (
                  <div className="mt-2">
                    <div className="w-full h-2 bg-slate-100 rounded overflow-hidden">
                      <div className={`${strengthLabelAndColor(passwordScore).color} h-full`} style={{ width: `${(passwordScore / 4) * 100}%`, transition: 'width 120ms' }} />
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <div className="text-slate-600">{password ? strengthLabelAndColor(passwordScore).label : 'Enter a password'}</div>
                      <div className="text-slate-400">Min 6 chars</div>
                    </div>
                    {passwordError && <div className="text-rose-600 text-sm mt-1">{passwordError}</div>}
                  </div>
                )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center text-sm text-slate-500">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={toggleMode} className="text-indigo-600 font-medium hover:underline">
            {isSignUp ? 'Sign In' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;