var express = require("express");
var router = express.Router();
const masterSheetMarks = require("../controllers/masterSheetMarks.controllers");
var auth = require("../middlewares/auth.middlewares");

router.get("/masterSheetMarks/", masterSheetMarks.findAll);
router.get("/documentsMarks/", masterSheetMarks.findAllForDocuments);
router.get("/markStatus/", masterSheetMarks.findAllMarkStatus);
router.post("/addMasterSheetMark/", auth.roles("REP"), masterSheetMarks.create);
router.post("/addMultiMark/", auth.roles("REP"), masterSheetMarks.multiCreate);
router.get("/masterSheetMark/:id", masterSheetMarks.findOne);
router.put(
  "/masterSheetMark/:id",
  auth.roles("REP"),
  masterSheetMarks.updateOne,
);
router.put("/multipleMarks", auth.roles("REP"), masterSheetMarks.multiUpdate);
router.delete(
  "/masterSheetMark/:id",
  auth.roles("REP"),
  masterSheetMarks.deleteOne,
);

module.exports = router;
