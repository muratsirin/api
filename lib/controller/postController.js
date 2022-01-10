const Post = require('../models/post');
const Comment = require('../models/comment');
const Image = require('../models/image');
const path = require('node:path');
const dirname = path.dirname;
const appDir = dirname(require.main.filename);
const fs = require("node:fs");

const populate = () => {
    return [
        {
            path: 'user', select: ['firstName', 'lastName']
        },
        {
            path: 'comments',
            populate: {
                path: 'user', select: ['firstName', 'lastName'],
            },
        },
        {
            path: 'image', select: 'img'
        }
    ];
}

function addPost(req, res) {
    const post = req.body;

    if (req.file) {
        const img = {
            data: fs.readFileSync(path.join(appDir + '/images/' + req.file.filename)),
            contentType: req.file.mimetype
        };
        Image.create({img: img}).then(image => {
            post.image = image._id;
            Post.create(post).then(post => {
                return res.status(201).json({
                    success: true,
                    message: 'Post successfully saved',
                    post: post
                });
            }).catch(error=>{
                return res.status(400).json({
                    success: false,
                    error: error,
                });
            });
        }).catch(error=>{
            return res.status(400).json({
                success: false,
                error: error,
            });
        });
    }else{
        Post.create(post).then(post=>{
            return res.status(201).json({
                success: true,
                message: 'Post successfully saved',
                post: post
            });
        }).catch(error=>{
            return res.status(400).json({
                success: false,
                error: error,
            });
        });
    }
}

function getPosts(req, res) {
    Post.find({}).sort('-updatedAt').find().populate([{path: 'user', select: ['firstName', 'lastName']}, {
        path: 'image',
        select: 'img'
    }]).then(posts => {
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
    }).catch(error => {
        return res.status(400).json({
            success: false,
            error: error,
        });
    });
}

function addComment(req, res) {
    const comment = req.body;
    const postID = req.params.id;

    Comment.create(comment).then(comment => {
        Post.findByIdAndUpdate(postID, {$push: {comments: comment._id}}, {new: true}).populate(populate()).then(post => {
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
    }).catch(error=>{
        return res.status(400).json({
            success: false,
            error: error,
        });
    });
}

function getPost(req, res) {
    const postID = req.params.id;

    Post.findOne({_id: postID}).populate(populate()).then(post=>{
        return res.status(200).json({
            success: true,
            post: post,
        });
    }).catch(error=>{
        return res.status(404).json({
            success: false,
            error: 'Post not found ' + error,
        });
    });
}

module.exports = {addPost, getPosts, getPost, addComment};