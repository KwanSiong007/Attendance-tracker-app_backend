const { Router } = require("express");
const WorksitesController = require("../controllers/worksites.controller");
const db = require("../db/models/index");

class WorksitesRouter {
  path = "/worksites";
  router = Router();
  controller = new WorksitesController(db);

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes = () => {
    this.router.get(
      `${this.path}/`,
      this.controller.getAll.bind(this.controller)
    );
  };
}
module.exports = WorksitesRouter;
