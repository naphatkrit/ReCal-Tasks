var helper = require("./helper");
var models = require("../index");
var ReCalLib = require("../../lib/lib");
var Q = require('q');
var PromiseAdapter = ReCalLib.PromiseAdapter;
var TaskLogic;
(function (TaskLogic) {
    function exportTaskGroup(taskGroupModel) {
        return Q.fcall(function () {
            return {
                id: taskGroupModel.getDataValue('id'),
                name: taskGroupModel.getDataValue('name')
            };
        });
    }
    TaskLogic.exportTaskGroup = exportTaskGroup;
    function exportTaskInfo(taskInfoModel) {
        return taskInfoModel.getTaskGroup()
            .then(exportTaskGroup)
            .then(function (taskGroupObject) {
            return {
                id: taskInfoModel.getDataValue('id'),
                title: taskInfoModel.getDataValue('title'),
                privacy: taskInfoModel.getDataValue('privacy'),
                taskGroup: taskGroupObject
            };
        });
    }
    TaskLogic.exportTaskInfo = exportTaskInfo;
    function exportTask(taskModel) {
        var taskInfoPromise = PromiseAdapter.convertSequelize(taskModel.getTaskInfo());
        var userPromise = PromiseAdapter.convertSequelize(taskModel.getUser());
        return Q.spread([taskInfoPromise, userPromise], function (taskInfoModel, userModel) {
            return exportTaskInfo(taskInfoModel).then(function (taskInfoObject) {
                return {
                    id: taskModel.getDataValue('id'),
                    userId: userModel.getDataValue('id'),
                    status: taskModel.getDataValue('status'),
                    taskInfo: taskInfoObject
                };
            });
        });
    }
    TaskLogic.exportTask = exportTask;
    function createTask(taskObject) {
        return helper.modelInstanceExists(models.TaskGroup, taskObject.taskInfo.taskGroup.id)
            .then(function (exists) {
            if (!exists) {
                throw new Error("Task Group with ID " + taskObject.taskInfo.taskGroup.id + " does not exist.");
            }
            return helper.modelInstanceExists(models.User, taskObject.userId);
        }).then(function (exists) {
            if (!exists) {
                throw new Error("User with ID " + taskObject.userId + " does not exist.");
            }
        }).then(function () {
            if (taskObject.id !== null && taskObject.id !== undefined) {
                throw new Error("Task ID cannot exist when trying to create a task.");
            }
            if (taskObject.taskInfo.id !== null && taskObject.taskInfo.id !== undefined) {
                throw new Error("Task Info ID cannot exist when trying to create a task.");
            }
        }).then(function () {
            return PromiseAdapter.convertSequelize(models.TaskGroup.find(taskObject.taskInfo.taskGroup.id));
        }).then(function (taskGroupModel) {
            return PromiseAdapter.convertSequelize(models.TaskInfo.create({
                title: taskObject.taskInfo.title,
                privacy: taskObject.taskInfo.privacy,
                TaskGroupId: taskGroupModel.id
            }));
        }).then(function (taskInfoModel) {
            return PromiseAdapter.convertSequelize(models.Task.create({
                status: taskObject.status,
                TaskInfoId: taskInfoModel.id,
                UserId: taskObject.userId
            }));
        }).then(exportTask);
    }
    TaskLogic.createTask = createTask;
})(TaskLogic || (TaskLogic = {}));
module.exports = TaskLogic;
