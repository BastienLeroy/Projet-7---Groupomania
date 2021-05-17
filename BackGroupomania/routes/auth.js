const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth');

router.get('/checklogged', authCtrl.checklogged);
router.get('/disconnect', authCtrl.disconnect);
router.post('/signup', authCtrl.signup);
router.post('/signin', authCtrl.signin);

module.exports = router;