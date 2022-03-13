import React from "react";

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import CustomInput from "../input";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 53.348955,
  lng: -6.261312,
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const libraries: [] = [];

export function MapContainer() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "",
    libraries,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading</div>;

  return (
    <div>
      <div className='absolute top-4 left-4 z-10'>
        <CustomInput />
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
      ></GoogleMap>
    </div>
  );
}
