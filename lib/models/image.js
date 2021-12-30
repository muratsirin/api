const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imagesSchema = new Schema({
    img: {
        data: Buffer,
        contentType: String,
    },
},{timestamps: true});

const Image = mongoose.model('Image', imagesSchema);

module.exports = Image;