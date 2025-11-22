export enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  estimatedDuration: number;
  scheduledTime?: string;
  category: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

export interface Habit {
  id: string;
  title: string;
  completedToday: boolean;
}

export interface WeeklyStats {
  day: string;
  focus: number;
  tasks: number;
}

export interface UserStats {
  tasksCompleted: number;
  consistencyScore: number;
  focusHours: number;
  weeklyData: WeeklyStats[];
}

export interface AISummary {
  greeting: string;
  focusPlan: string;
}