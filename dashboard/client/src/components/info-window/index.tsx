import React from "react";

import BarChart from "../chart";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  selectedBikeInfo: any;
  selected: any;
  dayMeans: any;
  hourlyMeans: any;
}

export default function InfoWindowContents(props: Props) {
  const { selectedBikeInfo, selected, dayMeans, hourlyMeans, ...rest } = props;
  return (
    <div {...rest}>
      <h4 className='text-xl font-normal'>{selected.address}</h4>
      <p>Availeable bikes: {selectedBikeInfo.available_bikes}</p>
      <p>Availeable bike stands: {selectedBikeInfo.available_bike_stands}</p>
      <BarChart
        dayMeans={dayMeans}
        hourlyMeans={hourlyMeans}
        id={selected.number}
      />
    </div>
  );
}
