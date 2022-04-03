import {
  Marker,
  GoogleMap,
  InfoWindow,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import React, { useEffect, useState, useRef, useCallback } from "react";

import { StationType } from ".";
import { Sidebar } from "../sidebar";
import { FillError } from "../error";
import { FillLoading } from "../loading";
import { mapContainerStyle, center, options } from "../../lib/map";
import { getStationInfo, getStations, getWeather } from "../../lib/api";

export function MapContainer() {
  const [libraries] = useState<any>(["places"]);
  const [weather, setWeather] = useState<any>(null);
  const [stations, setStations] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<StationType | null>(null);
  const [selectedBikeInfo, setSelectedBikeInfo] = useState<any | null>(null);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [distance, setDistance] = useState<String>("");
  const [duration, setDuration] = useState<String>("");
  const [directions, setDirections] = useState<any>(null);
  const [directionsResponse, setDirectionsResponse] = useState<any>(null);

  useEffect(() => {
    const res = async () => {
      const stationsResult = await getStations();
      const weatherResult = await getWeather();
      setStations(stationsResult.data);
      setWeather(weatherResult.data[0]);
      setLoading(false);
    };
    res();
  }, []);

  const handleMarkerClick = async (station: StationType) => {
    const stationInfo = await getStationInfo(station.number);
    setSelectedBikeInfo(stationInfo.data);
    setSelected(station);
  };

  const originRef = useRef() as React.MutableRefObject<HTMLSelectElement>;
  const destinationRef = useRef() as React.MutableRefObject<HTMLSelectElement>;

  async function calculateRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    window.localStorage.setItem("station", originRef.current.value);

    const originLocation = {
      lat: parseFloat(originRef.current.value.split("|")[0]),
      lng: parseFloat(originRef.current.value.split("|")[1]),
    };
    const destinationLocation = {
      lat: parseFloat(destinationRef.current.value.split("|")[0]),
      lng: parseFloat(destinationRef.current.value.split("|")[1]),
    };

    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originLocation,
      destination: destinationLocation,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(results);
    //@ts-ignore
    setDistance(results.routes[0].legs[0].distance.text);
    //@ts-ignore
    setDuration(results.routes[0].legs[0].duration.text);
    //@ts-ignore
    console.log(results.routes[0].legs);
    setDirections(results.routes[0].legs[0]);
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
        weather={weather}
        stations={stations}
        directions={directions}
        originRef={originRef}
        destinationRef={destinationRef}
        calculateRoute={calculateRoute}
      />
      <GoogleMap
        zoom={14}
        center={center}
        options={options}
        onLoad={onMapLoad}
        mapContainerStyle={mapContainerStyle}
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
              onClick={() => handleMarkerClick(station)}
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
            {selectedBikeInfo && (
              <div>
                <h4>{selected.address}</h4>
                <p>Availeable bikes: {selectedBikeInfo.available_bikes}</p>
                <p>
                  Availeable bike stands:{" "}
                  {selectedBikeInfo.available_bike_stands}
                </p>
              </div>
            )}
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}
