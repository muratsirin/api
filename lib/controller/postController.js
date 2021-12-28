const Post = require('../models/post');
const Comment = require('../models/comment');

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

function addComment(req, res) {
    const postId = req.params.id;
    const reqComment = req.body;
    const comment = new Comment(reqComment);

    comment.save((err, resComment) => {
        if (!err) {
            Post.findByIdAndUpdate(postId, {$push: {comments: resComment._id}}).then(post => {
                return res.status(201).json({
                    success: true,
                    message: 'Comment successfully saved',
                    post: post,
                });
            }).catch(error => {
                return res.status(400).json({
                    success: false,
                    error: error,
                });
            });
        } else {
            return res.status(400).json({
                success: false,
                error: err,
            });
        }
    });
}

function getPost(req, res) {
    const postId = req.params.id;

    Post.findOne({_id: postId}).populate(
        [
            {
                path: 'user', select: ['firstName', 'lastName']
            },
            {
                path: 'comments',
                populate: {
                    path: 'user', select: ['firstName', 'lastName'],
                },
            }
        ]
    ).exec((err, post) => {
        if (!err) {
            return res.status(200).json({
                success: true,
                post: post,
            });
        }
        return res.status(404).json({
            success: false,
            error: 'Post not found ' + err,
        });
    });
}

module.exports = {addPost, getPosts, getPost, addComment};