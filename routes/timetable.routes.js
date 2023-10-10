var express = require("express");
var router = express.Router();
const user = require("../controllers/user.controllers");
var auth = require("../middlewares/auth.middlewares");
const connection = require("../helpers/db.config");

router.get("/timetables", (req, res) => {
  connection.query(
    `SELECT * FROM studyTable.scheduleData LEFT JOIN studyTable.schedule ON studyTable.scheduleData.scheduleId = studyTable.schedule.idSchedule`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.send(result);
      }
    },
  );
});
router.get("/allTimeTables", (req, res) => {
  connection.query(`SELECT * FROM studyTable.allTimeTable`, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.send(result);
    }
  });
});
router.delete("/allTimeTables/:sectionId", (req, res) => {
  connection.query(
    `DELETE FROM studyTable.allTimeTable WHERE sectionId = ${req.params.sectionId}`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.send(result);
      }
    },
  );
});

router.post("/timetables", (req, res) => {
  let sectionId = req.body.sectionId;
  connection.query(
    `DELETE FROM studyTable.allTimeTable WHERE sectionId = ${sectionId}`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        let body = req.body.allTimeTable.map((e) => [
          e.time,
          e.lessonId,
          e.studyClass,
          e.day,
          e.teacherId,
          e.hallId,
          e.hallName,
          e.level,
          e.sectionId,
          e.studyType,
          e.tableData,
        ]);

        connection.query(
          `INSERT IGNORE INTO studyTable.allTimeTable (time,lessonId,studyClass,day,teacherId,hallId,hallName,level,sectionId,studyType,tableData) VALUES ?`,
          [body],
          (err, result) => {
            if (err) {
              console.log(err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          },
        );
      }
    },
  );
});

module.exports = router;
