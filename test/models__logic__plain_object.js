var Models = require('../models/index');
var TaskGroup = require('../models/task_group');
var Invariants = require('../lib/invariants');
var PromiseAdapter = require('../lib/promise_adapter');
var PlainObject = require('../models/logic/plain_object');
describe('Models Logic - Plain Object Unit Tests', function () {
    before(function (done) {
        Models.connection.once('error', function (error) {
            done(error);
        });
        Models.connection.once('open', function () {
            done();
        });
    });
    describe('Task Group Plain Object', function () {
        var taskGroupId = '';
        beforeEach(function (done) {
            var taskGroup = new TaskGroup.model({
                _name: "Dummy Task Group"
            });
            taskGroup.save(function (err, taskGroup) {
                taskGroupId = taskGroup.id;
                return TaskGroup.invariants(taskGroup).then(function (invariants) {
                    Invariants.check(invariants);
                    done();
                }, function (err) {
                    done(err);
                });
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
        it('Should successfully create a plain object', function () {
            return PromiseAdapter.convertMongooseQuery(TaskGroup.model.findById(taskGroupId))
                .then(function (taskGroupInstance) {
                return PlainObject.convertTaskGroupInstance(taskGroupInstance);
            });
        });
    });
});
