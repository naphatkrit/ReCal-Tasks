import mocha = require('mocha');
import assert = require('assert');
import Q = require('q');

import Models = require('../models/index');
import TaskGroup = require('../models/task_group');
import TaskInfo = require('../models/task_info');
import Invariants = require('../lib/invariants');
import PromiseAdapter = require('../lib/promise_adapter');
import PlainObject = require('../models/logic/plain_object');

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
        return TaskGroup.invariants(doc).then((invariants) =>
        {
            Invariants.check(invariants);
            return doc;
        })
    });
}
function createTaskInfo(taskGroup: TaskGroup.Instance): Q.Promise<TaskInfo.Instance>
{
    let deferred = Q.defer<TaskInfo.Instance>();
    let taskInfo = <TaskInfo.Instance> new TaskInfo.model({
        _title: "Dummy Task Group",
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
        return TaskInfo.invariants(doc).then((invariants) =>
        {
            Invariants.check(invariants);
            return doc;
        })
    });
}

describe('Models Logic - Plain Object Unit Tests', () =>
{
    before((done) =>
    {
        Models.connection.once('error', (error) =>
        {
            done(error);
        })
        Models.connection.once('open', () =>
        {
            done();
        })
    })

    describe('convertTaskGroupInstance()', () =>
    {
        var taskGroupId = '';
        beforeEach((done) =>
        {
            createTaskGroup().then((taskGroup) =>
            {
                taskGroupId = taskGroup.id;
                done();
            }, (err) =>
                {
                    done(err);
                })
            let taskGroup = new TaskGroup.model({
                _name: "Dummy Task Group"
            });
        })
        afterEach((done) =>
        {
            TaskGroup.model.remove({ _id: taskGroupId }, (err) =>
            {
                if (err)
                {
                    done(err);
                } else
                {
                    done();
                }
            })
        })
        it('Should fail when given null as an argument', (done) =>
        {
            PlainObject.convertTaskGroupInstance(null).then(
                () =>
                {
                    done(new Error('Did not fail'));
                }, (err) =>
                {
                    done();
                })
        })
        it('Should successfully create a plain object', () =>
        {
            return PromiseAdapter.convertMongooseQuery(TaskGroup.model.findById(taskGroupId))
                .then((taskGroupInstance: TaskGroup.Instance) =>
            {
                return PlainObject.convertTaskGroupInstance(taskGroupInstance).then((plainObject) =>
                {
                    assert(plainObject.id === taskGroupInstance.id)
                    assert(plainObject.name === taskGroupInstance.name)
                })
            })
        });
    });

    describe('convertTaskInfoInstance()', () =>
    {
        var taskGroupId = '';
        var taskInfoId = '';
        beforeEach((done)=>{
            createTaskGroup().then((taskGroup)=>{
                taskGroupId = taskGroup.id;
                return createTaskInfo(taskGroup);
            }).then((taskInfo)=>{
                taskInfoId = taskInfo.id;
                done();
            }).fail((err)=>{
                done(err);
            })
        })
        afterEach((done)=>{
            Q.all([
                PromiseAdapter.convertMongooseQuery(TaskInfo.model.remove({_id: taskGroupId})),
                PromiseAdapter.convertMongooseQuery(TaskGroup.model.remove({_id: taskInfoId}))
            ]).then(()=>{
                done();
            }, (err)=>{
                done(err);
            })
        })
        it('Should fail when given null as an argument', (done) =>
        {
            PlainObject.convertTaskInfoInstance(null).then(
                () =>
                {
                    done(new Error('Did not fail'));
                }, (err) =>
                {
                    done();
                })
        })
        it('Should successfully create a plain object', ()=>{
            return Q.all([
                PromiseAdapter.convertMongooseQuery(TaskGroup.model.findById(taskGroupId)),
                PromiseAdapter.convertMongooseQuery(TaskInfo.model.findById(taskInfoId))
            ]).spread((taskGroup, taskInfo)=>{
                return PlainObject.convertTaskInfoInstance(taskInfo).then((plainObject)=>{
                    assert(plainObject.id === taskInfo.id)
                    assert(plainObject.title === taskInfo.title)
                    assert(plainObject.privacy === taskInfo.privacy)
                    assert(plainObject.taskGroup.id === taskGroup.id)
                    assert(plainObject.taskGroup.name === taskGroup.name)
                })
            })
        })
        it('Should successfully create a plain object even if taskGroup property has already been populated', ()=>{
            return Q.all([
                PromiseAdapter.convertMongooseQuery(TaskGroup.model.findById(taskGroupId)),
                PromiseAdapter.convertMongooseQuery(TaskInfo.model.findById(taskInfoId))
            ]).spread((taskGroup, taskInfo)=>{
                return taskInfo.populate('_taskGroup', (err, taskInfo)=>{
                    if (err) {
                        throw err;
                    }
                    return PlainObject.convertTaskInfoInstance(taskInfo).then((plainObject)=>{
                        assert(plainObject.id === taskInfo.id)
                        assert(plainObject.title === taskInfo.title)
                        assert(plainObject.privacy === taskInfo.privacy)
                        assert(plainObject.taskGroup.id === taskGroup.id)
                        assert(plainObject.taskGroup.name === taskGroup.name)
                    })
                })
            })
        })
    });
})
