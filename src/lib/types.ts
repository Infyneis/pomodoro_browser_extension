export type TimerMode = 'work' | 'shortBreak' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  pomodorosUntilLongBreak: number;
  soundEnabled: boolean;
  soundVolume: number;
  notificationsEnabled: boolean;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export interface PomodoroSession {
  id: string;
  type: TimerMode;
  startTime: number;
  endTime: number;
  completed: boolean;
  duration: number;
}

export interface TimerState {
  status: TimerStatus;
  mode: TimerMode;
  timeRemaining: number;
  totalTime: number;
  completedPomodoros: number;
}

export interface PomodoroStats {
  sessions: PomodoroSession[];
  totalPomodoros: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  pomodorosUntilLongBreak: 4,
  soundEnabled: true,
  soundVolume: 0.7,
  notificationsEnabled: true,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

export const DEFAULT_TIMER_STATE: TimerState = {
  status: 'idle',
  mode: 'work',
  timeRemaining: 25 * 60,
  totalTime: 25 * 60,
  completedPomodoros: 0,
};

export const DEFAULT_STATS: PomodoroStats = {
  sessions: [],
  totalPomodoros: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: null,
};

export type MessageAction =
  | { type: 'START_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'SKIP_TIMER' }
  | { type: 'SET_MODE'; payload: TimerMode }
  | { type: 'GET_STATE' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<PomodoroSettings> };

export type MessageResponse =
  | { type: 'STATE_UPDATE'; payload: TimerState }
  | { type: 'TIMER_COMPLETE'; payload: { mode: TimerMode } }
  | { type: 'ERROR'; payload: string };
