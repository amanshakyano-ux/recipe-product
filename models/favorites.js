const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db-connection")
const Favorite = sequelize.define("favorite",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    }
})

module.exports = {Favorite}