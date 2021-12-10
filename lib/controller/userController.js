const User = require('../models/user');
const passport = require('passport');
const validateForm = require('../utils/formValidation');

function register(req, res) {
    const reqUser = new User({username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName});
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
    }
    validateForm(user, res);

    User.findOne({username: reqUser.username}, function (err, user) {
        if (!err) {
            if (user) {
                return res.status(400).json({
                    errors: {
                        success: false,
                        error: 'Email already in use'
                    }
                });
            }
            //Save user and hash password with salt
            User.register(reqUser, req.body.password, (err, resUser) => {
                if (!err) {
                    return res.json({user: resUser.toAuthJSON()})
                }
                return err;
            })
        }
    });
}

function login(req, res, next) {
    const user = {
        username: req.body.username,
        password: req.body.password
    };

    validateForm(user, res);

    return passport.authenticate('local', {session: false}, (err, resUser, info) => {
        if (!err) {
            if (resUser) {
                const user = resUser;
                user.token = resUser.generateJWT();

                return res.json({user: user.toAuthJSON()})
            }
            return res.status(400).json({
                errors: {
                    success: false,
                    error: 'Email or password invalid'
                }
            });
        }
        return next(err);
    })(req, res, next);
}

module.exports = {register, login};