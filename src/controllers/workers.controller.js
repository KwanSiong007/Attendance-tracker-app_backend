const { Op } = require("sequelize");

class WorkersController {
  constructor(db) {
    this.db = db;
  }

  // Add new worker
  async addWorker(req, res) {
    const {
      workerName,
      userID,
      email,
      phone,
      worksite,
      department,
      workerShift,
    } = req.body;
    try {
      const newWorker = await this.db.workers.create({
        worker_name: workerName,
        user_id: userID,
        email: email,
        phone: phone,
        worksite: worksite,
        department: department,
        worker_shift: workerShift,
      });
      // Respond with new worker
      return res.json(newWorker);
    } catch (err) {
      console.log("error:", err);
      return res.status(400).json({ error: true, msg: err });
    }
  }

  //! Get worker details based on their userID
  async getWorker(req, res) {
    const { userID } = req.params;
    try {
      const output = await this.db.workers.findOne({
        where: {
          user_id: userID,
        },
      });
      return res.json(output);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}
module.exports = WorkersController;
