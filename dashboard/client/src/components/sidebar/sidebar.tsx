import React, { useEffect, useState } from "react";
const { convert } = require("html-to-text");

import { StationType } from "../map";
import { CustomSelect } from "../select";
import { DirectionsInput } from "../select/directions-select";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  panTo: any;
  originRef: any;
  calculateRoute: any;
  destinationRef: any;
  stations: StationType[];
  weather: any;
  directions: any;
}

export function Sidebar(props: Props) {
  const {
    panTo,
    stations,
    calculateRoute,
    originRef,
    destinationRef,
    weather,
    directions,
    ...rest
  } = props;

  const [recentStationInfo, setRecentStationInfo] = useState<String>("");
  const classes = `lg:flex-col flex justify-start items-start absolute top-0 z-10 lg:h-full h-101 bg-primary-black lg:min-w-56 lg:w-56 w-full min-h-101 px-4 py-4 overflow-y-scroll`;

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
      <div className='flex-col lg:py-4 py-2 lg:mr-0 mr-4'>
        <h1 className='font-[400] text-primary-grey2 text-2xl'>
          Plan Your Journey
        </h1>
        <div className=''>
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
        {directions && (
          <div className='border rounded-md border-primry-grey2 text-grey2 mt-1 p-2'>
            <p className='text-primary-grey2'>
              Duration: {directions.duration.text}
            </p>
            <p className='text-primary-grey2 pb-1'>
              Distance: {directions.distance.text}
            </p>
            {directions.steps.map((step: any) => (
              <p key={step.instructions} className='text-primary-grey2'>
                {convert(step.instructions)}
              </p>
            ))}
          </div>
        )}
      </div>
      <div className='lg:pt-4 pt-2 lg:mr-0 mr-4'>
        <h1 className='font-[400] text-primary-grey2 text-2xl'>
          Find a Station
        </h1>
        {stations && <CustomSelect panTo={panTo} stations={stations} />}
      </div>

      <div className='lg:py-4 py-2 lg:mr-0 mr-4'>
        {recentStationInfo != "" && (
          <>
            <h1 className='font-[400] text-primary-grey2 text-2xl '>
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
      {weather && (
        <div className='lg:py-4 py-2 lg:mr-0 mr-4'>
          <h1 className='font-[400] text-primary-grey2 text-2xl '>
            Weather Update
          </h1>
          <p className='text-primary-grey2'>
            Temperture: {weather.temperature}°C
          </p>
          <p className='text-primary-grey2'>
            Last Update: {weather.date.toLocaleString().replace(",", "")}
          </p>
        </div>
      )}
    </div>
  );
}
