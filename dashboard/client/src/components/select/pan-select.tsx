import React from "react";

import { StationType } from "../map";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  panTo: any;
  stations: StationType[];
}

export function CustomSelect(props: Props) {
  const { panTo, stations, ...rest } = props;
  const classes = `w-48 rounded-md px-1 py-2 outline-none bg-primary-black text-primary-grey2 border border-primry-grey2`;

  const handleSelect = (e: any) => {
    const lat = parseFloat(e.target.value.split("|")[0]);
    const lng = parseFloat(e.target.value.split("|")[1]);
    panTo({ lat, lng });
  };

  return (
    <div className='w-48' {...rest}>
      <select className={classes} onChange={(e) => handleSelect(e)}>
        {stations.map((station) => (
          <option key={station.address} value={`${station.lat}|${station.lng}`}>
            {station.address}
          </option>
        ))}
      </select>
    </div>
  );
}
