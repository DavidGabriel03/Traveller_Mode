const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const CityPhoto = sequelize.define('CityPhoto', {
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  caption: {
    type: DataTypes.STRING
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CityId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = CityPhoto;
