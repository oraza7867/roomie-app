import { CAMPUS } from '../config/campus';

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculates the great-circle distance between two geographic coordinates
 * using the Haversine formula.
 *
 * @param lat1 Latitude of point 1 in degrees
 * @param lon1 Longitude of point 1 in degrees
 * @param lat2 Latitude of point 2 in degrees
 * @param lon2 Longitude of point 2 in degrees
 * @returns Distance in kilometers rounded to two decimal places
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in kilometers
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100;
}

/**
 * Alias for haversineDistance
 */
export const calculateDistance = haversineDistance;

/**
 * Calculates the distance from a given point to the Integral University campus.
 *
 * @param lat Latitude in degrees
 * @param lng Longitude in degrees
 * @returns Distance from campus in kilometers
 */
export function calculateDistanceFromCampus(lat: number, lng: number): number {
  return haversineDistance(CAMPUS.lat, CAMPUS.lng, lat, lng);
}

export default haversineDistance;
