var assert = require('assert');
var Q = require('q');
var Models = require('../models/index');
var TaskGroup = require('../models/task_group');
var TaskInfo = require('../models/task_info');
var Invariants = require('../lib/invariants');
var PromiseAdapter = require('../lib/promise_adapter');
var PlainObject = require('../models/logic/plain_object');
function createTaskGroup() {
    var deferred = Q.defer();
    var taskGroup = new TaskGroup.model({
        _name: "Dummy Task Group"
    });
    taskGroup.save(function (err, doc) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(doc);
        }
    });
    return deferred.promise.then(function (doc) {
        return TaskGroup.invariants(doc).then(function (invariants) {
            Invariants.check(invariants);
            return doc;
        });
    });
}
function createTaskInfo(taskGroup) {
    var deferred = Q.defer();
    var taskInfo = new TaskInfo.model({
        _title: "Dummy Task Group",
        _description: "",
        _privacy: TaskInfo.TaskPrivacy.Private,
        _previousVersion: null,
        _taskGroupId: null
    });
    taskInfo.taskGroup = taskGroup;
    taskInfo.save(function (err, doc) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(doc);
        }
    });
    return deferred.promise.then(function (doc) {
        return TaskInfo.invariants(doc).then(function (invariants) {
            Invariants.check(invariants);
            return doc;
        });
    });
}
describe('Models Logic - Plain Object Unit Tests', function () {
    before(function (done) {
        Models.connection.once('error', function (error) {
            done(error);
        });
        Models.connection.once('open', function () {
            done();
        });
    });
    describe('convertTaskGroupInstance()', function () {
        var taskGroupId = '';
        beforeEach(function (done) {
            createTaskGroup().then(function (taskGroup) {
                taskGroupId = taskGroup.id;
                done();
            }, function (err) {
                done(err);
            });
            var taskGroup = new TaskGroup.model({
                _name: "Dummy Task Group"
            });
        });
        afterEach(function (done) {
            TaskGroup.model.remove({ _id: taskGroupId }, function (err) {
                if (err) {
                    done(err);
                }
                else {
                    done();
                }
            });
        });
        it('Should fail when given null as an argument', function (done) {
            PlainObject.convertTaskGroupInstance(null).then(function () {
                done(new Error('Did not fail'));
            }, function (err) {
                done();
            });
        });
        it('Should successfully create a plain object', function () {
            return PromiseAdapter.convertMongooseQuery(TaskGroup.model.findById(taskGroupId))
                .then(function (taskGroupInstance) {
                return PlainObject.convertTaskGroupInstance(taskGroupInstance).then(function (plainObject) {
                    assert(plainObject.id === taskGroupInstance.id);
                    assert(plainObject.name === taskGroupInstance.name);
                });
            });
        });
    });
    describe('convertTaskInfoInstance()', function () {
        var taskGroupId = '';
        var taskInfoId = '';
        beforeEach(function (done) {
            createTaskGroup().then(function (taskGroup) {
                taskGroupId = taskGroup.id;
                return createTaskInfo(taskGroup);
            }).then(function (taskInfo) {
                taskInfoId = taskInfo.id;
                done();
            }).fail(function (err) {
                done(err);
            });
        });
        afterEach(function (done) {
            Q.all([
                PromiseAdapter.convertMongooseQuery(TaskInfo.model.remove({ _id: taskGroupId })),
                PromiseAdapter.convertMongooseQuery(TaskGroup.model.remove({ _id: taskInfoId }))
            ]).then(function () {
                done();
            }, function (err) {
                done(err);
            });
        });
        it('Should fail when given null as an argument', function (done) {
            PlainObject.convertTaskInfoInstance(null).then(function () {
                done(new Error('Did not fail'));
            }, function (err) {
                done();
            });
        });
        it('Should successfully create a plain object', function () {
            return Q.all([
                PromiseAdapter.convertMongooseQuery(TaskGroup.model.findById(taskGroupId)),
                PromiseAdapter.convertMongooseQuery(TaskInfo.model.findById(taskInfoId))
            ]).spread(function (taskGroup, taskInfo) {
                return PlainObject.convertTaskInfoInstance(taskInfo).then(function (plainObject) {
                    assert(plainObject.id === taskInfo.id);
                    assert(plainObject.title === taskInfo.title);
                    assert(plainObject.privacy === taskInfo.privacy);
                    assert(plainObject.taskGroup.id === taskGroup.id);
                    assert(plainObject.taskGroup.name === taskGroup.name);
                });
            });
        });
        it('Should successfully create a plain object even if taskGroup property has already been populated', function () {
            return Q.all([
                PromiseAdapter.convertMongooseQuery(TaskGroup.model.findById(taskGroupId)),
                PromiseAdapter.convertMongooseQuery(TaskInfo.model.findById(taskInfoId))
            ]).spread(function (taskGroup, taskInfo) {
                return taskInfo.populate('_taskGroup', function (err, taskInfo) {
                    if (err) {
                        throw err;
                    }
                    return PlainObject.convertTaskInfoInstance(taskInfo).then(function (plainObject) {
                        assert(plainObject.id === taskInfo.id);
                        assert(plainObject.title === taskInfo.title);
                        assert(plainObject.privacy === taskInfo.privacy);
                        assert(plainObject.taskGroup.id === taskGroup.id);
                        assert(plainObject.taskGroup.name === taskGroup.name);
                    });
                });
            });
        });
    });
});
