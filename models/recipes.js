const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");
const Recipe = sequelize.define("recipe", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.TEXT,
  },
  instructions: {
    type: DataTypes.TEXT,
  },
  cookingTime: {
    type: DataTypes.INTEGER,
  },
  servings: {
    type: DataTypes.STRING,
  },
  difficulty: {
    type: DataTypes.STRING,
  },
  dietType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING
  },
  prepTime: {
    type: DataTypes.INTEGER,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = {Recipe};