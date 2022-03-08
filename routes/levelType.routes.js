var express = require('express');
var router = express.Router();
const levelType = require('../controllers/levelType.controllers');
var auth = require('../middlewares/auth.middlewares');

router.get('/levelTypes/', levelType.findAll);
router.get('/sectionLevelTypes/:id', levelType.findAllBySectionId);
router.post('/addLevelType/', auth.roles('REP'), levelType.create);
router.get('/levelType/:id', levelType.findOne);
router.put('/levelType/:id', auth.roles('REP'), levelType.updateOne);
router.delete('/levelType/:id', auth.roles('REP'), levelType.deleteOne);

module.exports = router;
