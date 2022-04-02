import React from "react";

import { CustomInput } from "../input";
import { StationType } from "../map";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  panTo: any;
  originRef: any;
  Autocomplete: any;
  destinationRef: any;
  calculateRoute: any;
  stations: StationType[];
}

export function Sidebar(props: Props) {
  const {
    panTo,
    stations,
    originRef,
    Autocomplete,
    destinationRef,
    calculateRoute,
    ...rest
  } = props;
  const classes = `lg:flex-col justify-start items-start absolute top-0 z-10 lg:h-full h-101 bg-primary-black lg:min-w-56 lg:w-56 w-full min-h-101 px-4 py-4`;
  return (
    <div className={classes} {...rest}>
      <div>
        <h1 className='font-[400] text-primary-grey2 text-2xl'>
          Find a Station
        </h1>
        {stations && <CustomInput panTo={panTo} stations={stations} />}
      </div>
      <div className='flex-col pt-8'>
        <h1 className='font-[400] text-primary-grey2 text-2xl'>
          Plan Your Journey
        </h1>
        <div className='pt-2'>
          <Autocomplete>
            <input
              className='py-2 px-4 rounded text-sm'
              type='text'
              placeholder='Origin'
              ref={originRef}
            />
          </Autocomplete>
        </div>
        <div className='pt-2'>
          <Autocomplete>
            <input
              className='py-2 px-4 rounded text-sm'
              type='text'
              placeholder='Destination'
              ref={destinationRef}
            />
          </Autocomplete>
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
    </div>
  );
}
