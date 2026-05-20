const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Collection = sequelize.define("collection", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = { Collection };
