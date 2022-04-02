import React from "react";

import CustomInput from "../input";
import { StationType } from "../map";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  panTo: any;
  stations: StationType[];
}

export function Sidebar(props: Props) {
  const { stations, panTo, ...rest } = props;
  const classes = `lg:flex justify-start items-start absolute top-0 z-10 lg:h-full h-101 bg-black lg:min-w-56 lg:w-56 w-full min-h-101`;
  return (
    <div className={classes} {...rest}>
      {stations && <CustomInput panTo={panTo} stations={stations} />}
    </div>
  );
}
