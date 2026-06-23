import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart = ({ labels, dataValues, colors }) => {
  const defaultColors = ['#7c3aed', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4'];

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: colors || defaultColors,
        borderWidth: 1,
        borderColor: 'rgba(15, 23, 42, 0.6)',
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0',
          padding: 20,
          font: {
            family: 'Inter',
            size: 11,
            weight: '500',
          },
        },
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
    cutout: '65%',
  };

  return (
    <div className="w-full h-full min-h-[260px] flex items-center justify-center">
      <div className="w-full max-w-[280px] h-[280px]">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};
export default DoughnutChart;
