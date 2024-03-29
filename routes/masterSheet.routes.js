var express = require("express");
var router = express.Router();
const masterSheet = require("../controllers/masterSheet.controllers");
var auth = require("../middlewares/auth.middlewares");

router.get("/masterSheets/", masterSheet.findAll);
router.get("/teacherMasterSheets/:id", masterSheet.findAllTeacherMasterSheets);
router.post("/addMasterSheet/", auth.roles("REP"), masterSheet.create);
router.get("/masterSheet/:id", masterSheet.findOne);
router.get("/documents", masterSheet.findDocumentStudents);
router.get("/sectionMasterSheets/:id", masterSheet.findBySectionId);
router.get("/masterSheetTypes/", masterSheet.findAllMasterSheetTypes);
router.put("/masterSheet/:id", auth.roles("REP"), masterSheet.updateOne);
router.delete("/masterSheet/:id", auth.roles("REP"), masterSheet.deleteOne);

module.exports = router;
