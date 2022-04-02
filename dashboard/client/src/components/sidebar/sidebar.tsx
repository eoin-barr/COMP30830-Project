import React from "react";

import { CustomInput } from "../input";
import { StationType } from "../map";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  panTo: any;
  stations: StationType[];
}

export function Sidebar(props: Props) {
  const { stations, panTo, ...rest } = props;
  const classes = `lg:flex-col justify-start items-start absolute top-0 z-10 lg:h-full h-101 bg-black lg:min-w-56 lg:w-56 w-full min-h-101 px-4 py-4`;
  return (
    <div className={classes} {...rest}>
      <div>
        <h1 className='font-[400] text-primary-grey2 text-2xl'>
          Find a Station
        </h1>
        {stations && <CustomInput panTo={panTo} stations={stations} />}
      </div>
      <div className='pt-8'>
        <h1 className='font-[400] text-primary-grey2 text-2xl'>
          Plan Your Journey
        </h1>
      </div>
    </div>
  );
}
