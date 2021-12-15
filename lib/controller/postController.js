const Post = require('../models/post');

function addPost(req, res) {
    const reqPost = req.body;
    const post = new Post(reqPost);

    post.save((err, post) => {
        if (!err) {
            return res.status(201).json({
                success: true,
                message: 'Post successfully saved',
                post: post
            });
        }
        return res.status(400).json({
            success: false,
            error: err,
        });
    });
}

function getPosts(req, res) {
    Post.find({}, (err, posts) => {
        if (!err) {
            if (!posts.length) {
                return res.status(404).json({
                    success: false,
                    error: 'Posts not found'
                });
            }
            return res.status(200).json({
                success: true,
                posts: posts,
            });
        }
        return res.status(400).json({
            success: false,
            error: err,
        });
    });
}

function getPost(req, res) {
    const id = req.params.id;

    Post.findById(id, (err, post) => {
        if (!err) {
            if (!post) {
                return res.status(404).json({
                    success: false,
                    error: 'Post not found'
                });
            }
            return res.status(200).json({
                success: true,
                post: post,
            });
        }
        return res.status(400).json({
            success: false,
            error: err,
        });
    });
}

module.exports = {addPost, getPosts, getPost};