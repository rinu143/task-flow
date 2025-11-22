import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

const DatePickerPopup: React.FC<DatePickerProps> = ({ selectedDate, onSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
     const d = new Date(selectedDate);
     return isNaN(d.getTime()) ? new Date() : d;
  });

  const getDaysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      onSelect(dateStr);
  };

  const handleQuickSelect = (type: 'today' | 'tomorrow' | 'next-week') => {
      const target = new Date();
      if (type === 'tomorrow') target.setDate(target.getDate() + 1);
      if (type === 'next-week') target.setDate(target.getDate() + 7);

      const dateStr = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;
      onSelect(dateStr);
  }

  const days = [];
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
  }
  
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  for (let i = 1; i <= daysInMonth; i++) {
      const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const dateStr = `${dateToCheck.getFullYear()}-${String(dateToCheck.getMonth() + 1).padStart(2, '0')}-${String(dateToCheck.getDate()).padStart(2, '0')}`;
      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === todayStr;

      days.push(
          <button
              key={i}
              onClick={(e) => { e.preventDefault(); handleDateClick(i); }}
              className={`w-8 h-8 text-xs font-medium rounded-full flex items-center justify-center transition ${
                  isSelected 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : isToday 
                        ? 'bg-indigo-50 text-indigo-600 font-bold border border-indigo-200' 
                        : 'text-slate-700 hover:bg-slate-100'
              }`}
          >
              {i}
          </button>
      );
  }

  return (
      <>
        <div className="fixed inset-0 z-30" onClick={onClose}></div>
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-72 z-40 animate-fade-in origin-top-left">
            {/* Quick Select */}
            <div className="flex gap-2 mb-4 pb-4 border-b border-slate-100 overflow-x-auto no-scrollbar">
                <button onClick={(e) => { e.preventDefault(); handleQuickSelect('today'); }} className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-xs font-medium rounded-lg border border-slate-200 transition whitespace-nowrap">Today</button>
                <button onClick={(e) => { e.preventDefault(); handleQuickSelect('tomorrow'); }} className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-xs font-medium rounded-lg border border-slate-200 transition whitespace-nowrap">Tomorrow</button>
                <button onClick={(e) => { e.preventDefault(); handleQuickSelect('next-week'); }} className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-xs font-medium rounded-lg border border-slate-200 transition whitespace-nowrap">Next Week</button>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 px-1">
                <button onClick={(e) => { e.preventDefault(); handlePrevMonth(); }} className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition"><ChevronLeft size={16}/></button>
                <span className="text-sm font-bold text-slate-800">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button onClick={(e) => { e.preventDefault(); handleNextMonth(); }} className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition"><ChevronRight size={16}/></button>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 mb-2 text-center">
                {['S','M','T','W','T','F','S'].map(d => (
                    <div key={d} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{d}</div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1">
                {days}
            </div>
        </div>
      </>
  );
};

export default DatePickerPopup;