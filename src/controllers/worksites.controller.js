const { Op } = require("sequelize");

class WorksitesController {
  constructor(db) {
    this.db = db;
  }

  async getAll(req, res) {
    try {
      const output = await this.db.worksites.findAll();
      return res.json(output);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}
module.exports = WorksitesController;
