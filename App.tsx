import React, { useState, useEffect } from 'react';
import { Task, User } from './types';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import TaskPage from './pages/TaskPage';
import AnalyticsPage from './pages/AnalyticsPage';

const App: React.FC = () => {
  // --- State ---
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'tasks' | 'analytics'>('tasks');
  
  // Initialize tasks as empty array
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('all');
  
  // --- Auth Handlers ---
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (email: string, name?: string) => {
    // Mock user data based on email or provided name
    const displayName = name || email.split('@')[0];
    // Capitalize if generated from email, otherwise use input name
    const finalName = name ? name : displayName.charAt(0).toUpperCase() + displayName.slice(1);

    setUser({
      name: finalName,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=6366f1&color=fff&bold=true`
    });
  };

  const handleLogout = () => {
    // Clear tokens from both storages
    try { localStorage.removeItem('token'); } catch {}
    try { sessionStorage.removeItem('token'); } catch {}
    setUser(null);
    setView('tasks'); // Reset view on logout
  };

  // Restore session from token (localStorage or sessionStorage)
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Not authenticated');
        const data = await res.json();
        if (data && data.user) {
          const finalName = data.user.name;
          setUser({
            name: finalName,
            email: data.user.email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=6366f1&color=fff&bold=true`
          });
        }
      })
      .catch(() => { /* ignore */ });
  }, []);

  // --- Conditional Render ---

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-900 font-sans overflow-hidden animate-fade-in">
      
      {/* Sidebar (desktop) */}
      <Sidebar 
        user={user}
        view={view}
        setView={setView}
        filter={filter}
        setFilter={setFilter}
        tasks={tasks}
        onLogout={() => { handleLogout(); setSidebarOpen(false); }}
      />

      {/* Mobile header */}
      <header className="md:hidden w-full bg-white border-b border-slate-200 p-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"></path></svg>
        </button>
        <div className="text-lg font-semibold">Task Flow</div>
        <div className="w-9 h-9 rounded-full overflow-hidden">
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
          <div className="absolute inset-y-0 left-0 w-64">
            <Sidebar 
              user={user}
              view={view}
              setView={(v) => { setView(v); setSidebarOpen(false); }}
              filter={filter}
              setFilter={(f) => { setFilter(f); setSidebarOpen(false); }}
              tasks={tasks}
              onLogout={() => { handleLogout(); setSidebarOpen(false); }}
              isMobile={true}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {view === 'tasks' ? (
          <TaskPage 
            tasks={tasks} 
            setTasks={setTasks} 
            filter={filter} 
          />
        ) : (
          <AnalyticsPage tasks={tasks} />
        )}
      </main>
    </div>
  );
};

export default App;