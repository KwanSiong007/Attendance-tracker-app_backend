/* eslint-disable no-undef */
const cors = require("cors");
const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT;
const app = express();
// Enable CORS access to this server
app.use(cors());

// Enable reading JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// importing Routers
const WorksitesRouter = require("./src/routers/worksites.route");
const AttendanceReportsRouter = require("./src/routers/attendanceReports.route");
const WorkersRouter = require("./src/routers/workers.route");
const routers = [
  new WorksitesRouter(),
  new AttendanceReportsRouter(),
  new WorkersRouter(),
];
routers.forEach((router) => app.use("/", router.router));

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
