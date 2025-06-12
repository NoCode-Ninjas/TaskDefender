import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, User, Task, Team, FocusSession, Notification, AppSettings } from '../types';
import { StorageService } from '../services/StorageService';

interface AppContextType extends AppState {
  // User actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  completeOnboarding: () => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string, honestlyCompleted: boolean) => void;
  
  // Team actions
  createTeam: (team: Omit<Team, 'id' | 'createdAt' | 'inviteCode'>) => void;
  joinTeam: (inviteCode: string) => void;
  leaveTeam: (teamId: string) => void;
  
  // Focus session actions
  startFocusSession: (taskId?: string, type?: 'pomodoro' | 'deep-work') => void;
  endFocusSession: (sessionId: string) => void;
  addDistraction: (sessionId: string, type: string, source?: string) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  
  // Settings actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  setCurrentView: (view: AppState['currentView']) => void;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: { id: string; honestlyCompleted: boolean } }
  | { type: 'CREATE_TEAM'; payload: Team }
  | { type: 'JOIN_TEAM'; payload: Team }
  | { type: 'LEAVE_TEAM'; payload: string }
  | { type: 'START_FOCUS_SESSION'; payload: FocusSession }
  | { type: 'END_FOCUS_SESSION'; payload: { id: string; endTime: Date; duration: number } }
  | { type: 'ADD_DISTRACTION'; payload: { sessionId: string; distraction: any } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'DISMISS_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_CURRENT_VIEW'; payload: AppState['currentView'] }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialState: AppState = {
  user: null,
  tasks: [],
  teams: [],
  focusSessions: [],
  notifications: [],
  settings: {
    theme: 'system',
    notifications: {
      enabled: true,
      types: ['reminder', 'deadline', 'achievement'],
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
      },
    },
    privacy: {
      externalMonitoring: false,
      dataSharing: false,
      analytics: true,
    },
    sarcasm: {
      enabled: true,
      intensity: 3,
      persona: 'sarcastic-friend',
      frequency: 'medium',
    },
    focus: {
      pomodoroLength: 25,
      shortBreakLength: 5,
      longBreakLength: 15,
      autoStartBreaks: false,
      autoStartPomodoros: false,
    },
  },
  isOnboarding: true,
  currentTheme: 'light',
  currentView: 'dashboard',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...action.payload };
      
    case 'SET_USER':
      return { ...state, user: action.payload };
      
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload, updatedAt: new Date() } : null,
      };
      
    case 'COMPLETE_ONBOARDING':
      return { ...state, isOnboarding: false };
      
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
      
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: new Date() }
            : task
        ),
      };
      
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
      
    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? {
                ...task,
                status: 'completed' as const,
                honestlyCompleted: action.payload.honestlyCompleted,
                completedAt: new Date(),
                updatedAt: new Date(),
              }
            : task
        ),
      };
      
    case 'CREATE_TEAM':
      return { ...state, teams: [...state.teams, action.payload] };
      
    case 'JOIN_TEAM':
      return { ...state, teams: [...state.teams, action.payload] };
      
    case 'LEAVE_TEAM':
      return {
        ...state,
        teams: state.teams.filter(team => team.id !== action.payload),
      };
      
    case 'START_FOCUS_SESSION':
      return { ...state, focusSessions: [...state.focusSessions, action.payload] };
      
    case 'END_FOCUS_SESSION':
      return {
        ...state,
        focusSessions: state.focusSessions.map(session =>
          session.id === action.payload.id
            ? {
                ...session,
                endTime: action.payload.endTime,
                duration: action.payload.duration,
                completed: true,
              }
            : session
        ),
      };
      
    case 'ADD_DISTRACTION':
      return {
        ...state,
        focusSessions: state.focusSessions.map(session =>
          session.id === action.payload.sessionId
            ? {
                ...session,
                distractions: [...session.distractions, action.payload.distraction],
              }
            : session
        ),
      };
      
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
      
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true, readAt: new Date() }
            : notification
        ),
      };
      
    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
      };
      
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
      
    case 'TOGGLE_THEME':
      const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
      return { ...state, currentTheme: newTheme };
      
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
      
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from storage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await StorageService.loadAppState();
        if (savedState) {
          dispatch({ type: 'LOAD_STATE', payload: savedState });
        }
      } catch (error) {
        console.error('Failed to load app state:', error);
      }
    };
    loadState();
  }, []);

  // Save state to storage whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await StorageService.saveAppState(state);
      } catch (error) {
        console.error('Failed to save app state:', error);
      }
    };
    saveState();
  }, [state]);

  // Action creators
  const setUser = (user: User) => dispatch({ type: 'SET_USER', payload: user });
  
  const updateUser = (updates: Partial<User>) => dispatch({ type: 'UPDATE_USER', payload: updates });
  
  const completeOnboarding = () => dispatch({ type: 'COMPLETE_ONBOARDING' });
  
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const task: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      userId: state.user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_TASK', payload: task });
  };
  
  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  };
  
  const deleteTask = (id: string) => dispatch({ type: 'DELETE_TASK', payload: id });
  
  const completeTask = (id: string, honestlyCompleted: boolean) => {
    dispatch({ type: 'COMPLETE_TASK', payload: { id, honestlyCompleted } });
  };
  
  const createTeam = (teamData: Omit<Team, 'id' | 'createdAt' | 'inviteCode'>) => {
    const team: Team = {
      ...teamData,
      id: crypto.randomUUID(),
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date(),
    };
    dispatch({ type: 'CREATE_TEAM', payload: team });
  };
  
  const joinTeam = (inviteCode: string) => {
    // In a real app, this would make an API call
    console.log('Joining team with code:', inviteCode);
  };
  
  const leaveTeam = (teamId: string) => dispatch({ type: 'LEAVE_TEAM', payload: teamId });
  
  const startFocusSession = (taskId?: string, type: 'pomodoro' | 'deep-work' = 'pomodoro') => {
    const session: FocusSession = {
      id: crypto.randomUUID(),
      userId: state.user?.id || '',
      taskId,
      startTime: new Date(),
      duration: 0,
      distractions: [],
      completed: false,
      type,
    };
    dispatch({ type: 'START_FOCUS_SESSION', payload: session });
  };
  
  const endFocusSession = (sessionId: string) => {
    const session = state.focusSessions.find(s => s.id === sessionId);
    if (session) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);
      dispatch({ type: 'END_FOCUS_SESSION', payload: { id: sessionId, endTime, duration } });
    }
  };
  
  const addDistraction = (sessionId: string, type: string, source?: string) => {
    const distraction = {
      id: crypto.randomUUID(),
      sessionId,
      timestamp: new Date(),
      type,
      source,
    };
    dispatch({ type: 'ADD_DISTRACTION', payload: { sessionId, distraction } });
  };
  
  const addNotification = (notificationData: Omit<Notification, 'id'>) => {
    const notification: Notification = {
      ...notificationData,
      id: crypto.randomUUID(),
      userId: state.user?.id || '',
      sent: false,
      read: false,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };
  
  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };
  
  const dismissNotification = (id: string) => {
    dispatch({ type: 'DISMISS_NOTIFICATION', payload: id });
  };
  
  const updateSettings = (updates: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: updates });
  };
  
  const toggleTheme = () => dispatch({ type: 'TOGGLE_THEME' });
  
  const setCurrentView = (view: AppState['currentView']) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
  };

  const contextValue: AppContextType = {
    ...state,
    setUser,
    updateUser,
    completeOnboarding,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    createTeam,
    joinTeam,
    leaveTeam,
    startFocusSession,
    endFocusSession,
    addDistraction,
    addNotification,
    markNotificationRead,
    dismissNotification,
    updateSettings,
    toggleTheme,
    setCurrentView,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};