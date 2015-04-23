var assert = require('assert');
var logic = require('../models/logic/index');
var models = require("../models/index");
var ReCalLib = require("../lib/lib");
var Q = require('q');
function createTestUser() {
    return ReCalLib.PromiseAdapter.convertSequelize(models.User.create({
        username: "test_user",
    }));
}
function createTaskGroup() {
    return ReCalLib.PromiseAdapter.convertSequelize(models.TaskGroup.create({
        name: "test_group",
    }));
}
function destroyTestUser(testUserModel) {
    return logic.destroyModelInstance(models.User, testUserModel);
}
describe('Task Model Logic Testing', function () {
    describe('createTask() Unit Tests', function () {
        it('Should not accept objects with task ID', function (done) {
            Q.spread([createTestUser(), createTaskGroup()], function (testUserModel, taskGroupModel) {
                logic.Task.createTask({
                    id: 1234,
                    userId: testUserModel.getDataValue('id'),
                    status: 'complete',
                    taskInfo: {
                        title: 'dummy',
                        privacy: 'private',
                        taskGroup: {
                            id: taskGroupModel.getDataValue('id'),
                            name: taskGroupModel.getDataValue('name')
                        }
                    }
                })
                    .then(function (taskObject) {
                    assert(false);
                }, function (error) {
                    assert(error);
                })
                    .finally(function () {
                    Q.all([destroyTestUser(testUserModel), logic.destroyModelInstance(models.TaskGroup, taskGroupModel)]).then(function () { done(); });
                });
            });
        });
        it('Should not accept objects with task info ID', function (done) {
            Q.spread([createTestUser(), createTaskGroup()], function (testUserModel, taskGroupModel) {
                logic.Task.createTask({
                    userId: testUserModel.getDataValue('id'),
                    status: 'complete',
                    taskInfo: {
                        id: 1,
                        title: 'dummy',
                        privacy: 'private',
                        taskGroup: {
                            id: taskGroupModel.getDataValue('id'),
                            name: taskGroupModel.getDataValue('name')
                        }
                    }
                })
                    .then(function (taskObject) {
                    assert(false);
                }, function (error) {
                    assert(error);
                })
                    .finally(function () {
                    Q.all([destroyTestUser(testUserModel), logic.destroyModelInstance(models.TaskGroup, taskGroupModel)]).then(function () { done(); });
                });
            });
        });
        it('Should not accept objects with nonexistent task group ID', function (done) {
            Q.spread([createTestUser(), createTaskGroup()], function (testUserModel, taskGroupModel) {
                logic.Task.createTask({
                    userId: testUserModel.getDataValue('id'),
                    status: 'complete',
                    taskInfo: {
                        title: 'dummy',
                        privacy: 'private',
                        taskGroup: {
                            id: -1,
                            name: taskGroupModel.getDataValue('name')
                        }
                    }
                })
                    .then(function (taskObject) {
                    assert(false);
                }, function (error) {
                    assert(error);
                })
                    .finally(function () {
                    Q.all([destroyTestUser(testUserModel), logic.destroyModelInstance(models.TaskGroup, taskGroupModel)]).then(function () { done(); });
                });
            });
        });
        it('Should not accept objects with nonexistent user ID', function (done) {
            Q.spread([createTestUser(), createTaskGroup()], function (testUserModel, taskGroupModel) {
                logic.Task.createTask({
                    userId: -1,
                    status: 'complete',
                    taskInfo: {
                        title: 'dummy',
                        privacy: 'private',
                        taskGroup: {
                            id: taskGroupModel.getDataValue('id'),
                            name: taskGroupModel.getDataValue('name')
                        }
                    }
                })
                    .then(function (taskObject) {
                    assert(false);
                }, function (error) {
                    assert(error);
                })
                    .finally(function () {
                    Q.all([destroyTestUser(testUserModel), logic.destroyModelInstance(models.TaskGroup, taskGroupModel)]).then(function () { done(); });
                });
            });
        });
        it('Should return a valid TaskObject with ID', function (done) {
            Q.spread([createTestUser(), createTaskGroup()], function (testUserModel, taskGroupModel) {
                var status = 'complete';
                var title = 'dummy';
                var privacy = 'private';
                logic.Task.createTask({
                    userId: testUserModel.getDataValue('id'),
                    status: status,
                    taskInfo: {
                        title: title,
                        privacy: privacy,
                        taskGroup: {
                            id: taskGroupModel.getDataValue('id'),
                            name: taskGroupModel.getDataValue('name')
                        }
                    }
                })
                    .then(function (taskObject) {
                    assert(taskObject.id !== null && taskObject.id !== undefined);
                    assert(taskObject.taskInfo.id !== null && taskObject.taskInfo.id !== undefined);
                    assert(taskObject.status === status);
                    assert(taskObject.taskInfo.title === title);
                    assert(taskObject.taskInfo.privacy === privacy);
                    assert(taskObject.userId === testUserModel.getDataValue('id'));
                    assert(taskObject.taskInfo.taskGroup.id === taskGroupModel.getDataValue('id'));
                    assert(taskObject.taskInfo.taskGroup.name === taskGroupModel.getDataValue('name'));
                    return Q.spread([logic.modelInstanceExists(models.Task, taskObject.id), logic.modelInstanceExists(models.TaskInfo, taskObject.taskInfo.id)], function (exists1, exists2) {
                        assert(exists1 && exists2);
                        return logic.destroyModelInstanceWithId(models.Task, taskObject.id).then(function () {
                            return logic.destroyModelInstanceWithId(models.TaskInfo, taskObject.taskInfo.id);
                        });
                    });
                })
                    .finally(function () {
                    Q.all([destroyTestUser(testUserModel), logic.destroyModelInstance(models.TaskGroup, taskGroupModel)]).then(function () { done(); });
                });
            });
        });
    });
});
