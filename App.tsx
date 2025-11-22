import React, { useState } from 'react';
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
    setUser(null);
    setView('tasks'); // Reset view on logout
  };

  // --- Conditional Render ---

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-900 font-sans overflow-hidden animate-fade-in">
      
      {/* Sidebar */}
      <Sidebar 
        user={user}
        view={view}
        setView={setView}
        filter={filter}
        setFilter={setFilter}
        tasks={tasks}
        onLogout={handleLogout}
      />

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