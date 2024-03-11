const { Op } = require("sequelize");
const cron = require("node-cron");

class AttendanceReportsController {
  constructor(db) {
    this.db = db;
  }

  async getAttendanceCurrDate(req, res) {
    const { userID, todaysDate } = req.params;
    try {
      // Previous date is 1 day before todaysDate
      const previousDate = new Date(todaysDate);
      previousDate.setDate(previousDate.getDate() - 2);

      //Btw SG time: 00:00a.m (previous date) and 11:59p.m (todays date)
      const startDate = new Date(
        previousDate.toISOString().split("T")[0] + "T16:00:00.000Z"
      );
      const endDate = new Date(todaysDate + "T15:59:59.999Z");

      const attendanceReport = await this.db.attendanceReports.findAll({
        where: {
          user_id: userID,
          check_in_time: {
            [Op.between]: [startDate, endDate],
          },
        },
      });
      return res.json(attendanceReport);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async writeCheckIn(req, res) {
    const {
      workerName,
      userID,
      worksite,
      department,
      workerShift,
      workday,
      checkInTime,
    } = req.body;

    try {
      // Convert checkInTime to a date object in Singapore's time zone (GMT+8)
      const checkInDateObject = new Date(checkInTime);
      console.log("checkInDateObject:", checkInDateObject);
      // Adjust for Singapore time by converting to Singapore's timezone
      const singaporeTimeZoneOffset =
        checkInDateObject.getTimezoneOffset() + 8 * 60; // Singapore is GMT+8
      console.log("singaporeTimeZoneOffset:", singaporeTimeZoneOffset);
      const singaporeDate = new Date(
        checkInDateObject.getTime() + singaporeTimeZoneOffset * 60 * 1000
      );
      console.log("singaporeDate:", singaporeDate);
      // Determine if the current time is within DayShift working hours (5AM -  4PM)
      const isDayShiftStartTime =
        singaporeDate.getHours() >= 5 && singaporeDate.getHours() <= 16;
      console.log("isDayShiftStartTime:", isDayShiftStartTime);

      // Determine if the current time is within NightShift working hours (5p.m and 4a.m)
      const isNightShiftStartTime =
        (singaporeDate.getHours() >= 17 && singaporeDate.getHours() < 24) ||
        (singaporeDate.getHours() >= 0 && singaporeDate.getHours() <= 4);
      console.log("isNightShiftStartTime:", isNightShiftStartTime);

      let remarks = "";
      if (isDayShiftStartTime) {
        // Retrieve the time dimensions for the check-in date
        const timeDimension = await this.db.micronNorthTimeDimensions.findOne({
          where: {
            full_date: workday,
          },
        });

        // Only compare and update remarks if workerShift and timeDimension.day_shift are different
        if (timeDimension && workerShift !== timeDimension.day_shift) {
          remarks = `Work OT in ${timeDimension.day_shift} shift`;
        }
      } else if (isNightShiftStartTime) {
        // Retrieve the time dimensions for the check-in date
        const timeDimension = await this.db.micronNorthTimeDimensions.findOne({
          where: {
            full_date: workday,
          },
        });

        // Only compare and update remarks if workerShift and timeDimension.night_shift are different
        if (timeDimension && workerShift !== timeDimension.night_shift) {
          remarks = `Work OT in ${timeDimension.night_shift} shift`;
        }
      }

      // Add new check-in time
      const newCheckIn = await this.db.attendanceReports.create({
        worker_name: workerName,
        user_id: userID,
        worksite: worksite,
        department: department,
        worker_shift: workerShift,
        workday: workday,
        check_in_time: checkInTime,
        remarks: remarks, // Set the remarks if needed
      });

      // Respond with new check-in time
      return res.json(newCheckIn);
    } catch (err) {
      console.log("error:", err);
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async writeCheckOut(req, res) {
    const { workerName, userID, department, workerShift, checkOutTime } =
      req.body;

    try {
      // Find the attendance report entry by userID where check_out_time is NULL
      const attendanceReport = await this.db.attendanceReports.findOne({
        where: {
          user_id: userID,
          check_out_time: null, // Add this condition to find records where check_out_time is NULL
        },
      });

      // Check if attendanceReport is found
      if (attendanceReport) {
        // Update the check_out_time for the found attendanceReport
        attendanceReport.check_out_time = checkOutTime;
        // Calculate the duration_worked
        // Assuming check_in_time is stored in the same format as checkOutTime (e.g., ISO string)
        const checkInTime = new Date(attendanceReport.check_in_time);
        //! Ex, in database, check_in_time is 2024-03-01 05:00:00.000 +0800. Convert check_in_time to UTC.
        checkInTime.setHours(checkInTime.getHours());
        //Ex, checkInTime: 2024-02-29T21:00:00.000Z
        console.log("checkInTime:", checkInTime);
        // Parse checkOutTime to a Date object, which is UTC format (it's already in Singapore time)
        const checkOutTimeDate = new Date(checkOutTime);
        // Ex, checkOutTimeDate: 2024-03-01T12:30:00.000Z
        console.log("checkOutTimeDate:", checkOutTimeDate);
        const durationWorked = Math.abs(checkOutTimeDate - checkInTime) / 60000; // Convert milliseconds to minutes
        console.log("durationWorked:", durationWorked);
        // Update the duration_worked
        attendanceReport.duration_worked = Math.round(durationWorked); // Round to the nearest minute
        await attendanceReport.save();

        return res.json(attendanceReport);
      } else {
        // Handle case where no matching attendance report entry is found
        return res.status(404).json({
          error: true,
          msg: "No matching attendance report entry found with check_out_time as NULL.",
        });
      }
    } catch (err) {
      console.log("error:", err);
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getAll(req, res) {
    try {
      const output = await this.db.attendanceReports.findAll();
      return res.json(output);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = AttendanceReportsController;
