var mongoose = require("mongoose");
var Q = require('q');
var updatedStatusPlugin = require("./plugins/updated_status");
var Invariants = require('../lib/invariants');
var TaskGroup;
(function (TaskGroup) {
    var taskGroupSchema = new mongoose.Schema({
        _name: {
            type: String,
            required: true
        }
    });
    taskGroupSchema.virtual('name').get(function () {
        if (this._name === null || this._name === undefined) {
            return '';
        }
        return this._name;
    });
    taskGroupSchema.virtual('name').set(function (newValue) {
        Invariants.check(Invariants.Predefined.isDefinedAndNotNull(newValue));
        this._name = name;
    });
    taskGroupSchema.plugin(updatedStatusPlugin);
    TaskGroup.model = mongoose.model('TaskGroup', taskGroupSchema);
    function invariants(taskGroup) {
        return Q.fcall(function () {
            return [].reduce(Invariants.chain, Invariants.Predefined.alwaysTrue);
        });
    }
    TaskGroup.invariants = invariants;
})(TaskGroup || (TaskGroup = {}));
module.exports = TaskGroup;
