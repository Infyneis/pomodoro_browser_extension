import { useState, useEffect, useCallback } from 'react';
import { PomodoroStats, DEFAULT_STATS } from '../../lib/types';
import { getStats, getTodaysSessions, getWeekSessions } from '../../lib/storage';

export interface ComputedStats {
  todayCount: number;
  weekData: { labels: string[]; values: number[] };
  totalPomodoros: number;
  currentStreak: number;
  longestStreak: number;
  averagePerDay: number;
}

export function useStats() {
  const [stats, setStats] = useState<PomodoroStats>(DEFAULT_STATS);
  const [computedStats, setComputedStats] = useState<ComputedStats>({
    todayCount: 0,
    weekData: { labels: [], values: [] },
    totalPomodoros: 0,
    currentStreak: 0,
    longestStreak: 0,
    averagePerDay: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    const loadedStats = await getStats();
    setStats(loadedStats);

    const todaySessions = getTodaysSessions(loadedStats.sessions);
    const weekSessions = getWeekSessions(loadedStats.sessions);

    const labels: string[] = [];
    const values: number[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    weekSessions.forEach((count, dateStr) => {
      const date = new Date(dateStr);
      labels.push(dayNames[date.getDay()]);
      values.push(count);
    });

    const daysWithSessions = loadedStats.sessions.length > 0
      ? new Set(loadedStats.sessions
          .filter(s => s.type === 'work' && s.completed)
          .map(s => new Date(s.startTime).toISOString().split('T')[0])
        ).size
      : 0;

    const averagePerDay = daysWithSessions > 0
      ? Math.round((loadedStats.totalPomodoros / daysWithSessions) * 10) / 10
      : 0;

    setComputedStats({
      todayCount: todaySessions.length,
      weekData: { labels, values },
      totalPomodoros: loadedStats.totalPomodoros,
      currentStreak: loadedStats.currentStreak,
      longestStreak: loadedStats.longestStreak,
      averagePerDay,
    });

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadStats();

    const handleMessage = (message: { type: string }) => {
      if (message.type === 'TIMER_COMPLETE') {
        loadStats();
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [loadStats]);

  return {
    stats,
    computedStats,
    isLoading,
    refresh: loadStats,
  };
}
