import assert = require('assert');
import mocha = require('mocha');
import logic = require('../models/logic/index');
import models = require("../models/index");
import Sequelize = require("sequelize");
import ReCalLib = require("../lib/lib");
import Q = require('q');

function createTestUser(): Q.Promise<any>
{
    return ReCalLib.PromiseAdapter.convertSequelize(models.User.create({
        username: "test_user",
    }));
}

function createTaskGroup(): Q.Promise<any>
{
    return ReCalLib.PromiseAdapter.convertSequelize(models.TaskGroup.create({
        name: "test_group",
    }));
}

function destroyTestUser(testUserModel): Q.Promise<any>
{
    return logic.destroyModelInstance(models.User, testUserModel);
}

describe('Task Model Logic Testing', () =>
{
    describe('createTask() Unit Tests', () =>
    {
        it('Should not accept objects with task ID', (done) =>
        {
            Q.spread([createTestUser(), createTaskGroup()], (testUserModel, taskGroupModel) =>
            {
                logic.Task.createTask({
                    id: 1234,
                    userId: testUserModel.id,
                    status: 'complete',
                    taskInfo: {
                        title: 'dummy',
                        privacy: 'private',
                        taskGroup: {
                            id: taskGroupModel.id,
                            name: taskGroupModel.name
                        }
                    }
                }).then(
                    (taskObject) =>
                    {
                        assert(false);
                    }, (error) =>
                    {
                        assert(error);
                    }
                ).then(() =>
                {
                    Q.all([destroyTestUser(testUserModel), logic.destroyModelInstance(models.TaskGroup, taskGroupModel)]).then(() => { done(); })
                })
            })
        })
        it('Should not accept objects with task info ID', (done) =>
        {
            Q.spread([createTestUser(), createTaskGroup()], (testUserModel, taskGroupModel) =>
            {
                logic.Task.createTask({
                    userId: testUserModel.id,
                    status: 'complete',
                    taskInfo: {
                        id: 1,
                        title: 'dummy',
                        privacy: 'private',
                        taskGroup: {
                            id: taskGroupModel.id,
                            name: taskGroupModel.name
                        }
                    }
                }).then(
                    (taskObject) =>
                    {
                        assert(false);
                    }, (error) =>
                    {
                        assert(error);
                    }).then(() =>
                {
                    Q.all([destroyTestUser(testUserModel), logic.destroyModelInstance(models.TaskGroup, taskGroupModel)]).then(() => { done(); })
                })
            })
        })
        it('Should not accept objects with nonexistent task group ID', (done) =>
        {
            Q.spread([createTestUser(), createTaskGroup()], (testUserModel, taskGroupModel) =>
            {
                logic.Task.createTask({
                    userId: testUserModel.id,
                    status: 'complete',
                    taskInfo: {
                        title: 'dummy',
                        privacy: 'private',
                        taskGroup: {
                            id: -1,
                            name: taskGroupModel.name
                        }
                    }
                }).then(
                    (taskObject) =>
                    {
                        assert(false);
                    }, (error) =>
                    {
                        assert(error);
                    }).then(() =>
                {
                    Q.all([destroyTestUser(testUserModel), logic.destroyModelInstance(models.TaskGroup, taskGroupModel)]).then(() => { done(); })
                })
            })
        })
        it('Should not accept objects with nonexistent user ID', (done) =>
        {
            Q.spread([createTestUser(), createTaskGroup()], (testUserModel, taskGroupModel) =>
            {
                logic.Task.createTask({
                    userId: -1,
                    status: 'complete',
                    taskInfo: {
                        title: 'dummy',
                        privacy: 'private',
                        taskGroup: {
                            id: taskGroupModel.id,
                            name: taskGroupModel.name
                        }
                    }
                }).then(
                    (taskObject) =>
                    {
                        assert(false);
                    }, (error) =>
                    {
                        assert(error);
                    }).then(() =>
                {
                    Q.all([destroyTestUser(testUserModel), logic.destroyModelInstance(models.TaskGroup, taskGroupModel)]).then(() => { done(); })
                })
            })
        })
        it('Should return a valid TaskObject with ID', (done) =>
        {
            Q.spread([createTestUser(), createTaskGroup()], (testUserModel, taskGroupModel) =>
            {
                let status = 'complete'
                let title = 'dummy'
                let privacy = 'private'
                logic.Task.createTask({
                    userId: testUserModel.id,
                    status: status,
                    taskInfo: {
                        title: title,
                        privacy: privacy,
                        taskGroup: {
                            id: taskGroupModel.id,
                            name: taskGroupModel.name
                        }
                    }
                }).then((taskObject) =>
                {
                    assert(taskObject.id !== null && taskObject.id !== undefined);
                    assert(taskObject.taskInfo.id !== null && taskObject.taskInfo.id !== undefined);
                    assert(taskObject.status === status)
                    assert(taskObject.taskInfo.title === title)
                    assert(taskObject.taskInfo.privacy === privacy)
                    assert(taskObject.userId === testUserModel.id)
                    assert(taskObject.taskInfo.taskGroup.id === taskGroupModel.id)
                    assert(taskObject.taskInfo.taskGroup.name === taskGroupModel.name)
                    return Q.spread([logic.modelInstanceExists(models.Task, taskObject.id), logic.modelInstanceExists(models.TaskInfo, taskObject.taskInfo.id)], (exists1, exists2) =>
                    {
                        assert(exists1 && exists2);
                        return logic.destroyModelInstanceWithId(models.Task, taskObject.id).then(() =>
                        {
                            return logic.destroyModelInstanceWithId(models.TaskInfo, taskObject.taskInfo.id)
                        })
                    });
                }).fail((error)=>{
                    console.log(error);
                    console.log(error.stack);
                    throw error;
                }).then(() =>
                {
                    Q.all([destroyTestUser(testUserModel), logic.destroyModelInstance(models.TaskGroup, taskGroupModel)]).then(() => { done(); })
                })
            })
        })
    })
})
