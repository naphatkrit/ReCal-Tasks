import mongoose = require("mongoose");

import updatedStatusPlugin = require("./plugins/updated_status");
import ReCalLib = require("../lib/lib");

module Task
{
    export enum TaskState { Incomplete, Complete };

    let taskSchema = new mongoose.Schema({
        _state: Number,
        _taskInfo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TaskInfo'
        }
    }, {
            autoIndex: process.env.NODE_ENV === 'development',
        });

    function stateInvariants(state: TaskState)
    {
        let Invariants = ReCalLib.Invariants;
        return [
            Invariants.Predefined.isDefinedAndNotNull(state),
            () =>
            {
                let stateName = TaskState[state];
                return stateName !== null || stateName !== undefined;
            }
        ].reduce(Invariants.chain, Invariants.Predefined.alwaysTrue)
    }

    taskSchema.virtual('state').get(function(): TaskState
    {
        if (this._state === null || this._state === undefined)
        {
            return TaskState.Incomplete;
        }
        ReCalLib.Invariants.check(stateInvariants(this._state));
        return this._state;
    })
    taskSchema.virtual('state').set(function(newState: TaskState)
    {
        ReCalLib.Invariants.check(stateInvariants(newState));
        this._state = newState;
    })

    taskSchema.virtual('taskInfo').get(function()
    {
        if (this._taskInfo === undefined)
        {
            return null;
        }
        return this._taskInfo;
    })
    taskSchema.virtual('taskInfo').set(function(newValue)
    {
        this._taskInfo = newValue;
    })

    taskSchema.plugin(updatedStatusPlugin);

    export var model = mongoose.model("Task", taskSchema);

    export function invariants(task)
    {
        let Invariants = ReCalLib.Invariants;
        return [
            stateInvariants(task.state)
        ].reduce(Invariants.chain, Invariants.Predefined.alwaysTrue);
    }
}

export = Task;
