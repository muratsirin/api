const User = require('../models/user');
const passport = require('passport');

function register(req, res) {
    reqUser = new User({username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName});

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
module.exports = {register, login, getUser};