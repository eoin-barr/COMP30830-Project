import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import { StationType } from ".";
import { Sidebar } from "../sidebar";
import { FillError } from "../error";
import { FillLoading } from "../loading";
import { getStations } from "../../lib/api";
import { mapContainerStyle, center, options, libraries } from "../../lib/map";

export function MapContainer() {
  const [stations, setStations] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<StationType | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  useEffect(() => {
    const res = async () => {
      const result = await getStations();
      setStations(result.data);
      setLoading(false);
    };
    res();
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    //@ts-ignore
    mapRef.current.panTo({ lat, lng });
    //@ts-ignore
    mapRef.current.setZoom(18);
  }, []);

  if (loadError) return <FillError />;
  if (loading) return <FillLoading />;
  if (!isLoaded) return <FillLoading />;

  return (
    <div className='lg:flex lg:flex-row flex-col bg-black'>
      <Sidebar stations={stations} panTo={panTo} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {stations &&
          stations.map((station: StationType) => (
            <Marker
              key={station.address}
              position={{
                lat: parseFloat(station.lat),
                lng: parseFloat(station.lng),
              }}
              icon={{
                url: "/bike-marker.png",
                scaledSize: new window.google.maps.Size(80, 80),
                origin: new window.google.maps.Point(0, 0),
              }}
              onClick={() => setSelected(station)}
            />
          ))}
        {selected ? (
          <InfoWindow
            onCloseClick={() => setSelected(null)}
            position={{
              lat: parseFloat(selected.lat),
              lng: parseFloat(selected.lng),
            }}
          >
            <div>
              <h4>{selected.address}</h4>
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
