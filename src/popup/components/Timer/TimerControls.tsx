import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { TimerStatus } from '../../../lib/types';

interface TimerControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function TimerControls({
  status,
  onStart,
  onPause,
  onReset,
  onSkip,
}: TimerControlsProps) {
  return (
    <div className="timer-controls">
      <button
        className="control-btn secondary"
        onClick={onReset}
        title="Reset Timer"
        disabled={status === 'idle'}
      >
        <RotateCcw size={20} />
      </button>

      {status === 'running' ? (
        <button
          className="control-btn primary"
          onClick={onPause}
          title="Pause Timer"
        >
          <Pause size={28} />
        </button>
      ) : (
        <button
          className="control-btn primary"
          onClick={onStart}
          title="Start Timer"
        >
          <Play size={28} />
        </button>
      )}

      <button
        className="control-btn secondary"
        onClick={onSkip}
        title="Skip to Next"
      >
        <SkipForward size={20} />
      </button>
    </div>
  );
}
