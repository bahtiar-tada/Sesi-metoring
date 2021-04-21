'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Manager extends Model {
    static associate(models) {
      Manager.belongsTo(models.Store, {
        as: 'Store',
        'foreignKey': 'storeId',
        'targetKey': 'id',
        constraints: false,
      });
    }
  };
  Manager.init({
    storeId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    workingSince: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Manager',
  });
  return Manager;
};