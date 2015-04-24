import mongoose = require("mongoose");

import ReCalLib = require("../lib/lib");

module Task {
    export enum TaskState {Incomplete, Complete};

    let taskSchema = new mongoose.Schema({
        _state: Number,
    }, {
        autoIndex: process.env.NODE_ENV === 'development',
    });

    function stateInvariants(state: TaskState) {
        let Invariants = ReCalLib.Invariants;
        return [()=>{
            return state !== null && state !== undefined;
        }, ()=>{
            let stateName = TaskState[state];
            return stateName !== null || stateName !== undefined;
        }].reduce(Invariants.chain, Invariants.alwaysTrue)
    }

    taskSchema.virtual('state').get(function(): TaskState {
        if (this._state === null || this._state === undefined) {
            return TaskState.Incomplete;
        }
        ReCalLib.Invariants.check(stateInvariants(this._state));
        return this._state;
    })
    taskSchema.virtual('state').set(function(newState: TaskState){
        ReCalLib.Invariants.check(stateInvariants(newState));
        this._state = newState;
    })

    export var model = mongoose.model("Task", taskSchema);

    export function invariants(task) {
        let Invariants = ReCalLib.Invariants;
        return [
            stateInvariants(task.state)
        ].reduce(Invariants.chain, Invariants.alwaysTrue);
    }
}

export = Task;
