export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  integrityScore: number;
  streak: number;
  workStyle: 'focused' | 'flexible' | 'social' | 'independent';
  goals: string[];
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  userId: string;
  teamId?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  dueDate?: Date;
  startDate?: Date;
  estimatedTime?: number;
  actualTime?: number;
  tags: string[];
  workPattern?: WorkPattern;
  timeBlocks: TimeBlock[];
  honestlyCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  adminId: string;
  inviteCode: string;
  createdAt: Date;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
}

export interface FocusSession {
  id: string;
  userId: string;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  distractions: Distraction[];
  completed: boolean;
  type: 'pomodoro' | 'deep-work' | 'break';
}

export interface Distraction {
  id: string;
  sessionId: string;
  timestamp: Date;
  type: 'notification' | 'website' | 'app' | 'manual';
  source?: string;
  duration?: number;
}

export interface WorkPattern {
  id: string;
  userId: string;
  date: Date;
  productiveHours: number[];
  taskCompletionRate: number;
  focusScore: number;
  distractionCount: number;
  energyLevel: number;
  moodRating: number;
}

export interface TimeBlock {
  id: string;
  startTime: Date;
  endTime: Date;
  type: 'work' | 'break' | 'meeting' | 'personal';
  taskId?: string;
  description?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'productivity' | 'consistency' | 'teamwork' | 'achievement';
  criteria: BadgeCriteria;
}

export interface BadgeCriteria {
  type: 'streak' | 'tasks_completed' | 'focus_time' | 'team_contribution';
  threshold: number;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time';
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'reminder' | 'deadline' | 'achievement' | 'team' | 'sarcastic';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  scheduledFor: Date;
  sent: boolean;
  sentAt?: Date;
  read: boolean;
  readAt?: Date;
}

export interface SarcasticPrompt {
  id: string;
  persona: 'drill-sergeant' | 'disappointed-parent' | 'sarcastic-friend' | 'motivational-coach';
  trigger: 'procrastination' | 'distraction' | 'low-productivity' | 'missed-deadline' | 'achievement';
  message: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  category: 'motivation' | 'accountability' | 'celebration' | 'intervention';
}

export interface VoiceCall {
  id: string;
  userId: string;
  character: 'boss' | 'parent' | 'friend' | 'coach' | 'therapist';
  trigger: string;
  script: string;
  duration: number;
  scheduledFor: Date;
  completed: boolean;
  userResponse?: 'answered' | 'declined' | 'missed';
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    enabled: boolean;
    types: string[];
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  privacy: {
    externalMonitoring: boolean;
    dataSharing: boolean;
    analytics: boolean;
  };
  sarcasm: {
    enabled: boolean;
    intensity: 1 | 2 | 3 | 4 | 5;
    persona: string;
    frequency: 'low' | 'medium' | 'high';
  };
  focus: {
    pomodoroLength: number;
    shortBreakLength: number;
    longBreakLength: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
  };
}

export interface AppState {
  user: User | null;
  tasks: Task[];
  teams: Team[];
  focusSessions: FocusSession[];
  notifications: Notification[];
  settings: AppSettings;
  isOnboarding: boolean;
  currentTheme: 'light' | 'dark';
}