import React, { useState } from 'react';
import { UserStats, Habit, Task, CalendarEvent, Priority, TaskStatus } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Trophy, Flame, Target, Download, Filter, Clock, CheckCircle2, PieChart as PieChartIcon } from 'lucide-react';

interface AnalyticsProps {
  stats: UserStats;
  habits: Habit[];
  tasks: Task[];
  events: CalendarEvent[];
}

const Analytics: React.FC<AnalyticsProps> = ({ stats, habits, tasks, events }) => {
  const [timeRange, setTimeRange] = useState<'Weekly' | 'Monthly'>('Weekly');

  // --- Derived Data ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const highPriorityTasks = tasks.filter(t => t.priority === Priority.HIGH).length;
  const workTasks = tasks.filter(t => t.category === 'Work').length;
  const personalTasks = tasks.filter(t => t.category === 'Personal').length;
  const healthTasks = tasks.filter(t => t.category === 'Health').length;

  const categoryData = [
    { name: 'Work', value: workTasks },
    { name: 'Personal', value: personalTasks },
    { name: 'Health', value: healthTasks },
    { name: 'Other', value: tasks.filter(t => t.category === 'Other').length }
  ].filter(d => d.value > 0);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#64748b'];

  return (
    <div className="p-8 space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Performance Report</h2>
            <p className="text-slate-500 mt-1">Comprehensive analysis of your productivity and habits.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 rounded-lg p-1 flex items-center shadow-sm">
                <button 
                    onClick={() => setTimeRange('Weekly')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${timeRange === 'Weekly' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    Weekly
                </button>
                <button 
                    onClick={() => setTimeRange('Monthly')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${timeRange === 'Monthly' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    Monthly
                </button>
            </div>
            
            <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 text-sm font-medium transition">
                <Download size={18} /> Export PDF
            </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Consistency Score</p>
                <h3 className="text-3xl font-bold text-slate-800">{stats.consistencyScore}<span className="text-lg text-slate-400 font-normal">/10</span></h3>
                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block">Top 15%</span>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <Trophy size={24} />
            </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Active Streak</p>
                <h3 className="text-3xl font-bold text-slate-800">5 <span className="text-lg text-slate-400 font-normal">days</span></h3>
                <span className="text-xs text-slate-400 mt-2 inline-block">Since last Monday</span>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <Flame size={24} />
            </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Focus Hours</p>
                <h3 className="text-3xl font-bold text-slate-800">{stats.focusHours}h</h3>
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-2">
                    +12% <span className="text-slate-400 font-normal">vs last week</span>
                </span>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <Target size={24} />
            </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Task Completion</p>
                <h3 className="text-3xl font-bold text-slate-800">{completionRate}%</h3>
                <span className="text-xs text-slate-400 mt-2 inline-block">{completedTasks} completed / {totalTasks} total</span>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <CheckCircle2 size={24} />
            </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Trends (Wide) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Clock size={20} className="text-indigo-500" /> Weekly Focus & Output
                  </h3>
                  <button className="text-slate-400 hover:text-slate-600">
                      <Filter size={18} />
                  </button>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.weeklyData} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip 
                            cursor={{fill: '#f8fafc'}} 
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                        />
                        <Bar name="Focus Hours" dataKey="focus" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                        <Bar name="Tasks Done" dataKey="tasks" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
                        <Legend wrapperStyle={{paddingTop: '20px'}} />
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* Category Breakdown (Side) */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <PieChartIcon size={20} className="text-indigo-500" /> Work Distribution
              </h3>
              <p className="text-xs text-slate-400 mb-6">Task allocation by category</p>
              
              <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={categoryData} 
                            innerRadius={60} 
                            outerRadius={80} 
                            paddingAngle={5} 
                            dataKey="value"
                        >
                        {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm border-b border-slate-50 pb-2">
                      <span className="text-slate-500">Highest Volume</span>
                      <span className="font-medium text-slate-800">Work (65%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Least Volume</span>
                      <span className="font-medium text-slate-800">Health (10%)</span>
                  </div>
              </div>
          </div>
      </div>
      
      {/* Detailed Activity Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                  <h3 className="font-bold text-slate-800">Detailed Activity Log</h3>
                  <p className="text-sm text-slate-500">Recent tasks and completion status.</p>
              </div>
              <div className="flex gap-2">
                  <select className="text-sm border-slate-200 rounded-md shadow-sm text-slate-600 p-1.5 bg-white focus:ring-indigo-500 focus:border-indigo-500">
                      <option>All Categories</option>
                      <option>Work</option>
                      <option>Personal</option>
                  </select>
              </div>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
                      <tr>
                          <th className="px-6 py-3 font-medium">Task Name</th>
                          <th className="px-6 py-3 font-medium">Category</th>
                          <th className="px-6 py-3 font-medium">Priority</th>
                          <th className="px-6 py-3 font-medium">Duration</th>
                          <th className="px-6 py-3 font-medium">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {tasks.map((task) => (
                          <tr key={task.id} className="hover:bg-slate-50 transition">
                              <td className="px-6 py-4 font-medium text-slate-800">{task.title}</td>
                              <td className="px-6 py-4">
                                  <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-600">
                                      {task.category}
                                  </span>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${
                                          task.priority === Priority.HIGH ? 'bg-red-500' : 
                                          task.priority === Priority.MEDIUM ? 'bg-amber-500' : 'bg-slate-400'
                                      }`}></div>
                                      {task.priority}
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-slate-500">{task.estimatedDuration} min</td>
                              <td className="px-6 py-4">
                                  {task.status === TaskStatus.DONE ? (
                                      <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium">
                                          <CheckCircle2 size={12} /> Completed
                                      </span>
                                  ) : (
                                      <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-1 rounded-full text-xs font-medium">
                                          Pending
                                      </span>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          {tasks.length === 0 && (
              <div className="p-8 text-center text-slate-400">No activity recorded yet.</div>
          )}
      </div>
    </div>
  );
};

export default Analytics;