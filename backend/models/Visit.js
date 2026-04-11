const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Visit = sequelize.define('Visit', {
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CityId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Visit;
