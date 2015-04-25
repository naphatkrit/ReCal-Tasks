var mongoose = require('mongoose');
var ReCalLib = require("../lib/lib");
var updatedStatusPlugin = require("./plugins/updated_status");
var User;
(function (User) {
    var userSchema = new mongoose.Schema({
        _username: String,
        _taskGroups: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'TaskGroup'
            }],
        _tasks: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Task'
            }]
    }, {
        autoIndex: process.env.NODE_ENV === 'development',
    });
    userSchema.virtual('username').get(function () {
        if (this._username === undefined || this._username === null) {
            return "";
        }
        return this._username;
    });
    userSchema.virtual('tasks').get(function () {
        if (this._tasks === undefined || this._tasks === null) {
            return [];
        }
        return this._tasks;
    });
    userSchema.virtual('tasks').set(function (newValue) {
        ReCalLib.Invariants.check(ReCalLib.Invariants.Predefined.isDefinedAndNotNull(newValue));
        this._tasks = newValue;
    });
    userSchema.virtual('taskGroups').get(function () {
        if (this._taskGroups === undefined || this._taskGroups === null) {
            return [];
        }
        return this._taskGroups;
    });
    userSchema.virtual('taskGroups').set(function (newValue) {
        ReCalLib.Invariants.check(ReCalLib.Invariants.Predefined.isDefinedAndNotNull(newValue));
        this._taskGroups = newValue;
    });
    userSchema.plugin(updatedStatusPlugin);
    User.model = mongoose.model('User', userSchema);
    function invariants(userId) {
        var Invariants = ReCalLib.Invariants;
        return ReCalLib.PromiseAdapter.convertMongooseQuery(User.model.findById(userId).populate('_taskGroups _tasks')).then(function (user) {
            return ReCalLib.PromiseAdapter.convertMongoosePromise(mongoose.model('TaskGroup').populate(user, { path: '_taskGroups._taskInfo' }));
        }).then(function (user) {
            return [
                Invariants.Predefined.isNotEmpty(user.username),
                function () {
                    return user.tasks.map(function (task) {
                        var filtered = user.taskGroups.filter(function (group) { group.id === task.taskInfo.id; });
                        return filtered.length > 0;
                    }).reduce(function (x, y) { x && y; }, true);
                }
            ].reduce(Invariants.chain, Invariants.Predefined.alwaysTrue);
        });
    }
    User.invariants = invariants;
})(User || (User = {}));
module.exports = User;
