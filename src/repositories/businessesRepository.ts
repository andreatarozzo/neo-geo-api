import { ModelCtor, Sequelize } from 'sequelize-typescript';
import { DBModelInstanceName } from '../types';
import { BusinessDTO } from '../database/DTOs';
import { sequelize } from '../database';
import {
  GetBusinessesSortedByDistanceParams,
  IBusinessRepository,
} from '../types/repository';

class Repository implements IBusinessRepository {
  #sequelize!: Sequelize;

  constructor(sequelize: Sequelize) {
    this.#sequelize = sequelize;
  }

  get Model(): ModelCtor {
    return this.#sequelize.model(DBModelInstanceName.Businesses);
  }

  set Model(_) {}

  /**
   * Gets businesses sorted by distance from the lat and long provided.
   * @param params
   * @returns
   */
  async getBusinessesSortedByDistance(
    params: GetBusinessesSortedByDistanceParams,
  ): Promise<BusinessDTO[]> {
    return [];
  }
}

export const BusinessesRepository = new Repository(sequelize);
