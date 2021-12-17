const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');

router.post('/post', postController.addPost);
router.post('/post/:id', postController.addComment);
router.get('/posts', postController.getPosts);
router.get('/post/:id', postController.getPost);
router.get('/post/comments/:id', postController.getPostWithComments);

module.exports = router;