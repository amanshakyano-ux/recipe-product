const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const RecipeCategory = sequelize.define("recipeCategory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = { RecipeCategory };