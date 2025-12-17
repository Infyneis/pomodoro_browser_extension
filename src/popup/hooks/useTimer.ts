import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerState, TimerMode, DEFAULT_TIMER_STATE } from '../../lib/types';
import { getTimerState } from '../../lib/storage';

export function useTimer() {
  const [timerState, setTimerState] = useState<TimerState>(DEFAULT_TIMER_STATE);
  const [isComplete, setIsComplete] = useState(false);
  const [completedMode, setCompletedMode] = useState<TimerMode | null>(null);
  const prevModeRef = useRef<TimerMode | null>(null);

  // Helper to handle state updates and detect mode changes
  const updateState = useCallback((newState: TimerState) => {
    setTimerState(prev => {
      // Only update if something changed to avoid unnecessary re-renders
      if (
        prev.mode === newState.mode &&
        prev.status === newState.status &&
        prev.timeRemaining === newState.timeRemaining &&
        prev.totalTime === newState.totalTime &&
        prev.completedPomodoros === newState.completedPomodoros
      ) {
        return prev;
      }
      return newState;
    });

    // Detect mode change for completion celebration
    if (prevModeRef.current && prevModeRef.current !== newState.mode) {
      if (prevModeRef.current === 'work' && (newState.mode === 'shortBreak' || newState.mode === 'longBreak')) {
        setIsComplete(true);
        setCompletedMode('work');
        setTimeout(() => {
          setIsComplete(false);
          setCompletedMode(null);
        }, 3000);
      } else if ((prevModeRef.current === 'shortBreak' || prevModeRef.current === 'longBreak') && newState.mode === 'work') {
        setIsComplete(true);
        setCompletedMode(prevModeRef.current);
        setTimeout(() => {
          setIsComplete(false);
          setCompletedMode(null);
        }, 3000);
      }
    }
    prevModeRef.current = newState.mode;
  }, []);

  useEffect(() => {
    // Get initial state directly from storage
    const fetchStateFromStorage = async () => {
      const state = await getTimerState();
      updateState(state);
    };

    fetchStateFromStorage();

    // Poll storage directly every 250ms for reliable state sync
    const pollInterval = setInterval(fetchStateFromStorage, 250);

    // Listen for direct messages from service worker
    const handleMessage = (message: { type: string; payload?: unknown }) => {
      if (message.type === 'STATE_UPDATE') {
        updateState(message.payload as TimerState);
      } else if (message.type === 'TIMER_COMPLETE') {
        const payload = message.payload as { mode: TimerMode };
        setIsComplete(true);
        setCompletedMode(payload.mode);
        setTimeout(() => {
          setIsComplete(false);
          setCompletedMode(null);
        }, 3000);
      }
    };

    // Listen for storage changes
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === 'local' && changes.pomodoro_timer_state?.newValue) {
        const newState = changes.pomodoro_timer_state.newValue as TimerState;
        updateState(newState);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      clearInterval(pollInterval);
      chrome.runtime.onMessage.removeListener(handleMessage);
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [updateState]);

  const startTimer = useCallback(() => {
    chrome.runtime.sendMessage({ type: 'START_TIMER' });
  }, []);

  const pauseTimer = useCallback(() => {
    chrome.runtime.sendMessage({ type: 'PAUSE_TIMER' });
  }, []);

  const resetTimer = useCallback(() => {
    chrome.runtime.sendMessage({ type: 'RESET_TIMER' });
  }, []);

  const skipTimer = useCallback(() => {
    chrome.runtime.sendMessage({ type: 'SKIP_TIMER' });
  }, []);

  const setMode = useCallback((mode: TimerMode) => {
    chrome.runtime.sendMessage({ type: 'SET_MODE', payload: mode });
  }, []);

  return {
    timerState,
    isComplete,
    completedMode,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    setMode,
  };
}
