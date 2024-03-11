//1 TO M btw worksites and attendance report
//1 row of attendance report belong to each worksite
//Each worksite have many rows of attendance report
//CREATE FOREIGN ID of worksite in table
//1 TO M btw worker and attendance report
//CREATE FOREIGN ID of worker in table
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AttendanceReport extends Model {
    static associate(models) {
      // modify associate method to include an alias for the worksites association
      //By adding as: "worksites" to the belongsTo association with models.worksites, you're specifying that the associated worksites instances can be accessed through a property named worksites on the AttendanceReport instances, thus avoiding the naming collision
      this.belongsTo(models.worksites, {
        foreignKey: "worksite_id",
        as: "worksites",
      });
      this.belongsTo(models.workers, { foreignKey: "worker_id" });
    }
  }
  //worker name, user id, worksite, department, worker_shift (A), check in time, check out time, duration worked, remarks, total working days per month
  AttendanceReport.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      worksite_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "worksites",
          key: "id",
        },
      },
      worker_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "workers",
          key: "id",
        },
      },
      worker_name: { type: DataTypes.STRING(255) },
      user_id: { type: DataTypes.STRING(255) },
      worksite: { type: DataTypes.STRING(255) },
      department: { type: DataTypes.STRING(255) },
      worker_shift: { type: DataTypes.STRING(255) },
      workday: { type: DataTypes.DATE },
      check_in_time: { type: DataTypes.DATE },
      check_out_time: { type: DataTypes.DATE },
      // storing such formatted strings directly like "4hours30min" in the database might not be the most efficient approach for querying and calculations.
      duration_worked: { type: DataTypes.INTEGER }, // Duration in minutes
      remarks: { type: DataTypes.STRING(255) },
      total_working_days_per_month: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "attendanceReports",
      underscored: true,
    }
  );
  return AttendanceReport;
};
