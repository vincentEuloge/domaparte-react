import React, { useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  Title,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js';
import type { FC } from 'react';

import type { PropsFromRedux } from '../../index';

interface Props {
  data: Extract<PropsFromRedux['temperatures'], {status:'Some'}>['value']
}

Chart.register(
  LineController, LineElement, PointElement, CategoryScale, LinearScale, Title, Legend, Tooltip,
);

export const LineChart: FC<Props> = ({
  data,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = useRef<number>();
  const height = useRef<number>();
  const gradient = useRef<CanvasGradient>();

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      const chart = new Chart(canvasRef.current, {
        type: 'line',
        data: {
          labels: data.dates,
          datasets: [{
            data: data.kitchenTemps,
            label: 'kitchen',
            borderColor: '#F84CFF',
          }, {
            data: data.corridorTemps,
            label: 'corridor',
            borderColor: '#E0D934',
          }, {
            data: data.entranceTemps,
            label: 'entrance',
            borderColor: '#45F78C',
          }, {
            data: data.outsideTemps,
            label: 'outside',
            borderColor(context) {
              const { chart: chartContext } = context;
              const { ctx, chartArea } = chartContext;

              if (!chartArea) {
                // This case happens on initial chart load
                return 'red';
              }

              const chartWidth = chartArea.right - chartArea.left;
              const chartHeight = chartArea.bottom - chartArea.top;
              if (
                gradient.current === null
                || gradient.current === undefined
                || width.current !== chartWidth
                || height.current !== chartHeight
              ) {
                // Create the gradient because this is either the first render
                // or the size of the chart has changed
                width.current = chartWidth;
                height.current = chartHeight;
                gradient.current = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.current.addColorStop(0, 'blue');
                gradient.current.addColorStop(0.5, 'yellow');
                gradient.current.addColorStop(1, 'red');
              }

              return gradient.current;
            },
          },
          ],
        },
        options: {
          responsive: true,
          interaction: {
            intersect: false,
            mode: 'index',
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Temperatures',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      return () => {
        chart.destroy();
      };
    }

    return () => { /* do nothing */ };
  }, [canvasRef, data]);

  return (
    <>
      <div>{`last data date:${data.dates[data.dates.length - 1]}`}</div>
      <div>{`${((data.outsideTemps[data.outsideTemps.length - 1] - data.corridorTemps[data.corridorTemps.length - 1]) < 0) ? 'Open' : 'Close'} the windows`}</div>
      <div>{`gap between outside and inside: ${data.outsideTemps[data.outsideTemps.length - 1] - data.corridorTemps[data.corridorTemps.length - 1]}`}</div>
      <canvas ref={canvasRef} />
    </>
  );
};
