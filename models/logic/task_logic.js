var assert = require('assert');
var mongoose = require('mongoose');
var Q = require('q');
var PromiseAdapter = require('../../lib/promise_adapter');
var PlainObject = require('./plain_object');
var TaskInfo = require('../task_info');
var TaskGroup = require('../task_group');
var TaskLogic;
(function (TaskLogic) {
    function createTaskInfo(taskInfoPlainObject) {
        return Q.fcall(function () {
            assert(taskInfoPlainObject !== null && taskInfoPlainObject !== undefined);
            assert(taskInfoPlainObject.id === null || taskInfoPlainObject.id === undefined);
        }).then(function () {
            return PromiseAdapter.convertMongooseQuery(TaskGroup.model.count({
                _id: mongoose.Types.ObjectId(taskInfoPlainObject.taskGroup.id),
                _name: taskInfoPlainObject.taskGroup.name
            })).then(function (count) { assert(count > 0, "Task Group Plain Object must correspond to a valid Task Group instance."); });
        }).then(function () {
            var taskInfo = new TaskInfo.model({
                _title: taskInfoPlainObject.title,
                _description: taskInfoPlainObject.description,
                _privacy: taskInfoPlainObject.privacy,
                _taskGroup: mongoose.Types.ObjectId(taskInfoPlainObject.taskGroup.id),
            });
            return PromiseAdapter.convertMongooseDocumentSave(taskInfo);
        }).then(function (taskInfo) {
            return PlainObject.convertTaskInfoInstance(taskInfo);
        });
    }
    TaskLogic.createTaskInfo = createTaskInfo;
    function updateTaskInfo(taskInfoPlainObject) {
        return Q.fcall(function () {
            assert(taskInfoPlainObject !== null && taskInfoPlainObject !== undefined);
            assert(taskInfoPlainObject.id !== null && taskInfoPlainObject.id !== undefined);
        }).then(function () {
            return PromiseAdapter.convertMongooseQuery(TaskGroup.model.count({
                _id: mongoose.Types.ObjectId(taskInfoPlainObject.taskGroup.id),
                _name: taskInfoPlainObject.taskGroup.name
            })).then(function (count) { assert(count > 0, "Task Group Plain Object must correspond to a valid Task Group instance."); });
        }).then(function () {
            return PromiseAdapter.convertMongooseQuery(TaskInfo.model.findById(taskInfoPlainObject.id));
        }).then(function (taskInfo) {
            taskInfo.title = taskInfoPlainObject.title;
            taskInfo.description = taskInfoPlainObject.description;
            taskInfo.privacy = taskInfoPlainObject.privacy;
            taskInfo.taskGroup = mongoose.Types.ObjectId(taskInfoPlainObject.taskGroup.id);
            return PromiseAdapter.convertMongooseDocumentSave(taskInfo);
        }).then(function (taskInfo) {
            return PlainObject.convertTaskInfoInstance(taskInfo);
        });
    }
    TaskLogic.updateTaskInfo = updateTaskInfo;
    function createTask(taskPlainObject) {
        return null;
    }
    TaskLogic.createTask = createTask;
})(TaskLogic || (TaskLogic = {}));
module.exports = TaskLogic;
