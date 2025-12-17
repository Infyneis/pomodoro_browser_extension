import { TimerMode, TimerStatus } from '../../../lib/types';

interface ModeSelectorProps {
  currentMode: TimerMode;
  status: TimerStatus;
  onModeChange: (mode: TimerMode) => void;
}

export function ModeSelector({ currentMode, status, onModeChange }: ModeSelectorProps) {
  const modes: { mode: TimerMode; label: string; color: string }[] = [
    { mode: 'work', label: 'Focus', color: '#9B7EDE' },
    { mode: 'shortBreak', label: 'Short', color: '#6EE7B7' },
    { mode: 'longBreak', label: 'Long', color: '#7DD3FC' },
  ];

  const isDisabled = status === 'running';

  return (
    <div className="mode-selector">
      {modes.map(({ mode, label, color }) => (
        <button
          key={mode}
          className={`mode-btn ${currentMode === mode ? 'active' : ''}`}
          onClick={() => onModeChange(mode)}
          disabled={isDisabled}
          style={{
            '--mode-color': color,
          } as React.CSSProperties}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
