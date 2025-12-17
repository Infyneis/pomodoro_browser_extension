import {
  TimerState,
  TimerMode,
  PomodoroSettings,
  MessageAction,
  DEFAULT_TIMER_STATE,
  DEFAULT_SETTINGS,
} from '../lib/types';
import { getSettings, saveTimerState, getTimerState, addSession } from '../lib/storage';

const ALARM_NAME = 'pomodoro-timer';
const TICK_INTERVAL = 1000;

let timerState: TimerState = { ...DEFAULT_TIMER_STATE };
let settings: PomodoroSettings = { ...DEFAULT_SETTINGS };
let tickIntervalId: ReturnType<typeof setInterval> | null = null;
let sessionStartTime: number | null = null;

async function initialize() {
  settings = await getSettings();
  timerState = await getTimerState();

  if (timerState.status === 'running') {
    startTickInterval();
  }

  updateBadge();
}

function getDurationForMode(mode: TimerMode): number {
  switch (mode) {
    case 'work':
      return settings.workDuration * 60;
    case 'shortBreak':
      return settings.shortBreakDuration * 60;
    case 'longBreak':
      return settings.longBreakDuration * 60;
  }
}

function startTickInterval() {
  if (tickIntervalId) {
    clearInterval(tickIntervalId);
  }

  tickIntervalId = setInterval(() => {
    if (timerState.status === 'running') {
      timerState.timeRemaining -= 1;

      // Always broadcast current state
      broadcastState();
      updateBadge();

      if (timerState.timeRemaining <= 0) {
        timerState.timeRemaining = 0;
        console.log('[Pomodoro] Timer reached 0, calling handleTimerComplete');
        // Stop interval immediately
        stopTickInterval();
        // Save state immediately so popup sees 0
        saveTimerState(timerState);
        // Handle completion
        handleTimerComplete().catch(error => {
          console.error('[Pomodoro] Error in handleTimerComplete:', error);
        });
      } else {
        saveTimerState(timerState);
      }
    }
  }, TICK_INTERVAL);
}

function stopTickInterval() {
  if (tickIntervalId) {
    clearInterval(tickIntervalId);
    tickIntervalId = null;
  }
}

async function handleTimerComplete() {
  console.log('[Pomodoro] handleTimerComplete called, current mode:', timerState.mode);

  const completedMode = timerState.mode;
  const wasWork = completedMode === 'work';

  // Update pomodoro count first
  if (wasWork) {
    timerState.completedPomodoros += 1;
  }

  // Calculate next mode BEFORE any async operations
  const nextMode = getNextMode(completedMode);
  console.log('[Pomodoro] Switching to next mode:', nextMode);

  // Update state immediately
  timerState.mode = nextMode;
  timerState.totalTime = getDurationForMode(nextMode);
  timerState.timeRemaining = timerState.totalTime;
  timerState.status = 'idle';

  // Save and broadcast immediately - this is critical
  console.log('[Pomodoro] Saving new state:', JSON.stringify(timerState));
  await saveTimerState(timerState);
  broadcastState();
  updateBadge();

  // Now handle non-critical operations (sessions, notifications)
  // These should not block the state transition
  try {
    settings = await getSettings();
  } catch (e) {
    console.warn('[Pomodoro] Failed to reload settings:', e);
  }

  // Save session (non-blocking)
  if (sessionStartTime) {
    addSession({
      id: crypto.randomUUID(),
      type: completedMode,
      startTime: sessionStartTime,
      endTime: Date.now(),
      completed: true,
      duration: getDurationForMode(completedMode) * 60,
    }).catch(e => console.warn('[Pomodoro] Failed to save session:', e));
    sessionStartTime = null;
  }

  // Show notification (non-blocking)
  if (settings.notificationsEnabled) {
    showNotification(completedMode);
  }

  broadcastComplete(completedMode);

  // Check auto-start
  const shouldAutoStart = wasWork
    ? settings.autoStartBreaks
    : settings.autoStartPomodoros;

  console.log('[Pomodoro] Auto-start check:', { wasWork, autoStartBreaks: settings.autoStartBreaks, autoStartPomodoros: settings.autoStartPomodoros, shouldAutoStart });

  if (shouldAutoStart) {
    console.log('[Pomodoro] Auto-starting timer');
    startTimer();
  }
}

function getNextMode(currentMode: TimerMode): TimerMode {
  if (currentMode === 'work') {
    return timerState.completedPomodoros % settings.pomodorosUntilLongBreak === 0
      ? 'longBreak'
      : 'shortBreak';
  }
  return 'work';
}

function showNotification(completedMode: TimerMode) {
  const isWork = completedMode === 'work';
  const title = isWork ? 'Pomodoro Complete!' : 'Break Over!';
  const message = isWork
    ? 'Great work! Time for a break.'
    : 'Ready to get back to work?';

  try {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('public/icons/icon128.svg'),
      title,
      message,
      priority: 2,
      requireInteraction: true,
    }, (notificationId) => {
      if (chrome.runtime.lastError) {
        console.warn('[Pomodoro] Notification error:', chrome.runtime.lastError.message);
      } else {
        console.log('[Pomodoro] Notification created:', notificationId);
      }
    });
  } catch (error) {
    console.warn('[Pomodoro] Failed to create notification:', error);
  }
}

function startTimer() {
  if (timerState.status === 'running') return;

  sessionStartTime = Date.now();
  timerState.status = 'running';

  chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: timerState.timeRemaining / 60,
  });

  startTickInterval();
  saveTimerState(timerState);
  broadcastState();
  updateBadge();
}

function pauseTimer() {
  if (timerState.status !== 'running') return;

  timerState.status = 'paused';
  stopTickInterval();
  chrome.alarms.clear(ALARM_NAME);
  saveTimerState(timerState);
  broadcastState();
  updateBadge();
}

function resetTimer() {
  stopTickInterval();
  chrome.alarms.clear(ALARM_NAME);

  timerState.status = 'idle';
  timerState.timeRemaining = getDurationForMode(timerState.mode);
  timerState.totalTime = timerState.timeRemaining;
  sessionStartTime = null;

  saveTimerState(timerState);
  broadcastState();
  updateBadge();
}

function skipTimer() {
  stopTickInterval();
  chrome.alarms.clear(ALARM_NAME);

  if (sessionStartTime) {
    addSession({
      id: crypto.randomUUID(),
      type: timerState.mode,
      startTime: sessionStartTime,
      endTime: Date.now(),
      completed: false,
      duration: timerState.totalTime - timerState.timeRemaining,
    });
    sessionStartTime = null;
  }

  const nextMode = getNextMode(timerState.mode);
  timerState.mode = nextMode;
  timerState.totalTime = getDurationForMode(nextMode);
  timerState.timeRemaining = timerState.totalTime;
  timerState.status = 'idle';

  saveTimerState(timerState);
  broadcastState();
  updateBadge();
}

function setMode(mode: TimerMode) {
  if (timerState.status === 'running') return;

  timerState.mode = mode;
  timerState.totalTime = getDurationForMode(mode);
  timerState.timeRemaining = timerState.totalTime;
  timerState.status = 'idle';

  saveTimerState(timerState);
  broadcastState();
  updateBadge();
}

async function updateSettings(newSettings: Partial<PomodoroSettings>) {
  settings = { ...settings, ...newSettings };

  if (timerState.status === 'idle') {
    timerState.totalTime = getDurationForMode(timerState.mode);
    timerState.timeRemaining = timerState.totalTime;
    saveTimerState(timerState);
    broadcastState();
  }
}

function broadcastState() {
  chrome.runtime.sendMessage({
    type: 'STATE_UPDATE',
    payload: timerState,
  }).catch(() => {});
}

function broadcastComplete(mode: TimerMode) {
  chrome.runtime.sendMessage({
    type: 'TIMER_COMPLETE',
    payload: { mode },
  }).catch(() => {});
}

function updateBadge() {
  const minutes = Math.ceil(timerState.timeRemaining / 60);
  const text = timerState.status === 'idle' ? '' : `${minutes}`;

  let color: string;
  switch (timerState.mode) {
    case 'work':
      color = '#9B7EDE';
      break;
    case 'shortBreak':
      color = '#6EE7B7';
      break;
    case 'longBreak':
      color = '#7DD3FC';
      break;
  }

  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
}

chrome.runtime.onMessage.addListener((message: MessageAction, _sender, sendResponse) => {
  switch (message.type) {
    case 'START_TIMER':
      startTimer();
      sendResponse({ success: true });
      break;
    case 'PAUSE_TIMER':
      pauseTimer();
      sendResponse({ success: true });
      break;
    case 'RESET_TIMER':
      resetTimer();
      sendResponse({ success: true });
      break;
    case 'SKIP_TIMER':
      skipTimer();
      sendResponse({ success: true });
      break;
    case 'SET_MODE':
      setMode(message.payload);
      sendResponse({ success: true });
      break;
    case 'GET_STATE':
      sendResponse({ success: true, state: timerState });
      break;
    case 'UPDATE_SETTINGS':
      updateSettings(message.payload);
      sendResponse({ success: true });
      break;
  }
  return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME && timerState.status === 'running') {
    handleTimerComplete();
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.pomodoro_settings) {
    settings = changes.pomodoro_settings.newValue;
  }
});

initialize();
