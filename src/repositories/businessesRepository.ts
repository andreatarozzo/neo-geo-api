import { DataType, ModelCtor, Sequelize } from 'sequelize-typescript';
import { DBModelInstanceName, DistanceUnit } from '../types';
import { BusinessDTO } from '../database/DTOs';
import { sequelize } from '../database';
import { GetBusinessesSortedByDistanceParams, IBusinessRepository } from '../types';
import { distanceCalculationQueryString } from '../utils';
import { plainToInstance } from 'class-transformer';

class Repository implements IBusinessRepository {
  #sequelize!: Sequelize;

  get Model(): ModelCtor {
    return this.#sequelize.model(DBModelInstanceName.Businesses);
  }

  set Model(_) {}

  constructor(sequelize: Sequelize) {
    this.#sequelize = sequelize;
  }

  /**
   * Gets businesses sorted by distance from the lat and long provided.
   * @param params
   * @returns
   */
  async getBusinessesSortedByDistance(
    params: GetBusinessesSortedByDistanceParams,
  ): Promise<BusinessDTO[]> {
    const distanceColumnName = 'distance';
    const unitColumnName = 'unit';
    const data = await this.Model.findAll({
      attributes: {
        include: [
          [
            // Calculating the distance at the database level because otherwise we would eventually need
            // to query the whole DB every time to be able to calculate the distance which is highly inefficient.
            // With this approach we don't lock too much resources and we don't stress out the node event loop too much with blocking operations.
            //
            // If for example we had a max radius within which we want to search our points we could easily
            // calculate the boundaries (i.e. lat is >= X && lat is <= X - long is >= Y && is long <= Y) of the coordinates within
            // our max radius and query the database based on those boundaries.
            this.#sequelize.cast(
              this.#sequelize.literal(
                distanceCalculationQueryString(
                  params.lat,
                  params.long,
                  params.unit as DistanceUnit, // Added the possibility to specify the distance unit "km" / "miles"
                ),
              ),
              DataType.FLOAT.key,
            ),
            distanceColumnName,
          ],
          // Adding also a "unit" property so the response is as specific as possible
          // and the client doesn't need to keep track of what unit was initially requested.
          [
            this.#sequelize.literal(`'${params.unit || DistanceUnit.Km}'`),
            unitColumnName,
          ],
        ],
      },
      order: [[this.#sequelize.literal(distanceColumnName), 'ASC']],

      // If somebody asks for 0 records they should get 0 records, at the end it's what they asked for :D
      ...(params.limit || params.limit === 0
        ? // Setting an upper boundary for the limit
          // In a real life scenario we would not want the client to be able to query the whole DB
          // and ideally pagination will be implemented
          { limit: params.limit > 100 ? 100 : params.limit }
        : {}),

      // Filtering by type if the type was passed with the request
      ...(params.type ? { where: { type: params.type } } : {}),
    });
    return data.map((business) =>
      // Conversion of the result object into a DTO
      // which will strip out all properties that are not explicitly exposed in the DTO.
      // This is a good thing when the data stored in the DB contains
      // information that the client is not supposed to receive, for example,
      // for security or performances reason.
      plainToInstance(BusinessDTO, business.dataValues, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    );
  }
}

export const BusinessesRepository = new Repository(sequelize);
