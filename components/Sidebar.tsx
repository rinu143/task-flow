import React, { useMemo } from 'react';
import { 
  List, 
  BarChart2, 
  Layout, 
  Circle, 
  CheckCircle2, 
  Tag, 
  CheckSquare, 
  LogOut 
} from 'lucide-react';
import FilterButton from './FilterButton';
import { Task, TaskStatus, User } from '../types';

interface SidebarProps {
  user: User;
  view: 'tasks' | 'analytics';
  setView: (view: 'tasks' | 'analytics') => void;
  filter: string;
  setFilter: (filter: string) => void;
  tasks: Task[];
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, view, setView, filter, setFilter, tasks, onLogout }) => {
  
  const activeCategories = useMemo(() => {
    const cats = new Set(tasks.map(t => t.category));
    return Array.from(cats).sort();
  }, [tasks]);

  const activeCount = tasks.filter(t => t.status !== TaskStatus.DONE).length;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <CheckSquare className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Task Flow</h1>
          </div>

          {/* Main Navigation */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-4">Menu</h3>
            <div className="space-y-1">
               <FilterButton label="My Tasks" icon={List} isActive={view === 'tasks'} onClick={() => setView('tasks')} />
               <FilterButton label="Analytics" icon={BarChart2} isActive={view === 'analytics'} onClick={() => setView('analytics')} />
            </div>
          </div>

          {/* Filters (Only show when in Task View) */}
          {view === 'tasks' && (
            <>
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-4">Filters</h3>
                <div className="space-y-1">
                  <FilterButton label="All" icon={Layout} isActive={filter === 'all'} onClick={() => setFilter('all')} count={tasks.length} />
                  <FilterButton label="Active" icon={Circle} isActive={filter === 'active'} onClick={() => setFilter('active')} count={activeCount} />
                  <FilterButton label="Completed" icon={CheckCircle2} isActive={filter === 'completed'} onClick={() => setFilter('completed')} count={tasks.length - activeCount} />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-4">Categories</h3>
                <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-450px)] pr-1">
                  {activeCategories.length > 0 ? (
                    activeCategories.map(cat => (
                      <FilterButton 
                        key={cat} 
                        label={cat} 
                        icon={Tag} 
                        isActive={filter === cat} 
                        onClick={() => setFilter(cat)} 
                        count={tasks.filter(t => t.category === cat).length}
                      />
                    ))
                  ) : (
                    <div className="px-4 text-sm text-slate-400 italic">No categories yet</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-3 px-1">
             <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-slate-200 shadow-sm" />
             <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
             <LogOut size={16} /> Sign Out
          </button>
        </div>
    </aside>
  );
};

export default Sidebar;