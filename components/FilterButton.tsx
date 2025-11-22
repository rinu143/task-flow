import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FilterButtonProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, icon: Icon, isActive, onClick, count }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition ${
      isActive 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <div className="flex items-center gap-3 truncate">
      <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
      <span className="truncate">{label}</span>
    </div>
    {count !== undefined && (
      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
        {count}
      </span>
    )}
  </button>
);

export default FilterButton;