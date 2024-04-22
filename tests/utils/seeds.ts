import { plainToInstance } from 'class-transformer';
import { BusinessDTO } from '../../src/database/DTOs';
import businessesData from '../../sequelize/assets/businesses.json';

// Converting to DTOs so we have a match on the property side of things
export const seedingBusinessesData = Object.values(businessesData).map((rawBusiness) =>
  plainToInstance(
    BusinessDTO,
    {
      name: rawBusiness['Basic Fields']['Chain Name'],
      latitude: Object.values(rawBusiness['Locations'])[0].Lat,
      longitude: Object.values(rawBusiness['Locations'])[0].Long,
      type: rawBusiness['Basic Fields'].Category,
    },
    { excludeExtraneousValues: true },
  ),
);
