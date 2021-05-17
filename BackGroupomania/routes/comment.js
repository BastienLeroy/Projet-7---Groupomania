const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comment');


router.get('/getAllComments', commentCtrl.getAllComments);
router.post('/createComment', commentCtrl.createComment);
router.put('/modifyComment', commentCtrl.modifyComment);
router.delete('/deleteComment', commentCtrl.deleteComment)

module.exports = router;