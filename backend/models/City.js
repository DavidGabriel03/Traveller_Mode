const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const City = sequelize.define('City', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  image: {
    type: DataTypes.STRING
  },
  latitude: {
    type: DataTypes.FLOAT
  },
  longitude: {
    type: DataTypes.FLOAT
  }
});

module.exports = City;
