var Q = require('q');
var PromiseAdapter = require("../../lib/promise_adapter");
var PlainObject = require('./plain_object');
var User = require('../user');
function findOrCreate(model, criteria) {
    return PromiseAdapter.convertMongooseQuery(model.findOne(criteria)).then(function (doc) {
        if (!doc) {
            doc = new model(criteria);
        }
        doc.save();
        return doc;
    }, function (err) {
        var doc = new model(criteria);
        doc.save();
        return doc;
    });
}
exports.findOrCreate = findOrCreate;
function _getUser(userId, options) {
    var query = User.model.findById(userId);
    if (options.populate) {
        query = query.populate(options.populate);
    }
    return PromiseAdapter.convertMongooseQuery(query);
}
function getUser(userId) {
    return _getUser(userId, {}).then(PlainObject.convertUserInstance);
}
exports.getUser = getUser;
function getTasksForUser(userId) {
    return _getUser(userId, {
        populate: '_tasks'
    }).then(function (user) {
        return Q.all(user.tasks.map(PlainObject.convertTaskInstance));
    });
}
exports.getTasksForUser = getTasksForUser;
