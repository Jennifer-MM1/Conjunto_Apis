import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const LineChart = ({ labels, dataValues, label = 'Historial', color = '#7c3aed' }) => {
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label,
        data: dataValues,
        borderColor: color,
        backgroundColor: `${color}15`, // Light transparent background
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 1,
        pointHoverRadius: 6,
        pointBackgroundColor: color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          maxTicksLimit: 8,
          font: {
            family: 'Inter',
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.08)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Inter',
            size: 11,
          },
          callback: (value) => {
            if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
            if (value >= 1e3) return `${(value / 1e3).toFixed(0)}k`;
            return value;
          }
        },
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[260px]">
      <Line data={data} options={options} />
    </div>
  );
};
export default LineChart;
