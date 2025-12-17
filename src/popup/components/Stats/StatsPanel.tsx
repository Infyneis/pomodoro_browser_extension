import { X, Flame, Target, TrendingUp, Calendar } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ComputedStats } from '../../hooks/useStats';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface StatsPanelProps {
  stats: ComputedStats;
  onClose: () => void;
}

export function StatsPanel({ stats, onClose }: StatsPanelProps) {
  const chartData = {
    labels: stats.weekData.labels,
    datasets: [
      {
        data: stats.weekData.values,
        backgroundColor: stats.weekData.values.map((_, i) =>
          i === stats.weekData.values.length - 1 ? '#9B7EDE' : '#DDD6FE'
        ),
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#333',
        padding: 8,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: { raw: unknown }) => `${context.raw} pomodoros`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#999',
          font: {
            size: 11,
          },
        },
      },
      y: {
        display: false,
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <h2>Statistics</h2>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="stats-content">
        <div className="stats-grid">
          <div className="stat-card today">
            <div className="stat-icon">
              <Target size={20} />
            </div>
            <div className="stat-value">{stats.todayCount}</div>
            <div className="stat-label">Today</div>
          </div>

          <div className="stat-card streak">
            <div className="stat-icon">
              <Flame size={20} />
            </div>
            <div className="stat-value">{stats.currentStreak}</div>
            <div className="stat-label">Day Streak</div>
          </div>

          <div className="stat-card total">
            <div className="stat-icon">
              <TrendingUp size={20} />
            </div>
            <div className="stat-value">{stats.totalPomodoros}</div>
            <div className="stat-label">Total</div>
          </div>

          <div className="stat-card average">
            <div className="stat-icon">
              <Calendar size={20} />
            </div>
            <div className="stat-value">{stats.averagePerDay}</div>
            <div className="stat-label">Avg/Day</div>
          </div>
        </div>

        <div className="chart-section">
          <h3>This Week</h3>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {stats.longestStreak > 0 && (
          <div className="best-streak">
            <Flame size={16} />
            <span>Best streak: {stats.longestStreak} days</span>
          </div>
        )}
      </div>
    </div>
  );
}
