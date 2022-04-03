import React, { useEffect, useState } from "react";

import { StationType } from "../map";
import { CustomSelect } from "../select";
import { DirectionsInput } from "../select/directions-select";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  panTo: any;
  originRef: any;
  calculateRoute: any;
  destinationRef: any;
  stations: StationType[];
}

export function Sidebar(props: Props) {
  const {
    panTo,
    stations,
    calculateRoute,
    originRef,
    destinationRef,
    ...rest
  } = props;

  const [recentStationInfo, setRecentStationInfo] = useState<String>("");
  const classes = `lg:flex-col justify-start items-start absolute top-0 z-10 lg:h-full h-101 bg-primary-black lg:min-w-56 lg:w-56 w-full min-h-101 px-4 py-4`;

  useEffect(() => {
    const recentStation = window.localStorage.getItem("station");
    if (!recentStation) {
      return;
    } else {
      setRecentStationInfo(recentStation);
    }
  }, []);

  const handleClick = () => {
    const lat = parseFloat(recentStationInfo.split("|")[0]);
    const lng = parseFloat(recentStationInfo.split("|")[1]);
    panTo({ lat, lng });
  };

  return (
    <div className={classes} {...rest}>
      <div>
        <h1 className='font-[400] text-primary-grey2 text-2xl'>
          Find a Station
        </h1>
        {stations && <CustomSelect panTo={panTo} stations={stations} />}
      </div>
      <div className='flex-col pt-8'>
        <h1 className='font-[400] text-primary-grey2 text-2xl'>
          Plan Your Journey
        </h1>
        <div className='pt-2'>
          <DirectionsInput originRef={originRef} stations={stations} />
        </div>
        <div className='pt-2'>
          <DirectionsInput
            destinationRef={destinationRef}
            stations={stations}
          />
        </div>
        <div className='pt-2'>
          <button
            className='py-2 px-4 bg-blue-500 text-white rounded-md'
            onClick={calculateRoute}
          >
            Calculate Route
          </button>
        </div>
      </div>
      <div className=' pt-8'>
        {recentStationInfo != "" && (
          <>
            <h1 className='font-[400] text-primary-grey2 text-2xl pb-1'>
              Recently Visisted
            </h1>
            <div
              className='flex items-center justify-start w-48 py-2 px-2 border rounded-md border-primary-grey2 text-primary-grey2 cursor-pointer'
              onClick={handleClick}
            >
              {recentStationInfo.split("|")[2]}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
