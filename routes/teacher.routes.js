var express = require("express");
var router = express.Router();
const teacher = require("../controllers/teacher.controllers");
var auth = require("../middlewares/auth.middlewares");

router.get("/teachers/", auth.roles("REP ADMIN"), teacher.findAll);
router.post("/addTeacher/", auth.roles("REP ADMIN"), teacher.create);
router.put("/teacher/:id", auth.roles("REP ADMIN"), teacher.updateOne);
router.delete("/teacher/:id", auth.roles("REP ADMIN"), teacher.deleteOne);

module.exports = router;
