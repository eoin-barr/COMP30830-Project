import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

import { weekday, labelHours } from "../../lib/chart";
import { getDayMeans, getHourMeans } from "../../lib/api";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

export default function BarChart(props: Props) {
  const { id, ...rest } = props;

  const [hourMeans, setHourMeans] = useState<any>(null);
  const [dayMeans, setDayMeans] = useState<any>(null);

  const d = new Date();
  let day = weekday[d.getDay()];

  const hourMeansFunc = async () => {
    const result = await getHourMeans();
    console.log("hourMeans", result.data);
    return result.data;
  };

  const dayMeansFunc = async () => {
    const result = await getDayMeans();
    console.log("dayMeans", result.data);
    return result.data;
  };

  useEffect(() => {
    setHourMeans(hourMeansFunc());
    setDayMeans(dayMeansFunc());
  }, []);

  return (
    <div>
      <Bar
        data={{
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [
            {
              label: "# of Votes",
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        }}
        height={400}
        width={600}
        options={{
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}
