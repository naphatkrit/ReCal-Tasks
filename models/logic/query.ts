import Q = require('q');
import mongoose = require('mongoose');

import PromiseAdapter = require("../../lib/promise_adapter");
import PlainObject = require('./plain_object');
import User = require('../user');

export function findOrCreate(model, criteria): Q.Promise<mongoose.Document>
{
    return PromiseAdapter.convertMongooseQuery<mongoose.Document>(model.findOne(criteria)).then(
        (doc) =>
        {
            if (!doc)
            {
                doc = new model(criteria);
            }
            doc.save();
            return doc;
        },
        (err) =>
        {
            let doc = new model(criteria);
            doc.save();
            return doc;
        })
}

type getUserOptions = {
    populate?: string
}

function _getUser(userId: string, options: getUserOptions): Q.Promise<User.Instance>
{
    var query = User.model.findById(userId);
    if (options.populate)
    {
        query = query.populate(options.populate);
    }
    return <Q.Promise<User.Instance>> PromiseAdapter.convertMongooseQuery(query)
}

export function getUser(userId: string): Q.Promise<PlainObject.Interfaces.UserPlainObject>
{
    return _getUser(userId, {}).then(PlainObject.convertUserInstance)
}

export function getTasksForUser(userId: string): Q.Promise<PlainObject.Interfaces.TaskPlainObject[]>
{
    return _getUser(userId, {
        populate: '_tasks'
    }).then((user: User.Instance) =>
    {
        return Q.all(user.tasks.map(PlainObject.convertTaskInstance))
    })
}
