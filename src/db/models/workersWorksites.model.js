const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WorkersWorksites extends Model {
    static associate(models) {
      this.belongsTo(models.workers);
      this.belongsTo(models.worksites);
    }
  }

  WorkersWorksites.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      worker_id: {
        references: {
          model: "workers",
          key: "id",
        },
        type: DataTypes.INTEGER,
      },
      worksite_id: {
        references: {
          model: "worksites",
          key: "id",
        },
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "workersWorksites",
      underscored: true,
      paranoid: true,
    }
  );
  return WorkersWorksites;
};
