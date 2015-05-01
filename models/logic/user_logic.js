var assert = require('assert');
var Q = require('q');
var PromiseAdapter = require('../../lib/promise_adapter');
var PlainObject = require('./plain_object');
var User = require('../user');
var UserLogic;
(function (UserLogic) {
    function addTask(user, task) {
        return Q.fcall(function () {
            assert(user !== null && user !== undefined);
            assert(task !== null && task !== undefined);
            assert(task.id !== null && task.id !== undefined);
        }).then(function () {
            return PromiseAdapter.convertMongooseQuery(User.model.findById(user.id));
        }).then(function (user) {
            assert(user.tasks.indexOf(task.id) === -1);
            user.tasks.push(task.id);
            return PromiseAdapter.convertMongooseDocumentSave(user);
        }).then(function (user) {
            return PlainObject.convertUserInstance(user);
        });
    }
    UserLogic.addTask = addTask;
})(UserLogic || (UserLogic = {}));
module.exports = UserLogic;
