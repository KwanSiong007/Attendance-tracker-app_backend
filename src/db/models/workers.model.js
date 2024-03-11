//MANY TO MANY R BTW WORKSITE AND WORKER
//1 TO M btw worker and attendance report
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Worker extends Model {
    static associate(models) {
      this.belongsToMany(models.worksites, {
        through: models.workersWorksites,
        key: "worker_id",
      });
      this.hasMany(models.attendanceReports, { foreignKey: "worker_id" });
    }
  }
  Worker.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      worker_name: { type: DataTypes.STRING(255) },
      user_id: { type: DataTypes.STRING(255) },
      email: {
        type: DataTypes.STRING(255),
      },
      phone: { type: DataTypes.STRING(255) },
      cookies: { type: DataTypes.STRING(255) },
      worksite: { type: DataTypes.STRING(255) },
      department: { type: DataTypes.STRING(255) },
      worker_shift: { type: DataTypes.STRING(255) },
    },
    {
      sequelize,
      modelName: "workers",
      underscored: true,
    }
  );
  return Worker;
};
