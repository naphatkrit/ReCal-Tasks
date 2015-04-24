import mongoose = require('mongoose');

import ReCalLib = require("../lib/lib");
import updatedStatusPlugin = require("./plugins/updated_status");

// NOTE: wrapping into a module prevents the issue of defining a model twice when you include this in two different places
module User {
    let userSchema = new mongoose.Schema({
        _username: String,
        _tasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }]
    }, {
        autoIndex: process.env.NODE_ENV === 'development',
    })

    userSchema.virtual('username').get(function(): string{
        if (this._username === undefined || this._username === null) {
            return ""
        }
        return this._username;
    })

    userSchema.virtual('tasks').get(function() {
        if (this._tasks === undefined || this._tasks === null) {
            return []
        }
        return this._tasks;
    })

    userSchema.virtual('tasks').set(function(newValue) {
        this._tasks = newValue;
    })

    userSchema.plugin(updatedStatusPlugin);

    export var model = mongoose.model('User', userSchema);

    export function invariants(user) {
        let Invariants = ReCalLib.Invariants;
        return [
            ()=>{
                return this.username.length > 0;
            }
        ].reduce(Invariants.chain, Invariants.alwaysTrue);
    }
}

export = User;
