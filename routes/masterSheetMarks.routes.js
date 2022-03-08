var express = require('express');
var router = express.Router();
const masterSheetMarks = require('../controllers/masterSheetMarks.controllers');
var auth = require('../middlewares/auth.middlewares');

router.get('/masterSheetMarks/', masterSheetMarks.findAll);
router.post('/addMasterSheetMark/', auth.roles('REP'), masterSheetMarks.create);
router.get('/masterSheetMark/:id', masterSheetMarks.findOne);
router.put('/masterSheetMark/:id', auth.roles('REP'), masterSheetMarks.updateOne);
router.delete('/masterSheetMark/:id', auth.roles('REP ADMIN'), masterSheetMarks.deleteOne);

module.exports = router;
