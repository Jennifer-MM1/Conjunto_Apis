import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = ({ labels, dataValues, label = 'Datos', color = '#06b6d4' }) => {
  const data = {
    labels,
    datasets: [
      {
        label,
        data: dataValues,
        backgroundColor: color,
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 32,
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
        },
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[220px]">
      <Bar data={data} options={options} />
    </div>
  );
};
export default BarChart;
