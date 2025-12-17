import { X, Clock, Volume2, Bell, Zap } from 'lucide-react';
import { PomodoroSettings } from '../../../lib/types';

interface SettingsPanelProps {
  settings: PomodoroSettings;
  onSettingsChange: (settings: Partial<PomodoroSettings>) => void;
  onClose: () => void;
}

export function SettingsPanel({ settings, onSettingsChange, onClose }: SettingsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h2>Settings</h2>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <div className="section-title">
            <Clock size={16} />
            <span>Timer Duration (minutes)</span>
          </div>

          <div className="setting-row">
            <label>Focus</label>
            <input
              type="number"
              min="1"
              max="120"
              value={settings.workDuration}
              onChange={(e) => onSettingsChange({ workDuration: Number(e.target.value) })}
            />
          </div>

          <div className="setting-row">
            <label>Short Break</label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.shortBreakDuration}
              onChange={(e) => onSettingsChange({ shortBreakDuration: Number(e.target.value) })}
            />
          </div>

          <div className="setting-row">
            <label>Long Break</label>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.longBreakDuration}
              onChange={(e) => onSettingsChange({ longBreakDuration: Number(e.target.value) })}
            />
          </div>

          <div className="setting-row">
            <label>Long Break After</label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.pomodorosUntilLongBreak}
              onChange={(e) => onSettingsChange({ pomodorosUntilLongBreak: Number(e.target.value) })}
            />
            <span className="hint">pomodoros</span>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-title">
            <Volume2 size={16} />
            <span>Sound</span>
          </div>

          <div className="setting-row toggle">
            <label>Sound Enabled</label>
            <button
              className={`toggle-btn ${settings.soundEnabled ? 'active' : ''}`}
              onClick={() => onSettingsChange({ soundEnabled: !settings.soundEnabled })}
            >
              <span className="toggle-slider" />
            </button>
          </div>

          {settings.soundEnabled && (
            <div className="setting-row">
              <label>Volume</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.soundVolume}
                onChange={(e) => onSettingsChange({ soundVolume: Number(e.target.value) })}
              />
            </div>
          )}
        </div>

        <div className="settings-section">
          <div className="section-title">
            <Bell size={16} />
            <span>Notifications</span>
          </div>

          <div className="setting-row toggle">
            <label>Browser Notifications</label>
            <button
              className={`toggle-btn ${settings.notificationsEnabled ? 'active' : ''}`}
              onClick={() => onSettingsChange({ notificationsEnabled: !settings.notificationsEnabled })}
            >
              <span className="toggle-slider" />
            </button>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-title">
            <Zap size={16} />
            <span>Auto-start</span>
          </div>

          <div className="setting-row toggle">
            <label>Auto-start Breaks</label>
            <button
              className={`toggle-btn ${settings.autoStartBreaks ? 'active' : ''}`}
              onClick={() => onSettingsChange({ autoStartBreaks: !settings.autoStartBreaks })}
            >
              <span className="toggle-slider" />
            </button>
          </div>

          <div className="setting-row toggle">
            <label>Auto-start Pomodoros</label>
            <button
              className={`toggle-btn ${settings.autoStartPomodoros ? 'active' : ''}`}
              onClick={() => onSettingsChange({ autoStartPomodoros: !settings.autoStartPomodoros })}
            >
              <span className="toggle-slider" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
