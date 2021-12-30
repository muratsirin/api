const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');
const upload = require("../utils/upload");

router.post('/post', upload.single('image'),postController.addPost);
router.post('/post/comment/:id', postController.addComment);
router.get('/posts', postController.getPosts);
router.get('/post/:id', postController.getPost);

module.exports = router;