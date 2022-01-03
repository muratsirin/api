const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blogpostAppDB').catch(e => {
    console.error('Database connection error', e.message);
});

const database = mongoose.connection;

module.exports= database;