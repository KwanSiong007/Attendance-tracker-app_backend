const { Router } = require("express");
const WorkersController = require("../controllers/workers.controller");
const db = require("../db/models/index");

class WorkersRouter {
  path = "/workers";
  router = Router();
  controller = new WorkersController(db);

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes = () => {
    this.router.post(
      `${this.path}/add`,
      this.controller.addWorker.bind(this.controller)
    );
    this.router.get(
      `${this.path}/:userID`,
      this.controller.getWorker.bind(this.controller)
    );
  };
}
module.exports = WorkersRouter;
