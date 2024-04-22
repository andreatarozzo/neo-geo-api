import { DistanceUnit } from '../types';

/**
 * Returns the distance query calculation string to be passed to the DB
 * @param lat
 * @param long
 * @param unit
 * @returns
 */
export const distanceCalculationQueryString = (
  lat: number,
  long: number,
  unit: DistanceUnit,
): string => {
  const conversionFactor = unit === DistanceUnit.Miles ? '* 0.621371' : '';
  return `ROUND(
            CAST(
              6371 * 
              acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(${long}) - radians(longitude)) + 
              sin(radians(${lat})) * 
              sin(radians(latitude))
            ) AS NUMERIC
          ) ${conversionFactor}, 4)`.trim();
};
