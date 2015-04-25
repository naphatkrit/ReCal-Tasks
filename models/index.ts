import mongoose = require('mongoose');

import _task = require('./task');
import _taskGroup = require('./task_group');
import _taskInfo = require('./task_info');
import _user = require('./user');

module Models
{
    mongoose.connect(process.env.DATABASE_URL);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    export var connection = db;
    export var Task = _task;
    export var TaskGroup = _taskGroup;
    export var TaskInfo = _taskInfo;
    export var User = _user;
}

export = Models;
