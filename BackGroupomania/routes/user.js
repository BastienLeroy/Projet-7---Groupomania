const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');

const userCtrl = require('../controllers/user');

router.post('/update', multer, userCtrl.modifyUser);
router.delete('/delete', userCtrl.deleteUser);

module.exports = router;