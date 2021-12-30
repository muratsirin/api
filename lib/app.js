require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const database = require('../database/index');
const userRouter = require('../lib/routes/userRouter');
const postRouter = require('../lib/routes/postRouter');
const session = require('express-session');
const passport = require('passport');
const User = require('../lib/models/user');

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(User.authenticate()));
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

database.on('error', console.error.bind(console, 'MongoDB connection error'));

app.use('/api', userRouter, postRouter);

app.listen(3000, function () {
    console.log('Server started at port 3000');
});