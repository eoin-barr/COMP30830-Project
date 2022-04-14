export interface MarkerType {
  lat: number;
  lng: number;
  name: string;
}

export interface StationType {
  lat: string;
  lng: string;
  name: string;
  bonus: boolean;
  number: string;
  address: string;
  banking: boolean;
}

export interface StationInfoType {
  last_update: number;
  available_bikes: string;
  available_bike_stands: string;
}

export interface WeatherType {
  date: string;
  pressure: string;
  rainfall: string;
  temperature: string;
}

interface Measurement {
  text: string;
  value: number;
}

export interface DirectionsType {
  steps: [];
  via_waypoint: [];
  via_waypoints: [];
  end_location: any;
  end_address: string;
  start_location: any;
  start_address: string;
  duration: Measurement;
  distance: Measurement;
  traffic_speed_entry: [];
}

export interface DirectionsResponseType {
  routes: [];
  request: {};
  status: string;
  geocoded_waypoints: [];
}
