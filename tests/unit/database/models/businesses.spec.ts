import { DataType } from 'sequelize-typescript';
import { sequelize } from '../../../../src/database';
import { DBModelInstanceName, DBTableName } from '../../../../src/types';

describe('Businesses Model', () => {
  const BusinessModel = sequelize.model(DBModelInstanceName.Businesses);

  it('The Businesses Model should be registered correctly', async () => {
    expect(BusinessModel).toBeTruthy();
    expect(BusinessModel.tableName).toBe(DBTableName.Businesses);
  });

  it('Attribute/Column "id" should have the correct configuration', async () => {
    const { id } = BusinessModel.getAttributes();

    expect(DataType.INTEGER.name === id.type.constructor.name).toBe(true);
    expect(id.unique).toBe(true);
    expect(id.allowNull).toBe(false);
    expect(id.autoIncrement).toBe(true);
    expect(id.primaryKey).toBe(true);
  });

  it('Attribute/Column "name" should have the correct configuration', async () => {
    const { name } = BusinessModel.getAttributes();

    expect(DataType.STRING.name === name.type.constructor.name).toBe(true);
    expect((name.type.valueOf() as any).options.length).toBe(255);
    expect(name.allowNull).toBe(false);
    expect(name.autoIncrement).toBeFalsy();
    expect(name.primaryKey).toBeFalsy();
  });

  it('Attribute/Column "latitude" should have the correct configuration', async () => {
    const { latitude } = BusinessModel.getAttributes();

    expect(DataType.DECIMAL.name === latitude.type.constructor.name).toBe(true);
    expect((latitude.type.valueOf() as any).options.precision).toBe(9);
    expect((latitude.type.valueOf() as any).options.scale).toBe(6);
    expect(latitude.allowNull).toBe(false);
    expect(latitude.autoIncrement).toBeFalsy();
    expect(latitude.primaryKey).toBeFalsy();
  });

  it('Attribute/Column "longitude" should have the correct configuration', async () => {
    const { longitude } = BusinessModel.getAttributes();

    expect(DataType.DECIMAL.name === longitude.type.constructor.name).toBe(true);
    expect((longitude.type.valueOf() as any).options.precision).toBe(9);
    expect((longitude.type.valueOf() as any).options.scale).toBe(6);
    expect(longitude.allowNull).toBe(false);
    expect(longitude.autoIncrement).toBeFalsy();
    expect(longitude.primaryKey).toBeFalsy();
  });

  it('Attribute/Column "type" should have the correct configuration', async () => {
    const { type } = BusinessModel.getAttributes();

    expect(DataType.STRING.name === type.type.constructor.name).toBe(true);
    expect((type.type.valueOf() as any).options.length).toBe(50);
    expect(type.allowNull).toBe(false);
    expect(type.autoIncrement).toBeFalsy();
    expect(type.primaryKey).toBeFalsy();
  });
});
