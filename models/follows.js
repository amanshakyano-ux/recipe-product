const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Follow = sequelize.define("follow", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
module.exports = { Follow };
