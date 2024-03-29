import dotenv from "dotenv";
import opencage from "opencage-api-client";

dotenv.config();

const { LOCATION_API_KEY } = process.env;

export function getCoordinates(address) {
  return new Promise((resolve, reject) => {
    opencage
      .geocode({ q: address, key: LOCATION_API_KEY, limit: 1 })
      .then((data) => {
        resolve(data.results);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getAddress(lat, long) {
  return new Promise((resolve, reject) => {
    opencage
      .geocode({ q: `${lat},${long}`, key: LOCATION_API_KEY, limit: 1 })
      .then((data) => {
        resolve(data.results);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// Get distance between two coordinates
// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula

// Convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Get distance between two coordinates
export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}
