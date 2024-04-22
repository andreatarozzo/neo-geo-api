import { plainToInstance } from 'class-transformer';
import { BusinessDTO } from '../../../../src/database/DTOs';

const baseDummyBusiness = {
  id: 1,
  name: 'Test',
  latitude: 53.341234,
  longitude: -6.258765,
  type: 'Restaurant',
};

describe('Business DTO', () => {
  it('Should be able to return an object that matches the DTO properties', () => {
    const result = plainToInstance(BusinessDTO, baseDummyBusiness);
    expect(result).toEqual(baseDummyBusiness);
  });

  it('Should be able filter out unexpected properties', () => {
    const result = plainToInstance(
      BusinessDTO,
      { ...baseDummyBusiness, test: 1, otherTest: 2 },
      {
        excludeExtraneousValues: true,
      },
    );
    expect(result).toEqual(baseDummyBusiness);
  });
});
