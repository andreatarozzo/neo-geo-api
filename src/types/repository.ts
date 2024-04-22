import { ModelCtor } from 'sequelize-typescript';
import { DistanceUnit } from './business';
import { BusinessDTO } from '../database/DTOs';

export interface IBaseRepository {
  Model: ModelCtor;
}

export type GetBusinessesSortedByDistanceParams = {
  lat: number;
  long: number;
  limit?: number;
  type?: string;
  unit?: DistanceUnit;
};

export interface IBusinessRepository extends IBaseRepository {
  getBusinessesSortedByDistance: (
    params: GetBusinessesSortedByDistanceParams,
  ) => Promise<BusinessDTO[]>;
}
