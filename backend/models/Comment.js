const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Comment = sequelize.define('Comment', {
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
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

module.exports = Comment;
