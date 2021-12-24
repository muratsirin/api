const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        title: String,
        content: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }]
    }, {timestamps: true},
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;