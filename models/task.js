var mongoose = require("mongoose");
var ReCalLib = require("../lib/lib");
(function (TaskState) {
    TaskState[TaskState["Incomplete"] = 0] = "Incomplete";
    TaskState[TaskState["Complete"] = 1] = "Complete";
})(exports.TaskState || (exports.TaskState = {}));
var TaskState = exports.TaskState;
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
var Task = mongoose.model("Task", taskSchema);
exports.model = Task;
function invariants(task) {
    var Invariants = ReCalLib.Invariants;
    return [
        stateInvariants(task.state)
    ].reduce(Invariants.chain, Invariants.alwaysTrue);
}
exports.invariants = invariants;
