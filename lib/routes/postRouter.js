const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');

router.post('/post', postController.addPost);
router.get('/posts', postController.getPosts);
router.get('/post/:id', postController.getPost);

module.exports = router;