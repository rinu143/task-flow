import React, { useMemo } from 'react';
import { List, Clock, CheckCircle2, Target, TrendingUp, Hash } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid 
} from 'recharts';
import { Task, TaskStatus } from '../types';

interface AnalyticsPageProps {
  tasks: Task[];
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ tasks }) => {
  const analyticsData = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === TaskStatus.DONE).length;
    const pending = total - completed;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
    const score = total === 0 ? 0 : Math.round((completed / total) * 10); // Scale 1-10

    // Chart Data: Status
    const statusData = [
      { name: 'Completed', value: completed },
      { name: 'Pending', value: pending },
    ];

    // Chart Data: Categories
    const categoryCounts: Record<string, number> = {};
    tasks.forEach(t => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });
    const categoryData = Object.keys(categoryCounts).map(cat => ({
      name: cat,
      count: categoryCounts[cat]
    }));

    return {
      total,
      completed,
      pending,
      completionRate,
      score,
      statusData,
      categoryData
    };
  }, [tasks]);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Analytics Dashboard</h2>
          <p className="text-slate-500">Track your productivity and consistency.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Tasks</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">{analyticsData.total}</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <List size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">Pending</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">{analyticsData.pending}</h3>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                <Clock size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">Completed</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">{analyticsData.completed}</h3>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
              {/* Consistency Score Card */}
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Consistency Score</p>
                    <div className="flex items-baseline gap-1 mt-2">
                        <h3 className="text-3xl font-bold text-indigo-600">{analyticsData.score}</h3>
                        <span className="text-slate-400 font-medium">/10</span>
                    </div>
                  </div>
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Target size={20} />
                  </div>
                </div>
                <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${analyticsData.score * 10}%` }}
                  ></div>
                </div>
              </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Completion Status (Pie) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80 flex flex-col">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-slate-400" /> Completion Rate
              </h3>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.statusData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" /> {/* Completed - Green */}
                      <Cell fill="#f43f5e" /> {/* Pending - Red/Pink */}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 font-bold text-xl">
                      {analyticsData.completionRate}%
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* Category Distribution (Bar) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80 flex flex-col">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Hash size={18} className="text-slate-400" /> Tasks by Category
              </h3>
              <div className="flex-1">
                {analyticsData.categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.categoryData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    No data available
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;