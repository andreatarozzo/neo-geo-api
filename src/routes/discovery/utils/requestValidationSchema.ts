import { BusinessType, DistanceUnit } from '../../../types';

export const GETvalidationSchema = {
  lat: {
    notEmpty: true,
    isNumeric: true,
    custom: {
      // Checking if the latitude is actually within its boundaries
      options: (value: any) => value >= -90 && value <= 90,
    },
  },
  long: {
    notEmpty: true,
    isNumeric: true,
    custom: {
      // Checking if the longitude is actually within its boundaries
      options: (value: number) => value >= -180 && value <= 180,
    },
  },
  limit: {
    optional: true,
    isNumeric: true,
    custom: {
      options: (value: number) => value >= 0,
    },
  },
  type: {
    optional: true,
    isString: true,
    // Doing some sanitization
    escape: true,
    // Check if the value is within the expected options
    // So users can't try strange things with query parameters.
    isIn: {
      options: [[BusinessType.Coffee, BusinessType.Restaurant]],
    },
  },
  unit: {
    optional: true,
    isString: true,
    // Same as above
    escape: true,
    isIn: {
      options: [[DistanceUnit.Km, DistanceUnit.Miles]],
    },
  },
};
