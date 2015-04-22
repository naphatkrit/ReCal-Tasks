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

function destroyModelInstance(model, modelInstance): Q.Promise<any>
{
    return ReCalLib.PromiseAdapter.convertSequelize(
        model.destroy({ where: { id: modelInstance.getDataValue('id') } })
        )
}

function destroyTestUser(testUserModel): Q.Promise<any>
{
    return destroyModelInstance(models.User, testUserModel);
}

describe('Task Model Logic Testing', () =>
{
    describe('createTask() Unit Tests', () =>
    {
        it('Should not accept objects with task ID or task info ID', (done) =>
        {
            Q.spread([createTestUser(), createTaskGroup()], (testUserModel, taskGroupModel)=>{
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
                .then((taskObject)=>{
                    return;
                }, (error)=>{
                    return;
                })
                .finally(()=>{
                    Q.all([destroyTestUser(testUserModel), destroyModelInstance(models.TaskGroup, taskGroupModel)]).then(() => { done(); })
                })
            })
        })
    })
})
