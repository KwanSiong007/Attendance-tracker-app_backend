const { Router } = require("express");
const AttendanceReportsController = require("../controllers/attendanceReports.controller");
const db = require("../db/models/index");

class AttendanceReportsRouter {
  path = "/attendance";
  router = Router();
  controller = new AttendanceReportsController(db);

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes = () => {
    this.router.get(
      `${this.path}/getAttendanceCurrDate/:userID/:todaysDate`,
      this.controller.getAttendanceCurrDate.bind(this.controller)
    );
    this.router.post(
      `${this.path}/writeCheckIn`,
      this.controller.writeCheckIn.bind(this.controller)
    );
    this.router.post(
      `${this.path}/writeCheckOut`,
      this.controller.writeCheckOut.bind(this.controller)
    );
    this.router.get(
      `${this.path}/`,
      this.controller.getAll.bind(this.controller)
    );
  };
}
module.exports = AttendanceReportsRouter;
