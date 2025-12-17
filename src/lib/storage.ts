import {
  PomodoroSettings,
  PomodoroStats,
  PomodoroSession,
  TimerState,
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
  DEFAULT_TIMER_STATE,
} from './types';

const STORAGE_KEYS = {
  SETTINGS: 'pomodoro_settings',
  STATS: 'pomodoro_stats',
  TIMER_STATE: 'pomodoro_timer_state',
} as const;

declare const browser: typeof chrome | undefined;

function getStorage(): typeof chrome.storage.local {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return chrome.storage.local;
  }
  if (typeof browser !== 'undefined' && browser?.storage) {
    return browser.storage.local;
  }
  throw new Error('No browser storage API available');
}

export async function getSettings(): Promise<PomodoroSettings> {
  try {
    const storage = getStorage();
    const result = await storage.get(STORAGE_KEYS.SETTINGS);
    return { ...DEFAULT_SETTINGS, ...result[STORAGE_KEYS.SETTINGS] };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<PomodoroSettings>): Promise<void> {
  const storage = getStorage();
  const current = await getSettings();
  await storage.set({
    [STORAGE_KEYS.SETTINGS]: { ...current, ...settings },
  });
}

export async function getStats(): Promise<PomodoroStats> {
  try {
    const storage = getStorage();
    const result = await storage.get(STORAGE_KEYS.STATS);
    return { ...DEFAULT_STATS, ...result[STORAGE_KEYS.STATS] };
  } catch {
    return DEFAULT_STATS;
  }
}

export async function saveStats(stats: Partial<PomodoroStats>): Promise<void> {
  const storage = getStorage();
  const current = await getStats();
  await storage.set({
    [STORAGE_KEYS.STATS]: { ...current, ...stats },
  });
}

export async function addSession(session: PomodoroSession): Promise<void> {
  const stats = await getStats();
  const today = new Date().toISOString().split('T')[0];

  let newStreak = stats.currentStreak;

  if (session.type === 'work' && session.completed) {
    if (stats.lastSessionDate === today) {
      // Same day, keep streak
    } else if (stats.lastSessionDate === getYesterday()) {
      // Consecutive day
      newStreak += 1;
    } else {
      // Streak broken or first session
      newStreak = 1;
    }
  }

  await saveStats({
    sessions: [...stats.sessions, session],
    totalPomodoros: session.type === 'work' && session.completed
      ? stats.totalPomodoros + 1
      : stats.totalPomodoros,
    currentStreak: newStreak,
    longestStreak: Math.max(stats.longestStreak, newStreak),
    lastSessionDate: session.type === 'work' && session.completed ? today : stats.lastSessionDate,
  });
}

function getYesterday(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}

export async function getTimerState(): Promise<TimerState> {
  try {
    const storage = getStorage();
    const result = await storage.get(STORAGE_KEYS.TIMER_STATE);
    return { ...DEFAULT_TIMER_STATE, ...result[STORAGE_KEYS.TIMER_STATE] };
  } catch {
    return DEFAULT_TIMER_STATE;
  }
}

export async function saveTimerState(state: Partial<TimerState>): Promise<void> {
  const storage = getStorage();
  const current = await getTimerState();
  await storage.set({
    [STORAGE_KEYS.TIMER_STATE]: { ...current, ...state },
  });
}

export function getTodaysSessions(sessions: PomodoroSession[]): PomodoroSession[] {
  const today = new Date().toISOString().split('T')[0];
  return sessions.filter(s => {
    const sessionDate = new Date(s.startTime).toISOString().split('T')[0];
    return sessionDate === today && s.type === 'work' && s.completed;
  });
}

export function getWeekSessions(sessions: PomodoroSession[]): Map<string, number> {
  const result = new Map<string, number>();
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    result.set(dateStr, 0);
  }

  sessions.forEach(session => {
    if (session.type === 'work' && session.completed) {
      const dateStr = new Date(session.startTime).toISOString().split('T')[0];
      if (result.has(dateStr)) {
        result.set(dateStr, (result.get(dateStr) || 0) + 1);
      }
    }
  });

  return result;
}
