import { Expose } from 'class-transformer';
import { BusinessType } from '../../types';

export class BusinessDTO {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  latitude!: number;

  @Expose()
  longitude!: number;

  @Expose()
  type!: BusinessType;

  @Expose()
  distance?: number;

  @Expose()
  unit?: string;
}
