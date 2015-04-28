var mongoose = require('mongoose');
var Models;
(function (Models) {
    mongoose.connect(process.env.DATABASE_URL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
    });
    Models.connection = db;
})(Models || (Models = {}));
module.exports = Models;
