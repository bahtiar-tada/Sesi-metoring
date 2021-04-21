'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    static associate(models) {
        Store.hasMany(models.Manager, {
			as: 'Manager',
			'foreignKey': 'storeId',
			'targetKey': 'id',
			constraints: false,
		});
    }
  };
  Store.init({
    name: DataTypes.STRING,
    pic: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Store',
  });
  return Store;
};