import axios from "axios";

export async function getStations() {
  return axios.get("http://127.0.0.1:8000/stations");
}

export async function getWeather() {
  return axios.get("http://127.0.0.1:8000/weather");
}

export async function getStationInfo(id: string) {
  return axios.get(`http://127.0.0.1:8000/occupancy/${id}`);
}

export async function getHourMeans() {
  return axios.get(`http://127.0.0.1:8000/get-hour-means`);
}

export async function getDayMeans() {
  return axios.get(`http://127.0.0.1:8000/get-day-means`);
}
