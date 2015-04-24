var mongoose = require("mongoose");
var ReCalLib = require("../lib/lib");
var Task;
(function (Task) {
    (function (TaskState) {
        TaskState[TaskState["Incomplete"] = 0] = "Incomplete";
        TaskState[TaskState["Complete"] = 1] = "Complete";
    })(Task.TaskState || (Task.TaskState = {}));
    var TaskState = Task.TaskState;
    ;
    var taskSchema = new mongoose.Schema({
        _state: Number,
    }, {
        autoIndex: process.env.NODE_ENV === 'development',
    });
    function stateInvariants(state) {
        var Invariants = ReCalLib.Invariants;
        return [function () {
                return state !== null && state !== undefined;
            }, function () {
                var stateName = TaskState[state];
                return stateName !== null || stateName !== undefined;
            }].reduce(Invariants.chain, Invariants.alwaysTrue);
    }
    taskSchema.virtual('state').get(function () {
        if (this._state === null || this._state === undefined) {
            return TaskState.Incomplete;
        }
        ReCalLib.Invariants.check(stateInvariants(this._state));
        return this._state;
    });
    taskSchema.virtual('state').set(function (newState) {
        ReCalLib.Invariants.check(stateInvariants(newState));
        this._state = newState;
    });
    Task.model = mongoose.model("Task", taskSchema);
    function invariants(task) {
        var Invariants = ReCalLib.Invariants;
        return [
            stateInvariants(task.state)
        ].reduce(Invariants.chain, Invariants.alwaysTrue);
    }
    Task.invariants = invariants;
})(Task || (Task = {}));
module.exports = Task;
