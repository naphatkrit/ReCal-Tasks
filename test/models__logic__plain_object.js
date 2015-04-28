var assert = require('assert');
var Q = require('q');
var Models = require('../models/index');
var Task = require('../models/task');
var TaskGroup = require('../models/task_group');
var TaskInfo = require('../models/task_info');
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
        return doc;
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
        return doc;
    });
}
function createTask(taskInfo) {
    var deferred = Q.defer();
    var task = new Task.model({
        _state: Task.TaskState.Incomplete,
        _taskInfo: null
    });
    task.taskInfo = taskInfo;
    task.save(function (err, doc) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(doc);
        }
    });
    return deferred.promise.then(function (doc) {
        return doc;
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
                PromiseAdapter.convertMongooseQuery(TaskInfo.model.remove({ _id: taskInfoId })),
                PromiseAdapter.convertMongooseQuery(TaskGroup.model.remove({ _id: taskGroupId }))
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
    describe('convertTaskInstance()', function () {
        var taskGroupId = '';
        var taskInfoId = '';
        var taskId = '';
        beforeEach(function (done) {
            createTaskGroup().then(function (taskGroup) {
                taskGroupId = taskGroup.id;
                return createTaskInfo(taskGroup);
            }).then(function (taskInfo) {
                taskInfoId = taskInfo.id;
                return createTask(taskInfo);
            }).then(function (task) {
                taskId = task.id;
                done();
            }).fail(function (err) {
                done(err);
            });
        });
        afterEach(function (done) {
            Q.all([
                PromiseAdapter.convertMongooseQuery(TaskGroup.model.findByIdAndRemove(taskGroupId)),
                PromiseAdapter.convertMongooseQuery(TaskInfo.model.findByIdAndRemove(taskInfoId)),
                PromiseAdapter.convertMongooseQuery(Task.model.findByIdAndRemove(taskId))
            ]).then(function () {
                done();
            }, function (err) {
                done(err);
            });
        });
        it('Should fail when given null as an argument', function (done) {
            PlainObject.convertTaskInstance(null).then(function () {
                done(new Error('Did not fail'));
            }, function (err) {
                done();
            });
        });
        it('Should successfully create a plain object', function () {
            return Q.all([
                PromiseAdapter.convertMongooseQuery(TaskGroup.model.findById(taskGroupId)),
                PromiseAdapter.convertMongooseQuery(TaskInfo.model.findById(taskInfoId)),
                PromiseAdapter.convertMongooseQuery(Task.model.findById(taskId))
            ]).spread(function (taskGroup, taskInfo, task) {
                return PlainObject.convertTaskInstance(task).then(function (plainObject) {
                    assert(plainObject.id === task.id);
                    assert(plainObject.state === task.state);
                    assert(plainObject.taskInfo.id === taskInfo.id);
                    assert(plainObject.taskInfo.title === taskInfo.title);
                    assert(plainObject.taskInfo.privacy === taskInfo.privacy);
                    assert(plainObject.taskInfo.taskGroup.id === taskGroup.id);
                    assert(plainObject.taskInfo.taskGroup.name === taskGroup.name);
                });
            });
        });
        it('Should successfully create a plain object even if taskInfo property has already been populated', function () {
            return Q.all([
                PromiseAdapter.convertMongooseQuery(TaskGroup.model.findById(taskGroupId)),
                PromiseAdapter.convertMongooseQuery(TaskInfo.model.findById(taskInfoId)),
                PromiseAdapter.convertMongooseQuery(Task.model.findById(taskId))
            ]).spread(function (taskGroup, taskInfo, task) {
                return task.populate('_taskInfo', function (err, task) {
                    if (err) {
                        throw err;
                    }
                    return PlainObject.convertTaskInstance(task).then(function (plainObject) {
                        assert(plainObject.id === task.id);
                        assert(plainObject.state === task.state);
                        assert(plainObject.taskInfo.id === taskInfo.id);
                        assert(plainObject.taskInfo.title === taskInfo.title);
                        assert(plainObject.taskInfo.privacy === taskInfo.privacy);
                        assert(plainObject.taskInfo.taskGroup.id === taskGroup.id);
                        assert(plainObject.taskInfo.taskGroup.name === taskGroup.name);
                    });
                });
            });
        });
    });
});
