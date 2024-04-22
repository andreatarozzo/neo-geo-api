import { Column, Table, Model, DataType } from 'sequelize-typescript';
import { DBTableName } from '../../types';

const latitudeColumnName = 'latitude';
const longitudeColumnName = 'longitude';

@Table({ tableName: DBTableName.Businesses, timestamps: false })
export class Businesses extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.DECIMAL(9, 6),
    allowNull: false,
  })
  // Necessary on Decimal values because sequelize has some hiccups with decimals
  // and sometime it does not convert them properly
  get latitude(): number {
    return parseFloat(`${this.getDataValue(latitudeColumnName)}`);
  }

  set latitude(value: number) {
    this.setDataValue(latitudeColumnName, value);
  }

  @Column({
    type: DataType.DECIMAL(9, 6),
    allowNull: false,
  })
  get longitude(): number {
    return parseFloat(`${this.getDataValue(longitudeColumnName)}`);
  }

  set longitude(value: number) {
    this.setDataValue(longitudeColumnName, value);
  }

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  type!: 'Coffee' | 'Restaurant';
}

export default Businesses;
