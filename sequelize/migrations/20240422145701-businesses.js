/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Businesses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Businesses.init(
    {
      id: DataTypes.INTEGER,
      name: DataTypes.STRING(255),
      latitude: DataTypes.DECIMAL(9, 6),
      longitude: DataTypes.DECIMAL(9, 6),
      type: DataTypes.STRING(50),
    },
    {
      sequelize,
      modelName: 'businesses',
      timestamps: false,
    },
  );
  return Businesses;
};
