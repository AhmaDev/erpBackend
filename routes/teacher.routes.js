var express = require("express");
var router = express.Router();
const teacher = require("../controllers/teacher.controllers");
var auth = require("../middlewares/auth.middlewares");

router.get("/teachers/", teacher.findAll);
router.post("/addTeacher/", auth.roles("REP"), teacher.create);
router.put("/teacher/:id", auth.roles("REP"), teacher.updateOne);
router.delete("/teacher/:id", auth.roles("REP"), teacher.deleteOne);

module.exports = router;
