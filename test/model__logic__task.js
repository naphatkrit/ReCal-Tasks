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
function destroyModelInstance(model, modelInstance) {
    return ReCalLib.PromiseAdapter.convertSequelize(model.destroy({ where: { id: modelInstance.getDataValue('id') } }));
}
function destroyTestUser(testUserModel) {
    return destroyModelInstance(models.User, testUserModel);
}
describe('Task Model Logic Testing', function () {
    describe('createTask() Unit Tests', function () {
        it('Should not accept objects with task ID or task info ID', function (done) {
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
                    return;
                }, function (error) {
                    return;
                })
                    .finally(function () {
                    Q.all([destroyTestUser(testUserModel), destroyModelInstance(models.TaskGroup, taskGroupModel)]).then(function () { done(); });
                });
            });
        });
    });
});
