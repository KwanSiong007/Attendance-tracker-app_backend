"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MicronNorthTimeDimension extends Model {
    static associate(models) {}
  }
  MicronNorthTimeDimension.init(
    {
      time_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      full_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      day: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      day_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      day_shift: {
        type: DataTypes.CHAR(1),
        validate: {
          isIn: [["A", "C"]],
        },
      },
      day_start_time: {
        type: DataTypes.DATE,
      },
      day_end_time: {
        type: DataTypes.DATE,
      },
      night_shift: {
        type: DataTypes.CHAR(1),
        validate: {
          isIn: [["B", "D"]],
        },
      },
      night_start_time: {
        type: DataTypes.DATE,
      },
      night_end_time: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "micronNorthTimeDimensions",
      underscored: true,
    }
  );
  return MicronNorthTimeDimension;
};
