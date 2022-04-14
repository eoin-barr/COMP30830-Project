import axios from "axios";

const devUrl = process.env.NEXT_PUBLIC_REACT_APP_DEV_URL;
const prodUrl = process.env.NEXT_PUBLIC_REACT_APP_PROD_URL;
const baseUrl = process.env.NODE_ENV === "production" ? prodUrl : devUrl;

export async function getStations() {
  return axios.get(`${baseUrl}/stations`);
}

export async function getWeather() {
  return axios.get(`${baseUrl}/weather`);
}

export async function getStationInfo(id: string) {
  return axios.get(`${baseUrl}/occupancy/${id}`);
}

export async function getHourMeans() {
  return axios.get(`${baseUrl}/get-hour-means`);
}

export async function getDayMeans() {
  return axios.get(`${baseUrl}/get-day-means`);
}
