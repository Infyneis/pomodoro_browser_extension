import { TimerState } from '../../../lib/types';

interface TimerDisplayProps {
  timerState: TimerState;
}

export function TimerDisplay({ timerState }: TimerDisplayProps) {
  const { timeRemaining, totalTime, mode, status } = timerState;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getColor = () => {
    switch (mode) {
      case 'work':
        return '#9B7EDE';
      case 'shortBreak':
        return '#6EE7B7';
      case 'longBreak':
        return '#7DD3FC';
    }
  };

  const getLabel = () => {
    switch (mode) {
      case 'work':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  return (
    <div className="timer-display">
      <svg className="timer-svg" viewBox="0 0 200 200">
        <circle
          className="timer-circle-bg"
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="8"
        />
        <circle
          className="timer-circle-progress"
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 100 100)"
          style={{
            transition: status === 'running' ? 'stroke-dashoffset 1s linear' : 'none',
          }}
        />

        <text
          x="100"
          y="85"
          textAnchor="middle"
          className="timer-label"
          fill="#666"
          fontSize="14"
        >
          {getLabel()}
        </text>

        <text
          x="100"
          y="115"
          textAnchor="middle"
          className="timer-time"
          fill="#333"
          fontSize="36"
          fontWeight="bold"
        >
          {timeString}
        </text>

        <text
          x="100"
          y="140"
          textAnchor="middle"
          className="timer-status"
          fill="#999"
          fontSize="12"
        >
          {status === 'running' ? 'In Progress' : status === 'paused' ? 'Paused' : 'Ready'}
        </text>
      </svg>

      <div className="octopus-decoration">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id="octoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#C4B5FD' }}/>
              <stop offset="100%" style={{ stopColor: '#7C3AED' }}/>
            </linearGradient>
          </defs>
          <ellipse cx="16" cy="11" rx="10" ry="8" fill="url(#octoGrad)"/>
          <circle cx="12" cy="10" r="2.5" fill="white"/>
          <circle cx="20" cy="10" r="2.5" fill="white"/>
          <circle cx="12.6" cy="10" r="1.2" fill="#1a1a2e"/>
          <circle cx="20.6" cy="10" r="1.2" fill="#1a1a2e"/>
          <path d="M14 14 Q16 16 18 14" stroke="#7C3AED" strokeWidth="1" fill="none" strokeLinecap="round"/>
          <path d="M6 17 Q4 23 6 28" stroke="#9B7EDE" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M10 18 Q8 25 11 30" stroke="#9B7EDE" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M16 19 Q16 25 16 30" stroke="#9B7EDE" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M22 18 Q24 25 21 30" stroke="#9B7EDE" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M26 17 Q28 23 26 28" stroke="#9B7EDE" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}
