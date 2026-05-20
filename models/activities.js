const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Activity = sequelize.define("activity", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { Activity };
