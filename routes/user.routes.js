var express = require("express");
var router = express.Router();
const user = require("../controllers/user.controllers");
var auth = require("../middlewares/auth.middlewares");

router.get("/users/", auth.roles("REP ADMIN"), user.findAll);
router.post("/addUser/", auth.roles("REP ADMIN"), user.create);
router.post("/login", user.login);
router.post("/refreshInfo", user.refreshInfo);
router.get("/user/:id", user.findOne);
router.get("/settings/", user.findSettings);
router.put("/user/:id", auth.roles("REP ADMIN"), user.updateOne);
router.delete("/user/:id", auth.roles("REP ADMIN"), user.deleteOne);

module.exports = router;
