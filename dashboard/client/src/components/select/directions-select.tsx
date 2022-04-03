import React from "react";

import { StationType } from "../map";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  originRef?: any;
  destinationRef?: any;
  stations: StationType[];
}

export function DirectionsInput(props: Props) {
  const { stations, originRef, destinationRef, ...rest } = props;

  const elRef = originRef ? originRef : destinationRef;
  const placeholder = originRef ? "Origin" : "Destination";
  const classes = `w-48 rounded px-1 py-2 outline-none bg-primary-black text-primary-grey2 border border-primry-grey2`;

  return (
    <div className='w-48' {...rest}>
      <select className={classes} ref={elRef} defaultValue={""}>
        <option value='' disabled>
          {placeholder}
        </option>
        {stations.map((station) => (
          <option
            key={station.address}
            value={`${station.lat}|${station.lng}|${station.address}`}
          >
            {station.address}
          </option>
        ))}
      </select>
    </div>
  );
}
