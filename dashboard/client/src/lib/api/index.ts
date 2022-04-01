import axios from "axios";

export async function getStationsFetch() {
  try {
    const res = await fetch("http://127.0.0.1:8000/stations", {
      method: "GET",
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function getStations() {
  return axios.get("http://127.0.0.1:8000/stations");
}
