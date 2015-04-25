import mongoose = require('mongoose');

import ReCalLib = require("../lib/lib");
import updatedStatusPlugin = require("./plugins/updated_status");

// NOTE: wrapping into a module prevents the issue of defining a model twice when you include this in two different places
module User
{
    let userSchema = new mongoose.Schema({
        _username: String,
        _taskGroups: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TaskGroup'
        }],
        _tasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }]
    }, {
            autoIndex: process.env.NODE_ENV === 'development',
        })

    userSchema.virtual('username').get(function(): string
    {
        if (this._username === undefined || this._username === null)
        {
            return ""
        }
        return this._username;
    })

    userSchema.virtual('tasks').get(function()
    {
        if (this._tasks === undefined || this._tasks === null)
        {
            return []
        }
        return this._tasks;
    })
    userSchema.virtual('tasks').set(function(newValue)
    {
        ReCalLib.Invariants.check(ReCalLib.Invariants.Predefined.isDefinedAndNotNull(newValue));
        this._tasks = newValue;
    })
    userSchema.virtual('taskGroups').get(function()
    {
        if (this._taskGroups === undefined || this._taskGroups === null)
        {
            return [];
        }
        return this._taskGroups;
    })
    userSchema.virtual('taskGroups').set(function(newValue)
    {
        ReCalLib.Invariants.check(ReCalLib.Invariants.Predefined.isDefinedAndNotNull(newValue));
        this._taskGroups = newValue;
    })

    userSchema.plugin(updatedStatusPlugin);

    export var model = mongoose.model('User', userSchema);

    export function invariants(user)
    {
        let Invariants = ReCalLib.Invariants;
        return [
            Invariants.Predefined.isNotEmpty(user.username)
        ].reduce(Invariants.chain, Invariants.Predefined.alwaysTrue);
    }
}

export = User;
