var mongoose = require("mongoose");
var Q = require('q');
var updatedStatusPlugin = require("./plugins/updated_status");
var Invariants = require("../lib/invariants");
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
        _taskInfo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TaskInfo'
        }
    }, {
        autoIndex: process.env.NODE_ENV === 'development',
    });
    function stateInvariants(state) {
        return [
            Invariants.Predefined.isDefinedAndNotNull(state),
            function () {
                var stateName = TaskState[state];
                return stateName !== null || stateName !== undefined;
            }
        ].reduce(Invariants.chain, Invariants.Predefined.alwaysTrue);
    }
    taskSchema.virtual('state').get(function () {
        if (this._state === null || this._state === undefined) {
            return TaskState.Incomplete;
        }
        Invariants.check(stateInvariants(this._state));
        return this._state;
    });
    taskSchema.virtual('state').set(function (newState) {
        Invariants.check(stateInvariants(newState));
        this._state = newState;
    });
    taskSchema.virtual('taskInfo').get(function () {
        if (this._taskInfo === undefined) {
            return null;
        }
        return this._taskInfo;
    });
    taskSchema.virtual('taskInfo').set(function (newValue) {
        this._taskInfo = newValue;
    });
    taskSchema.plugin(updatedStatusPlugin);
    Task.model = mongoose.model("Task", taskSchema);
    function invariants(task) {
        return Q.fcall(function () {
            return [
                stateInvariants(task.state)
            ].reduce(Invariants.chain, Invariants.Predefined.alwaysTrue);
        });
    }
    Task.invariants = invariants;
})(Task || (Task = {}));
module.exports = Task;
