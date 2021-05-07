const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');
const auth = require('../controllers/auth');

const postCtrl = require('../controllers/post');

router.get('/getAllPosts', postCtrl.getAllPosts);
router.post('/createPost', multer, postCtrl.createPost);

module.exports = router;