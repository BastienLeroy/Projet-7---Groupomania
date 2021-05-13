const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');

const postCtrl = require('../controllers/post');

router.get('/getAllPosts', postCtrl.getAllPosts);
router.post('/createPost', multer, postCtrl.createPost);
router.put('/modifyPost', multer, postCtrl.modifyPost);
router.delete('/deletePost', postCtrl.deletePost);

module.exports = router; 