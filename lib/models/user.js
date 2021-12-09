const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String},
    username: {type: String},
});

userSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);

    expirationDate.setDate(today.getDate()+60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 100, 10)
    }, process.env.SECRET);
}

userSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        token: this.generateJWT()
    };
}

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

module.exports = User;

