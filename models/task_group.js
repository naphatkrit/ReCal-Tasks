var mongoose = require("mongoose");
var ReCalLib = require("../lib/lib");
var updatedStatusPlugin = require("./plugins/updated_status");
var TaskGroup;
(function (TaskGroup) {
    var taskGroupSchema = new mongoose.Schema({
        _name: String
    });
    taskGroupSchema.virtual('name').get(function () {
        if (this._name === null || this._name === undefined) {
            return '';
        }
        return this._name;
    });
    taskGroupSchema.virtual('name').set(function (newValue) {
        ReCalLib.Invariants.check(ReCalLib.Invariants.Predefined.isDefinedAndNotNull(newValue));
        this._name = name;
    });
    taskGroupSchema.plugin(updatedStatusPlugin);
    TaskGroup.model = mongoose.model('TaskGroup', taskGroupSchema);
    function invariants(taskGroup) {
        var Invariants = ReCalLib.Invariants;
        return [].reduce(Invariants.chain, Invariants.Predefined.alwaysTrue);
    }
    TaskGroup.invariants = invariants;
})(TaskGroup || (TaskGroup = {}));
module.exports = TaskGroup;
