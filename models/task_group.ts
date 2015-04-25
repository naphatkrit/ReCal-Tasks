import mongoose = require("mongoose");

import ReCalLib = require("../lib/lib");
import updatedStatusPlugin = require("./plugins/updated_status");
module TaskGroup
{
    let taskGroupSchema = new mongoose.Schema({
        _name: String
    })
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
        ReCalLib.Invariants.check(ReCalLib.Invariants.Predefined.isDefinedAndNotNull(newValue));
        this._name = name;
    })

    taskGroupSchema.plugin(updatedStatusPlugin);

    export var model = mongoose.model('TaskGroup', taskGroupSchema);
    export function invariants(taskGroup)
    {
        let Invariants = ReCalLib.Invariants;
        return [
        ].reduce(Invariants.chain, Invariants.Predefined.alwaysTrue);
    }
}

export = TaskGroup;
