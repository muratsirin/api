const User = require('../models/user');
const passport = require('passport');
const validateForm = require('../utils/formValidation');

function register(req, res) {
    const reqUser = req.body;
    validateForm(reqUser, res);

    User.findOne({username: reqUser.username}).then(user => {
        if (user) {
            return res.status(400).json({
                errors: {
                    success: false,
                    error: 'Email already in use'
                }
            });
        }
        //Save user and hash password with salt
        User.register(reqUser, reqUser.password).then(user => {
            return res.json({user: user.toAuthJSON()});
        }).catch(error => {
            return res.status(400).json({
                errors: {
                    success: false,
                    error: error
                }
            });
        });
    }).catch(error => {
        return res.status(400).json({
            errors: {
                success: false,
                error: error
            }
        });
    });
}

function login(req, res, next) {
    const user = req.body;
    validateForm(user, res);

    return passport.authenticate('local', {session: false}, (err, user) => {
        if (!err) {
            if (user) {
                user.token = user.generateJWT();
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