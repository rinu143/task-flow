import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Calendar, Hash, Layout, CheckCircle2, Trash2 } from 'lucide-react';
import { Task, TaskStatus, Priority } from '../types';
import DatePickerPopup from '../components/DatePickerPopup';

interface TaskPageProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  filter: string;
}

const TaskPage: React.FC<TaskPageProps> = ({ tasks, setTasks, filter }) => {
  // Helper to get local date string YYYY-MM-DD
  const getLocalTodayString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<string>('Work');
  const [newTaskDate, setNewTaskDate] = useState(getLocalTodayString());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const activeCategories = useMemo(() => {
    const cats = new Set(tasks.map(t => t.category));
    return Array.from(cats).sort();
  }, [tasks]);

  const suggestionCategories = useMemo(() => {
    const defaults = ['Work', 'Personal', 'Health', 'Finance', 'Shopping'];
    return Array.from(new Set([...defaults, ...activeCategories])).sort();
  }, [activeCategories]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const categoryToUse = newTaskCategory.trim() || 'Inbox';

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      priority: Priority.MEDIUM,
      status: TaskStatus.TODO,
      estimatedDuration: 30,
      category: categoryToUse,
      scheduledTime: newTaskDate
    };

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
      setNewTaskDate(getLocalTodayString());
      setShowDatePicker(false);
      return;
    }

    fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: newTaskTitle,
        category: categoryToUse,
        scheduledTime: newTaskDate,
        estimatedDuration: 30
      })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to create task');
        const t = data.task;
        const mapped: Task = {
          id: t._id,
          title: t.title,
          description: t.description,
          priority: t.priority,
          status: t.status,
          estimatedDuration: t.estimatedDuration,
          category: t.category,
          scheduledTime: t.scheduledTime
        };
        setTasks([mapped, ...tasks]);
        setNewTaskTitle('');
        setNewTaskDate(getLocalTodayString());
        setShowDatePicker(false);
      })
      .catch((err) => {
        console.error(err);
        alert(err.message || 'Could not add task');
      });
  };

  const toggleTask = (id: string) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const existing = tasks.find(t => t.id === id);
    if (!existing) return;
    const newStatus = existing.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;

    if (!token) {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      return;
    }

    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update task');
        const t = data.task;
        setTasks(tasks.map(x => x.id === id ? { ...x, status: t.status } : x));
      })
      .catch((err) => {
        console.error(err);
        alert(err.message || 'Could not update task');
      });
  };

  const deleteTask = (id: string) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setTasks(tasks.filter(t => t.id !== id));
      return;
    }

    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to delete');
        }
        setTasks(tasks.filter(t => t.id !== id));
      })
      .catch((err) => {
        console.error(err);
        alert(err.message || 'Could not delete task');
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:5000/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
        const mapped = (data.tasks || []).map((t: any) => ({
          id: t._id,
          title: t.title,
          description: t.description,
          priority: t.priority,
          status: t.status,
          estimatedDuration: t.estimatedDuration,
          scheduledTime: t.scheduledTime,
          category: t.category
        }));
        setTasks(mapped);
      })
      .catch((err) => console.error('Failed to load tasks', err));
  }, [setTasks]);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return task.status !== TaskStatus.DONE;
    if (filter === 'completed') return task.status === TaskStatus.DONE;
    return task.category === filter;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
    if (date.getTime() === yesterday.getTime()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-50 text-blue-700 border-blue-100',
      'bg-purple-50 text-purple-700 border-purple-100',
      'bg-emerald-50 text-emerald-700 border-emerald-100',
      'bg-amber-50 text-amber-700 border-amber-100',
      'bg-rose-50 text-rose-700 border-rose-100',
      'bg-cyan-50 text-cyan-700 border-cyan-100',
      'bg-indigo-50 text-indigo-700 border-indigo-100',
    ];
    
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <>
      {/* Header & Input */}
      <div className="p-6 md:p-10 md:pb-2 max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 capitalize truncate flex items-center gap-3">
          {filter === 'all' ? 'My Tasks' : filter === 'active' ? 'Active Tasks' : filter === 'completed' ? 'Completed Tasks' : `${filter} Tasks`}
        </h2>

        <form onSubmit={addTask} className="bg-white rounded-xl shadow-sm border border-slate-200 transition-shadow focus-within:shadow-md focus-within:border-indigo-300 z-20 relative">
          <div className="relative">
              <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full pl-12 pr-4 py-4 text-lg bg-transparent focus:outline-none rounded-t-xl placeholder:text-slate-400"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Plus size={24} />
              </div>
          </div>
          
          {/* Form Controls */}
          <div className="flex flex-wrap gap-3 px-4 pb-3 pt-1 items-center border-t border-slate-50 bg-slate-50/30 rounded-b-xl">
              
              {/* Smart Date Button with custom Popover */}
              <div className="relative">
                  <button
                      type="button"
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white border border-slate-200 rounded-md text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                      <Calendar size={14} className={newTaskDate === getLocalTodayString() ? 'text-emerald-500' : 'text-slate-400'} />
                      {newTaskDate === getLocalTodayString() ? 'Today' : formatDate(newTaskDate)}
                  </button>
                  
                  {showDatePicker && (
                      <DatePickerPopup 
                          selectedDate={newTaskDate} 
                          onSelect={(d) => { setNewTaskDate(d); setShowDatePicker(false); }} 
                          onClose={() => setShowDatePicker(false)}
                      />
                  )}
              </div>

              {/* Category Input with Datalist */}
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-400">
                      <Hash size={14} />
                  </div>
                  <input
                      list="category-options"
                      type="text"
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                      placeholder="Category"
                      className="pl-8 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-32 sm:w-40 transition-all focus:w-48"
                  />
                  <datalist id="category-options">
                    {suggestionCategories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
              </div>

              <div className="flex-1"></div>

              <button 
                  type="submit" 
                  disabled={!newTaskTitle.trim()}
                  className="bg-indigo-600 text-white px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                  Add Task
              </button>
          </div>
        </form>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-10">
        <div className="max-w-4xl mx-auto mt-6 space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Layout size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No tasks found.</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={`group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex items-center gap-4 ${task.status === TaskStatus.DONE ? 'opacity-60 bg-slate-50/50' : ''}`}
              >
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                    task.status === TaskStatus.DONE 
                      ? 'bg-indigo-600 border-indigo-600' 
                      : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50'
                  }`}
                >
                  {task.status === TaskStatus.DONE && <CheckCircle2 size={14} className="text-white" />}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-base font-medium truncate transition ${task.status === TaskStatus.DONE ? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-800'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                      {/* Date Badge */}
                      {task.scheduledTime && (
                        <div className={`flex items-center gap-1 text-xs ${
                            formatDate(task.scheduledTime) === 'Today' 
                            ? 'text-emerald-600 font-medium' 
                            : 'text-slate-500'
                        }`}>
                            <Calendar size={12} />
                            {formatDate(task.scheduledTime)}
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${getCategoryColor(task.category)}`}>
                          {task.category}
                      </span>
                  </div>
                </div>

                <button 
                  onClick={() => deleteTask(task.id)}
                  className="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                  title="Delete task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default TaskPage;