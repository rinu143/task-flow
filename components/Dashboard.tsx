import React, { useEffect, useState } from 'react';
import { Task, CalendarEvent, Habit, UserStats, AISummary, Priority } from '../types';
import { Sparkles, CheckCircle, Calendar, Activity, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  tasks: Task[];
  events: CalendarEvent[];
  habits: Habit[];
  stats: UserStats;
  aiSummary: AISummary | null;
  isLoadingAI: boolean;
  onStartFocus: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, events, habits, stats, aiSummary, isLoadingAI, onStartFocus }) => {
  const highPriorityCount = tasks.filter(t => t.priority === Priority.HIGH).length;
  const completedHabits = habits.filter(h => h.completedToday).length;
  
  const data = [
    { name: 'Completed', value: stats.tasksCompleted },
    { name: 'Remaining', value: tasks.length },
  ];
  const COLORS = ['#10b981', '#e2e8f0'];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header / AI Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
          <Sparkles size={150} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-yellow-300" size={20} />
            <span className="font-semibold tracking-wide text-indigo-100 text-sm uppercase">Daily Focus Card</span>
          </div>
          
          {isLoadingAI ? (
             <div className="animate-pulse space-y-3">
                <div className="h-6 bg-white/20 rounded w-1/2"></div>
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
             </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-2">{aiSummary?.greeting || "Hello, Productivity Master."}</h1>
              <p className="text-indigo-100 max-w-2xl text-lg leading-relaxed">
                {aiSummary?.focusPlan || "Your workspace is ready. Add tasks to generate an optimized plan."}
              </p>
            </>
          )}

          <div className="mt-6 flex gap-4">
            <button 
                onClick={onStartFocus}
                className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-indigo-50 transition flex items-center gap-2"
            >
                <Zap size={18} /> Start Focus Mode
            </button>
            <div className="flex items-center gap-2 text-sm text-indigo-100 bg-white/10 px-4 py-2 rounded-lg">
                <Activity size={16} /> Consistency Score: {stats.consistencyScore}/10
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
             <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Task Progress</p>
                <h3 className="text-2xl font-bold text-slate-800">{Math.round((stats.tasksCompleted / (stats.tasksCompleted + tasks.length || 1)) * 100)}%</h3>
                <p className="text-xs text-slate-400 mt-1">{stats.tasksCompleted} done today</p>
             </div>
             <div className="w-16 h-16">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} innerRadius={20} outerRadius={30} paddingAngle={5} dataKey="value">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
             </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-2 mb-3 text-slate-500 text-sm font-medium">
                <Calendar size={16} /> Next Meeting
             </div>
             {events.length > 0 ? (
                 <div>
                     <h3 className="text-lg font-semibold text-slate-800 truncate">{events[0].title}</h3>
                     <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded mt-1">
                        {events[0].startTime} - {events[0].endTime}
                     </span>
                 </div>
             ) : (
                 <p className="text-slate-400 italic">No upcoming events</p>
             )}
        </div>

        {/* Habits */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3 text-slate-500 text-sm font-medium">
                <CheckCircle size={16} /> Habits
            </div>
            <div className="flex items-end gap-2">
                <h3 className="text-2xl font-bold text-slate-800">{completedHabits}/{habits.length}</h3>
                <span className="text-xs text-slate-400 mb-1">completed today</span>
            </div>
             <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(completedHabits / (habits.length || 1)) * 100}%`}}
                ></div>
             </div>
        </div>
      </div>

      {/* Urgent Tasks Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">High Priority Tasks</h3>
        <div className="space-y-3">
            {tasks.filter(t => t.priority === Priority.HIGH).slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="font-medium text-slate-700">{task.title}</span>
                    </div>
                    <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                        {task.estimatedDuration} min
                    </span>
                </div>
            ))}
            {highPriorityCount === 0 && (
                <p className="text-slate-400 text-center py-4">No high priority tasks. Great job!</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;