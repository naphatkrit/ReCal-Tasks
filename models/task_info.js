var mongoose = require('mongoose');
var updatedStatusPlugin = require("./plugins/updated_status");
var ReCalLib = require("../lib/lib");
var TaskInfo;
(function (TaskInfo) {
    (function (TaskPrivacy) {
        TaskPrivacy[TaskPrivacy["Private"] = 0] = "Private";
        TaskPrivacy[TaskPrivacy["Public"] = 1] = "Public";
    })(TaskInfo.TaskPrivacy || (TaskInfo.TaskPrivacy = {}));
    var TaskPrivacy = TaskInfo.TaskPrivacy;
    ;
    function privacyInvariants(privacy) {
        var Invariants = ReCalLib.Invariants;
        return [
            Invariants.Predefined.isDefinedAndNotNull(privacy),
            function () {
                var name = TaskPrivacy[privacy];
                return name !== null || name !== undefined;
            }
        ].reduce(Invariants.chain, Invariants.Predefined.alwaysTrue);
    }
    var taskInfoSchema = new mongoose.Schema({
        _title: String,
        _description: String,
        _privacy: Number,
        _previousVersion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TaskInfo'
        },
        _taskGroup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TaskGroup'
        }
    });
    taskInfoSchema.virtual('title').get(function () {
        if (this._title === null || this._title === undefined) {
            return '';
        }
        return this._title;
    });
    taskInfoSchema.virtual('title').set(function (newValue) {
        ReCalLib.Invariants.check(ReCalLib.Invariants.Predefined.isDefinedAndNotNull(newValue));
        this._title = newValue;
    });
    taskInfoSchema.virtual('description').get(function () {
        if (this._description === null || this._description === undefined) {
            return '';
        }
        return this._description;
    });
    taskInfoSchema.virtual('description').set(function (newValue) {
        ReCalLib.Invariants.check(ReCalLib.Invariants.Predefined.isDefinedAndNotNull(newValue));
        this._description = newValue;
    });
    taskInfoSchema.virtual('privacy').get(function () {
        if (this._privacy === null || this._privacy === undefined) {
            return TaskPrivacy.Private;
        }
        ReCalLib.Invariants.check(privacyInvariants(this._privacy));
        return this._privacy;
    });
    taskInfoSchema.virtual('privacy').set(function (newValue) {
        ReCalLib.Invariants.check(privacyInvariants(newValue));
        this._privacy = newValue;
    });
    taskInfoSchema.virtual('previousVersion').get(function () {
        if (this._previousVersion === undefined) {
            return null;
        }
        return this._previousVersion;
    });
    taskInfoSchema.virtual('previousVersion').set(function (newValue) {
        this._previousVersion = newValue;
    });
    taskInfoSchema.virtual('taskGroup').get(function () {
        if (this._taskGroup === undefined || this._taskGroup === null) {
            return null;
        }
        return this._taskGroup;
    });
    taskInfoSchema.virtual('taskGroup').set(function (newValue) {
        ReCalLib.Invariants.check(ReCalLib.Invariants.Predefined.isDefinedAndNotNull(newValue));
        this._taskGroup = newValue;
    });
    taskInfoSchema.plugin(updatedStatusPlugin);
    TaskInfo.model = mongoose.model('TaskInfo', taskInfoSchema);
    function invariants(taskInfo) {
        var Invariants = ReCalLib.Invariants;
        return [
            privacyInvariants(taskInfo.privacy),
        ].reduce(Invariants.chain, Invariants.Predefined.alwaysTrue);
    }
    TaskInfo.invariants = invariants;
})(TaskInfo || (TaskInfo = {}));
module.exports = TaskInfo;
