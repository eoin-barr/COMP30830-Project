import React, { useEffect, useState } from "react";
import { Chart } from "chart.js";
import * as Chartjs from "chart.js";
import { Bar } from "react-chartjs-2";
const controllers = Object.values(Chartjs).filter(
  //@ts-ignore
  (chart) => chart.id !== undefined
);
//@ts-ignore
Chart.register(...controllers);

import { weekday, labelHours } from "../../lib/chart";
import { getDayMeans, getHourMeans } from "../../lib/api";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  dayMeans: any;
  hourlyMeans: any;
  // label: string;
  // text: string;
}

export default function BarChart(props: Props) {
  const { id, dayMeans, hourlyMeans, ...rest } = props;
  const day = weekday[new Date().getDay()];

  return (
    <div {...rest}>
      <Bar
        data={{
          labels: weekday,
          datasets: [
            {
              label: "Available Bikes",
              data: dayMeans[id],
              backgroundColor: "rgb(255, 99, 132)",
              borderColor: "rgb(255, 99, 132)",
              borderWidth: 1,
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Average Availability per Day",
            },
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: true,
          aspectRatio: 1.75,
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              stacked: true,
            },
            x: {
              stacked: true,
            },
          },
        }}
      />

      <Bar
        data={{
          labels: labelHours,
          datasets: [
            {
              label: "Available Bikes",
              data: hourlyMeans[id][day],
              backgroundColor: "rgb(255, 99, 132)",
              borderColor: "rgb(255, 99, 132)",
              borderWidth: 1,
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Average Availability per Hour on " + day + "'s",
            },
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: true,
          aspectRatio: 1.75,
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              stacked: true,
            },
            x: {
              stacked: true,
            },
          },
        }}
      />
    </div>
  );
}
