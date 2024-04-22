import app from '../../../../src/app';
import request from 'supertest';
import { BusinessType, DiscoveryResponse, ParamError } from '../../../../src/types';
import { sequelize } from '../../../../src/database';
import { BusinessesRepository } from '../../../../src/repositories/businessesRepository';
import { seedingBusinessesData } from '../../../utils';
import { Op } from 'sequelize';

const missingQueryParamsError = (errors: ParamError[]) => ({
  message: 'BAD_REQUEST',
  errors,
});

describe('/discovery', () => {
  describe('GET', () => {
    describe('400 - BAD_REQUEST', () => {
      it('Should return 400 when none of the mandatory params are passed as query params', async () => {
        const response = await request(app).get('/discovery').query({}).expect(400);
        expect(response.body).toStrictEqual(
          missingQueryParamsError([
            { fieldName: 'lat', error: 'invalid_value' },
            { fieldName: 'long', error: 'invalid_value' },
          ]),
        );
      });

      it('Should return 400 when some of the mandatory query params are not correct', async () => {
        const response = await request(app)
          .get('/discovery')
          .query({ lat: 1 })
          .expect(400);
        expect(response.body).toStrictEqual(
          missingQueryParamsError([{ fieldName: 'long', error: 'invalid_value' }]),
        );
      });

      it('Should return 400 when the mandatory parameters are present and correct but optional params are incorrect', async () => {
        const responseLimit = await request(app)
          .get('/discovery')
          .query({ lat: 1, long: 1, limit: 'test' })
          .expect(400);
        expect(responseLimit.body).toStrictEqual(
          missingQueryParamsError([{ fieldName: 'limit', error: 'invalid_value' }]),
        );

        const responseType = await request(app)
          .get('/discovery')
          .query({ lat: 1, long: 1, type: 1 })
          .expect(400);
        expect(responseType.body).toStrictEqual(
          missingQueryParamsError([{ fieldName: 'type', error: 'invalid_value' }]),
        );

        const responseUnit = await request(app)
          .get('/discovery')
          .query({ lat: 1, long: 1, unit: 1 })
          .expect(400);
        expect(responseUnit.body).toStrictEqual(
          missingQueryParamsError([{ fieldName: 'unit', error: 'invalid_value' }]),
        );
      });
    });

    describe('500 - INTERNAL_SERVER_ERROR', () => {
      it('Should return INTERNAL_SERVER_ERROR if something goes wrong during the execution of the logic', async () => {
        // Model is not synced so sequelize will throw an error
        await request(app)
          .get('/discovery')
          .query({ lat: 53.348765, long: -6.260987 })
          .expect(500);
      });
    });

    describe('200 - OK', () => {
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

      it('Should return valid data', async () => {
        const limit = 1;
        const response = await request(app)
          .get('/discovery')
          .query({ lat: 53.348765, long: -6.260987, limit })
          .expect(200);

        const expectedResponse: DiscoveryResponse = {
          data: [
            {
              id: 15,
              name: 'Brew Haven',
              latitude: 53.348765,
              longitude: -6.260987,
              type: BusinessType.Coffee,
              distance: 0.0001,
              unit: 'km',
            },
          ],
          total: limit,
        };

        expect(response.body).toStrictEqual(expectedResponse);
      });
    });
  });
});
