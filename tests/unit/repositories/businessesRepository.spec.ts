import { BusinessesRepository } from '../../../src/repositories';
import { sequelize } from '../../../src/database';
import { DBModelInstanceName, DistanceUnit, BusinessType } from '../../../src/types';
import { Op } from 'sequelize';
import { plainToInstance } from 'class-transformer';
import { BusinessDTO } from '../../../src/database/DTOs';
import { seedingBusinessesData } from '../../utils';

const testLatForKmDistanceTest = 51.896321;
const testLongForKmDistanceTest = -8.476429;
const sampleSortedByDistanceKm = [
  plainToInstance(BusinessDTO, {
    id: 8,
    name: 'Harbor Bistro',
    latitude: 51.896321,
    longitude: -8.476429,
    type: 'Restaurant',
    distance: 0,
    unit: 'km',
  }),
  plainToInstance(BusinessDTO, {
    id: 12,
    name: 'Cuppa Delight',
    latitude: 52.660965,
    longitude: -8.625325,
    type: 'Coffee',
    distance: 85.6258,
    unit: 'km',
  }),
  plainToInstance(BusinessDTO, {
    id: 13,
    name: 'Gourmet Haven',
    latitude: 52.66139,
    longitude: -8.624794,
    type: 'Restaurant',
    distance: 85.6684,
    unit: 'km',
  }),
];

const testLatForMilesDistanceTest = 53.348765;
const testLongForMilesDistanceTest = -6.260987;
const sampleSortedByDistanceMiles = [
  plainToInstance(BusinessDTO, {
    id: 15,
    name: 'Brew Haven',
    latitude: 53.348765,
    longitude: -6.260987,
    type: 'Coffee',
    distance: 0.0001,
    unit: 'mi',
  }),
  plainToInstance(BusinessDTO, {
    id: 14,
    name: 'Taste of Dublin',
    latitude: 53.349876,
    longitude: -6.266543,
    type: 'Restaurant',
    distance: 0.2417,
    unit: 'mi',
  }),
  plainToInstance(BusinessDTO, {
    id: 4,
    name: 'Flavors of Ireland',
    latitude: 53.344721,
    longitude: -6.263105,
    type: 'Restaurant',
    distance: 0.2928,
    unit: 'mi',
  }),
];

describe.only('BusinessesRepository', () => {
  it('Should have the right model associated to it', () => {
    expect(BusinessesRepository.Model).toStrictEqual(
      sequelize.model(DBModelInstanceName.Businesses),
    );
  });

  describe('getBusinessesSortedByDistance()', () => {
    beforeAll(async () => {
      await sequelize.sync();
      await BusinessesRepository.Model.bulkCreate(seedingBusinessesData as any[]);
    });

    afterAll(async () => {
      await BusinessesRepository.Model.destroy({
        where: {
          id: {
            [Op.not]: null,
          },
        },
      });
    });

    it('Should be able to query the db without errors', async () => {
      const result = await BusinessesRepository.getBusinessesSortedByDistance({
        lat: 1,
        long: 2,
        limit: 0,
      });

      expect(result.length).toBe(0);
    }, 5000);

    it('Should return the businesses sorted by distance and with the specified unit', async () => {
      const resultWithKmUnit = await BusinessesRepository.getBusinessesSortedByDistance({
        lat: testLatForKmDistanceTest,
        long: testLongForKmDistanceTest,
        limit: 3,
        unit: DistanceUnit.Km,
      });

      expect(resultWithKmUnit).toStrictEqual(sampleSortedByDistanceKm);

      const resultWithMilesUnit =
        await BusinessesRepository.getBusinessesSortedByDistance({
          lat: testLatForMilesDistanceTest,
          long: testLongForMilesDistanceTest,
          limit: 3,
          unit: DistanceUnit.Miles,
        });

      expect(sampleSortedByDistanceMiles).toStrictEqual(resultWithMilesUnit);
    });

    it('Should default to unit to KM when the unit parameter is omitted', async () => {
      const resultWithKmUnit = await BusinessesRepository.getBusinessesSortedByDistance({
        lat: testLatForKmDistanceTest,
        long: testLongForKmDistanceTest,
        limit: 3,
      });

      expect(resultWithKmUnit).toStrictEqual(sampleSortedByDistanceKm);
    });

    it('Should limit the results based on the property "limit" passed to it', async () => {
      const resultWithKmUnitLimitThree =
        await BusinessesRepository.getBusinessesSortedByDistance({
          lat: testLatForKmDistanceTest,
          long: testLongForKmDistanceTest,
          limit: 3,
        });

      expect(resultWithKmUnitLimitThree.length).toBe(3);

      const resultWithKmUnitLimitOne =
        await BusinessesRepository.getBusinessesSortedByDistance({
          lat: testLatForKmDistanceTest,
          long: testLongForKmDistanceTest,
          limit: 1,
        });

      expect(resultWithKmUnitLimitOne.length).toBe(1);

      const resultWithKmUnitLimitZero =
        await BusinessesRepository.getBusinessesSortedByDistance({
          lat: testLatForKmDistanceTest,
          long: testLongForKmDistanceTest,
          limit: 0,
        });

      expect(resultWithKmUnitLimitZero.length).toBe(0);
    });

    it('Should filter out the results depending on the property "type" passed to it', async () => {
      const resultRestaurants = await BusinessesRepository.getBusinessesSortedByDistance({
        lat: testLatForKmDistanceTest,
        long: testLongForKmDistanceTest,
        limit: 2,
        type: BusinessType.Restaurant,
      });

      expect(resultRestaurants).toStrictEqual(
        sampleSortedByDistanceKm.filter(
          (business) => business.type === BusinessType.Restaurant,
        ),
      );

      const resultCoffees = await BusinessesRepository.getBusinessesSortedByDistance({
        lat: testLatForKmDistanceTest,
        long: testLongForKmDistanceTest,
        limit: 1,
        type: BusinessType.Coffee,
      });

      expect(resultCoffees).toStrictEqual(
        sampleSortedByDistanceKm.filter(
          (business) => business.type === BusinessType.Coffee,
        ),
      );
    });
  });
});
