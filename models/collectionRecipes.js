const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const CollectionRecipe = sequelize.define("collectionRecipe", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});
module.exports = { CollectionRecipe };
