import React, { useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import {
  locations,
  mapContainerStyle,
  center,
  options,
  libraries,
} from "../../lib/map";
import { MarkerType } from ".";
import CustomInput from "../input";
import { FillError } from "../error";
import { FillLoading } from "../loading";

export function MapContainer() {
  const [selected, setSelected] = useState<MarkerType | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "API_KEY",
    libraries,
  });

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    //@ts-ignore
    mapRef.current.panTo({ lat, lng });
    //@ts-ignore
    mapRef.current.setZoom(12);
  }, []);

  if (loadError) return <FillError />;
  if (!isLoaded) return <FillLoading />;

  return (
    <div>
      <CustomInput panTo={panTo} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {locations.map((location) => (
          <Marker
            key={location.name}
            position={{ lat: location.lat, lng: location.lng }}
            icon={{
              url: "/bike-marker.png",
              scaledSize: new window.google.maps.Size(80, 80),
              origin: new window.google.maps.Point(0, 0),
            }}
            onClick={() => setSelected(location)}
          />
        ))}
        {selected ? (
          <InfoWindow
            onCloseClick={() => setSelected(null)}
            position={{ lat: selected.lat, lng: selected.lng }}
          >
            <div>
              <h4>{selected.name}</h4>
              <p>
                <strong>Lat: </strong>
                {selected.lat}
              </p>
              <p>
                <strong>Lng: </strong>
                {selected.lng}
              </p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}
