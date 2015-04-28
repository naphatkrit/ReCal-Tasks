import mongoose = require('mongoose');
import Q = require('q');

import updatedStatusPlugin = require("./plugins/updated_status");
import Invariants = require("../lib/invariants");

module TaskInfo
{
    export enum TaskPrivacy { Private, Public };
    function privacyInvariants(privacy: TaskPrivacy)
    {
        return [
            Invariants.Predefined.isDefinedAndNotNull(privacy),
            () =>
            {
                let name = TaskPrivacy[privacy];
                return name !== null || name !== undefined;
            }
        ].reduce(Invariants.chain, Invariants.Predefined.alwaysTrue)
    }

    let taskInfoSchema = new mongoose.Schema({
        _title: String,
        _description: String,
        _privacy: Number,
        _previousVersion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TaskInfo'
        },
        _taskGroup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TaskGroup'
        }
    })

    taskInfoSchema.virtual('title').get(function(): string
    {
        if (this._title === null || this._title === undefined)
        {
            return ''
        }
        return this._title;
    })
    taskInfoSchema.virtual('title').set(function(newValue: string)
    {
        Invariants.check(Invariants.Predefined.isDefinedAndNotNull(newValue))
        this._title = newValue;
    })
    taskInfoSchema.virtual('description').get(function(): string
    {
        if (this._description === null || this._description === undefined)
        {
            return '';
        }
        return this._description;
    })
    taskInfoSchema.virtual('description').set(function(newValue: string)
    {
        Invariants.check(Invariants.Predefined.isDefinedAndNotNull(newValue));
        this._description = newValue;
    })
    taskInfoSchema.virtual('privacy').get(function(): TaskPrivacy
    {
        if (this._privacy === null || this._privacy === undefined)
        {
            return TaskPrivacy.Private;
        }
        Invariants.check(privacyInvariants(this._privacy));
        return this._privacy;
    })
    taskInfoSchema.virtual('privacy').set(function(newValue: TaskPrivacy)
    {
        Invariants.check(privacyInvariants(newValue));
        this._privacy = newValue;
    })
    taskInfoSchema.virtual('previousVersion').get(function()
    {
        if (this._previousVersion === undefined)
        {
            return null;
        }
        return this._previousVersion;
    })
    taskInfoSchema.virtual('previousVersion').set(function(newValue)
    {
        this._previousVersion = newValue; // ok to be null or undefined
    })
    taskInfoSchema.virtual('taskGroup').get(function()
    {
        if (this._taskGroup === undefined || this._taskGroup === null)
        {
            return null;
        }
        return this._taskGroup;
    })
    taskInfoSchema.virtual('taskGroup').set(function(newValue)
    {
        Invariants.check(Invariants.Predefined.isDefinedAndNotNull(newValue));
        this._taskGroup = newValue;
    })

    taskInfoSchema.plugin(updatedStatusPlugin);

    export var model = mongoose.model('TaskInfo', taskInfoSchema)

    export interface Instance extends mongoose.Document
    {
        title: string
        description: string
        privacy: TaskPrivacy
        previousVersion: mongoose.Types.ObjectId | Instance
        taskGroup: mongoose.Types.ObjectId | any
        execPopulate(): mongoose.Promise<Instance>
    }

    export function invariants(taskInfo): Q.Promise<Invariants.Invariant>
    {
        return Q.fcall(() =>
        {
            return [
                privacyInvariants(taskInfo.privacy),
            ].reduce(Invariants.chain, Invariants.Predefined.alwaysTrue)
        })
    }
}

export = TaskInfo;
