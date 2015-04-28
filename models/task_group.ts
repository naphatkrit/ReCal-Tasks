import mongoose = require("mongoose");
import Q = require('q');

import updatedStatusPlugin = require("./plugins/updated_status");
import Invariants = require('../lib/invariants');

module TaskGroup
{
    /******************************************
     * Schema
     *****************************************/
    let taskGroupSchema = new mongoose.Schema({
        _name: {
            type: String,
            required: true
        }
    })

    /******************************************
     * Getters/Setters
     *****************************************/
    taskGroupSchema.virtual('name').get(function(): string
    {
        if (this._name === null || this._name === undefined)
        {
            return '';
        }
        return this._name;
    })
    taskGroupSchema.virtual('name').set(function(newValue: string)
    {
        Invariants.check(Invariants.Predefined.isDefinedAndNotNull(newValue));
        this._name = name;
    })

    /******************************************
     * Plugins
     *****************************************/
    taskGroupSchema.plugin(updatedStatusPlugin);

    /******************************************
     * Model
     *****************************************/
    export var model = mongoose.model('TaskGroup', taskGroupSchema);

    /******************************************
     * Exported Interfaces
     *****************************************/
    export interface Instance extends mongoose.Document
    {
        name: string
    }

    /******************************************
     * Invariants
     *****************************************/
    /**
     * Mongoose does not support model level validation. Do that here.
     */
    export function invariants(taskGroup): Q.Promise<Invariants.Invariant>
    {
        return Q.fcall(() =>
        {
            return [
            ].reduce(Invariants.chain, Invariants.Predefined.alwaysTrue);
        })
    }
}

export = TaskGroup;
