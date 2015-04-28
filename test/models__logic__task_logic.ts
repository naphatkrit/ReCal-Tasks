import mocha = require('mocha');
import assert = require('assert');
import Q = require('q');
import mongoose = require('mongoose');

import Models = require('../models/index');
import Task = require('../models/task');
import TaskGroup = require('../models/task_group');
import TaskInfo = require('../models/task_info');
import PromiseAdapter = require('../lib/promise_adapter');
import TaskLogic = require('../models/logic/task_logic');

function createTaskGroup(): Q.Promise<TaskGroup.Instance>
{
    let deferred = Q.defer<TaskGroup.Instance>();
    let taskGroup = new TaskGroup.model({
        _name: "Dummy Task Group"
    });
    taskGroup.save<TaskGroup.Instance>((err, doc) =>
    {
        if (err)
        {
            deferred.reject(err);
        } else
        {
            deferred.resolve(doc);
        }
    });
    return deferred.promise.then((doc) =>
    {
        return doc;
    });
}

function createTaskInfo(taskGroup: TaskGroup.Instance): Q.Promise<TaskInfo.Instance>
{
    let deferred = Q.defer<TaskInfo.Instance>();
    let taskInfo = <TaskInfo.Instance> new TaskInfo.model({
        _title: "Dummy Task",
        _description: "",
        _privacy: TaskInfo.TaskPrivacy.Private,
        _previousVersion: null,
        _taskGroupId: null
    });
    taskInfo.taskGroup = taskGroup;
    taskInfo.save<TaskInfo.Instance>((err, doc) =>
    {
        if (err)
        {
            deferred.reject(err);
        } else
        {
            deferred.resolve(doc);
        }
    });
    return deferred.promise.then((doc) =>
    {
        return doc;
    });
}

describe('Task Logic Unit Tests', () =>
{
    before((done) =>
    {
        if (Models.connection.readyState === 1)
        {
            done();
            return;
        }
        Models.connection.on('error', (error) =>
        {
            done(error);
        })
        Models.connection.on('open', () =>
        {
            done();
        })
    })
    describe('createTaskInfo()', () =>
    {
        var taskGroupId = '';
        beforeEach((done) =>
        {
            createTaskGroup().then(
                (taskGroup) =>
                {
                    taskGroupId = taskGroup.id;
                    done();
                }, (err) =>
                {
                    done(err);
                })
        })
        afterEach((done) =>
        {
            TaskGroup.model.findByIdAndRemove(taskGroupId, done)
        })
        it('Should fail when given null as an argument', (done) =>
        {
            TaskLogic.createTaskInfo(null).then(
                () =>
                {
                    done(new Error('Did not fail'));
                }, (err) =>
                {
                    done();
                })
        })
        it('Should not accept a plain object with nonexistent Task Group id', (done) =>
        {
            TaskLogic.createTaskInfo({
                title: 'title',
                description: '',
                privacy: TaskInfo.TaskPrivacy.Private,
                taskGroup: {
                    id: '123456789123',
                    name: 'Dummy Task Group'
                }
            }).then(
                () =>
                {
                    done(new Error('Did not fail'));
                }, (err) =>
                {
                    done();
                })
        })
        it('Should not accept a plain object with errorneous Task Group name', (done) =>
        {
            TaskLogic.createTaskInfo({
                title: 'title',
                description: '',
                privacy: TaskInfo.TaskPrivacy.Private,
                taskGroup: {
                    id: taskGroupId,
                    name: 'Dummy Task '
                }
            }).then(
                () =>
                {
                    done(new Error('Did not fail'));
                }, (err) =>
                {
                    done();
                })
        })
        it('Should not accept a plain object with id', (done) =>
        {
            TaskLogic.createTaskInfo({
                id: '12345678912',
                title: 'title',
                description: '',
                privacy: TaskInfo.TaskPrivacy.Private,
                taskGroup: {
                    id: taskGroupId,
                    name: 'Dummy Task Group'
                }
            }).then(
                () =>
                {
                    done(new Error('Did not fail'));
                }, (err) =>
                {
                    done();
                })
        })
        it('Should successfully create a task info', () =>
        {
            const title = 'title'
            const description = ''
            const privacy = TaskInfo.TaskPrivacy.Public
            return TaskLogic.createTaskInfo({
                title: title,
                description: description,
                privacy: privacy,
                taskGroup: {
                    id: taskGroupId,
                    name: 'Dummy Task Group'
                }
            }).then((taskInfoPlainObject) =>
            {
                assert(taskInfoPlainObject.id !== null && taskInfoPlainObject.id !== undefined);
                assert(taskInfoPlainObject.title === title);
                assert(taskInfoPlainObject.description === description);
                assert(taskInfoPlainObject.privacy === privacy);
                assert(taskInfoPlainObject.taskGroup.id === taskGroupId);
                return taskInfoPlainObject;
            }).then((taskInfoPlainObject)=>{
                return PromiseAdapter.convertMongooseQuery(TaskInfo.model.findByIdAndRemove(taskInfoPlainObject.id))
            })
        })
    }) // createTaskInfo()
    describe('updateTaskInfo()', () =>
    {
        var taskGroupId = '';
        var taskInfoId = '';
        beforeEach((done) =>
        {
            createTaskGroup().then((taskGroup) =>
            {
                taskGroupId = taskGroup.id;
                return createTaskInfo(taskGroup);
            }).then((taskInfo) =>
            {
                taskInfoId = taskInfo.id;
                done();
            }).fail((err) =>
            {
                done(err);
            })
        })
        afterEach((done) =>
        {
            Q.all([
                PromiseAdapter.convertMongooseQuery(TaskInfo.model.remove({ _id: taskInfoId })),
                PromiseAdapter.convertMongooseQuery(TaskGroup.model.remove({ _id: taskGroupId }))
            ]).then(
                () =>
                {
                    done();
                }, (err) =>
                {
                    done(err);
                })
        })
        it('Should fail when given null as an argument', (done) =>
        {
            TaskLogic.updateTaskInfo(null).then(
                () =>
                {
                    done(new Error('Did not fail'));
                }, (err) =>
                {
                    done();
                })
        })
        it('Should not accept a plain object with nonexistent Task Group id', (done) =>
        {
            TaskLogic.updateTaskInfo({
                id: taskInfoId,
                title: 'title',
                description: '',
                privacy: TaskInfo.TaskPrivacy.Private,
                taskGroup: {
                    id: '123456789123',
                    name: 'Dummy Task Group'
                }
            }).then(
                () =>
                {
                    done(new Error('Did not fail'));
                }, (err) =>
                {
                    done();
                })
        })
        it('Should not accept a plain object with errorneous Task Group name', (done) =>
        {
            TaskLogic.updateTaskInfo({
                id: taskInfoId,
                title: 'title',
                description: '',
                privacy: TaskInfo.TaskPrivacy.Private,
                taskGroup: {
                    id: taskGroupId,
                    name: 'Dummy Task '
                }
            }).then(
                () =>
                {
                    done(new Error('Did not fail'));
                }, (err) =>
                {
                    done();
                })
        })
        it('Should not accept a plain object without id', (done) =>
        {
            TaskLogic.updateTaskInfo({
                title: 'title',
                description: '',
                privacy: TaskInfo.TaskPrivacy.Private,
                taskGroup: {
                    id: taskGroupId,
                    name: 'Dummy Task Group'
                }
            }).then(
                () =>
                {
                    done(new Error('Did not fail'));
                }, (err) =>
                {
                    done();
                })
        })
        it('Should not accept a plain object with nonexistent id', (done) =>
        {
            TaskLogic.updateTaskInfo({
                id: '123456789123',
                title: 'title',
                description: '',
                privacy: TaskInfo.TaskPrivacy.Private,
                taskGroup: {
                    id: taskGroupId,
                    name: 'Dummy Task Group'
                }
            }).then(
                () =>
                {
                    done(new Error('Did not fail'));
                }, (err) =>
                {
                    done();
                })
        })
        it('Should successfully update a task info', () =>
        {
            const title = 'title'
            const description = 'description'
            const privacy = TaskInfo.TaskPrivacy.Public
            return TaskLogic.updateTaskInfo({
                id: taskInfoId,
                title: title,
                description: description,
                privacy: privacy,
                taskGroup: {
                    id: taskGroupId,
                    name: 'Dummy Task Group'
                }
            }).then((taskInfoPlainObject) =>
            {
                assert(taskInfoPlainObject.id === taskInfoId);
                assert(taskInfoPlainObject.title === title);
                assert(taskInfoPlainObject.description === description);
                assert(taskInfoPlainObject.privacy === privacy);
                assert(taskInfoPlainObject.taskGroup.id === taskGroupId);
                return taskInfoPlainObject;
            })
        })
    }) // updateTaskInfo()
})
