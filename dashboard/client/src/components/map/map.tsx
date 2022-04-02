import {
  Marker,
  GoogleMap,
  InfoWindow,
  Autocomplete,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import React, { useEffect, useState, useRef, useCallback } from "react";

import { StationType } from ".";
import { Sidebar } from "../sidebar";
import { FillError } from "../error";
import { FillLoading } from "../loading";
import { getStations } from "../../lib/api";
import { mapContainerStyle, center, options } from "../../lib/map";

export function MapContainer() {
  const [stations, setStations] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<StationType | null>(null);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const [distance, setDistance] = useState<String>("");
  const [duration, setDuration] = useState<String>("");
  const [directionsResponse, setDirectionsResponse] = useState<any>(null);

  useEffect(() => {
    const res = async () => {
      const result = await getStations();
      setStations(result.data);
      setLoading(false);
    };
    res();
  }, []);

  const originRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const destinationRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  async function calculateRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    //@ts-ignore
    setDistance(results.routes[0].legs[0].distance.text);
    //@ts-ignore
    setDuration(results.routes[0].legs[0].duration.text);
  }

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
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
      <Sidebar
        panTo={panTo}
        stations={stations}
        originRef={originRef}
        Autocomplete={Autocomplete}
        destinationRef={destinationRef}
        calculateRoute={calculateRoute}
      />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
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
