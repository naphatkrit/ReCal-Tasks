var mongoose = require('mongoose');
var _task = require('./task');
var _taskGroup = require('./task_group');
var _taskInfo = require('./task_info');
var _user = require('./user');
var Models;
(function (Models) {
    mongoose.connect(process.env.DATABASE_URL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    Models.connection = db;
    Models.Task = _task;
    Models.TaskGroup = _taskGroup;
    Models.TaskInfo = _taskInfo;
    Models.User = _user;
})(Models || (Models = {}));
module.exports = Models;
