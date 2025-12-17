import { useState, useEffect } from 'react';
import { Settings, BarChart3 } from 'lucide-react';
import { TimerDisplay, TimerControls, ModeSelector } from './components/Timer';
import { SettingsPanel } from './components/Settings';
import { StatsPanel } from './components/Stats';
import { Confetti } from './components/Celebration';
import { useTimer } from './hooks/useTimer';
import { useSettings } from './hooks/useSettings';
import { useStats } from './hooks/useStats';
import { createBellSound } from '../lib/sound';

type View = 'timer' | 'settings' | 'stats';

function App() {
  const [view, setView] = useState<View>('timer');
  const {
    timerState,
    isComplete,
    completedMode,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    setMode,
  } = useTimer();
  const { settings, updateSettings } = useSettings();
  const { computedStats } = useStats();

  useEffect(() => {
    if (isComplete && settings.soundEnabled) {
      createBellSound(settings.soundVolume);
    }
  }, [isComplete, settings.soundEnabled, settings.soundVolume]);

  const getBackgroundClass = () => {
    switch (timerState.mode) {
      case 'work':
        return 'bg-work';
      case 'shortBreak':
        return 'bg-short-break';
      case 'longBreak':
        return 'bg-long-break';
    }
  };

  return (
    <div className={`app ${getBackgroundClass()}`}>
      <Confetti isActive={isComplete} mode={completedMode} />

      <header className="app-header">
        <button
          className={`icon-btn ${view === 'stats' ? 'active' : ''}`}
          onClick={() => setView(view === 'stats' ? 'timer' : 'stats')}
          title="Statistics"
        >
          <BarChart3 size={20} />
        </button>

        <div className="pomodoro-count">
          {Array.from({ length: settings.pomodorosUntilLongBreak }).map((_, i) => (
            <span
              key={i}
              className={`pomodoro-dot ${i < timerState.completedPomodoros % settings.pomodorosUntilLongBreak ? 'filled' : ''}`}
            />
          ))}
        </div>

        <button
          className={`icon-btn ${view === 'settings' ? 'active' : ''}`}
          onClick={() => setView(view === 'settings' ? 'timer' : 'settings')}
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </header>

      <main className="app-main">
        {view === 'timer' && (
          <>
            <ModeSelector
              currentMode={timerState.mode}
              status={timerState.status}
              onModeChange={setMode}
            />

            <TimerDisplay timerState={timerState} />

            <TimerControls
              status={timerState.status}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
              onSkip={skipTimer}
            />

            {isComplete && completedMode && (
              <div className="celebration-message">
                {completedMode === 'work'
                  ? 'Great work! Time for a break!'
                  : 'Break over! Ready to focus?'}
              </div>
            )}
          </>
        )}

        {view === 'settings' && (
          <SettingsPanel
            settings={settings}
            onSettingsChange={updateSettings}
            onClose={() => setView('timer')}
          />
        )}

        {view === 'stats' && (
          <StatsPanel
            stats={computedStats}
            onClose={() => setView('timer')}
          />
        )}
      </main>

      <footer className="app-footer">
        <span className="footer-text">
          {computedStats.todayCount} pomodoro{computedStats.todayCount !== 1 ? 's' : ''} today
        </span>
      </footer>
    </div>
  );
}

export default App;
