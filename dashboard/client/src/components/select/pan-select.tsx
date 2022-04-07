import React from "react";
import { getStationInfo } from "../../lib/api";

import { StationType } from "../map";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  panTo: any;
  setSelected: Function;
  stations: StationType[];
  setSelectedBikeInfo: Function;
}

export function CustomSelect(props: Props) {
  const { panTo, stations, setSelected, setSelectedBikeInfo, ...rest } = props;
  const classes = `w-48 rounded-md px-1 py-2 outline-none bg-primary-black text-primary-grey2 border border-primry-grey2`;

  const handleSelect = async (e: any) => {
    const stat = stations.filter(
      (item) => item.address == e.target.value.split("|")[2]
    )[0];
    const stationInfo = await getStationInfo(stat.number);

    const lat = parseFloat(e.target.value.split("|")[0]);
    const lng = parseFloat(e.target.value.split("|")[1]);
    panTo({ lat, lng });
    setSelectedBikeInfo(stationInfo.data);
    setSelected(stat);
  };

  return (
    <div className='w-48' {...rest}>
      <select className={classes} onChange={(e) => handleSelect(e)}>
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
