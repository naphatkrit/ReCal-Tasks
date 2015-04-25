import mongoose = require('mongoose');

module Models
{
    mongoose.connect(process.env.DATABASE_URL);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    export var connection = db;
}

export = Models;
