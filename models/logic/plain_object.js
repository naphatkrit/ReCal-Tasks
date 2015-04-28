var assert = require('assert');
var Q = require('q');
var PromiseAdapter = require('../../lib/promise_adapter');
var PlainObject;
(function (PlainObject) {
    function convertTaskGroupInstance(taskGroup) {
        return Q.fcall(function () {
            assert(taskGroup !== null && taskGroup !== undefined);
            return {
                id: taskGroup.id,
                name: taskGroup.name
            };
        });
    }
    PlainObject.convertTaskGroupInstance = convertTaskGroupInstance;
    function convertTaskInfoInstance(taskInfo) {
        return Q.fcall(function () {
            assert(taskInfo !== null && taskInfo !== undefined);
        }).then(function () {
            return PromiseAdapter.convertMongoosePromise(taskInfo.populate('_taskGroup').execPopulate());
        }).then(function (taskInfo) {
            return convertTaskGroupInstance(taskInfo.taskGroup);
        }).then(function (taskGroupPlainObject) {
            return {
                id: taskInfo.id,
                title: taskInfo.title,
                description: taskInfo.description,
                privacy: taskInfo.privacy,
                taskGroup: taskGroupPlainObject
            };
        });
    }
    PlainObject.convertTaskInfoInstance = convertTaskInfoInstance;
    function convertTaskInstance(task) {
        return Q.fcall(function () {
            assert(task !== null && task !== undefined);
        }).then(function () {
            return PromiseAdapter.convertMongoosePromise(task.populate('_taskInfo').execPopulate());
        }).then(function (task) {
            return convertTaskInfoInstance(task.taskInfo);
        }).then(function (taskInfoPlainObject) {
            return {
                id: task.id,
                state: task.state,
                taskInfo: taskInfoPlainObject
            };
        });
    }
    PlainObject.convertTaskInstance = convertTaskInstance;
})(PlainObject || (PlainObject = {}));
module.exports = PlainObject;
