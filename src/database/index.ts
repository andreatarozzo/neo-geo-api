import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { env } from '../utils';

const sharedSequelizeOptions: SequelizeOptions = {
  // Wildcards as they are raining because ts compiles to js
  // so locally with yarn serve it will search for models with .ts extension
  // while when the project is built the model will have a .js extension
  models: [__dirname + '/**/*.model.*'],
  retry: {
    max: 3,
  },
  pool: {
    max: 10, // Maximum number of connection in pool
    min: 1, // Minimum number of connection in pool
    idle: 15000, //  The maximum time, in milliseconds, that a connection can be idle before being marked as idle
    evict: 15000, // The time interval, in milliseconds, at which the pool will check for idle connections and evict them
    acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing an error
  },
  dialectOptions: {
    decimalNumbers: true,
  },
  logging: env.NODE_ENV === 'development',
};

export const sequelize =
  env.NODE_ENV !== 'test'
    ? new Sequelize(env.DB_CONNECTION_STRING, {
        ...sharedSequelizeOptions,
      })
    : // For testing we use an in memory DB so we can test exactly our logic without mocking
      new Sequelize('sqlite::memory:', {
        ...sharedSequelizeOptions,
        database: 'businesses',
      });
