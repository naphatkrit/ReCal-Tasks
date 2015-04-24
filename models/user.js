var mongoose = require('mongoose');
var ReCalLib = require("../lib/lib");
var updatedStatusPlugin = require("./plugins/updated_status");
var User;
(function (User) {
    var userSchema = new mongoose.Schema({
        _username: String,
        _tasks: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Task'
            }]
    }, {
        autoIndex: process.env.NODE_ENV === 'development',
    });
    userSchema.virtual('username').get(function () {
        if (this._username === undefined || this._username === null) {
            return "";
        }
        return this._username;
    });
    userSchema.virtual('tasks').get(function () {
        if (this._tasks === undefined || this._tasks === null) {
            return [];
        }
        return this._tasks;
    });
    userSchema.virtual('tasks').set(function (newValue) {
        ReCalLib.Invariants.check(ReCalLib.Invariants.Predefined.isDefinedAndNotNull(newValue));
        this._tasks = newValue;
    });
    userSchema.plugin(updatedStatusPlugin);
    User.model = mongoose.model('User', userSchema);
    function invariants(user) {
        var Invariants = ReCalLib.Invariants;
        return [
            Invariants.Predefined.isNotEmpty(user.username)
        ].reduce(Invariants.chain, Invariants.Predefined.alwaysTrue);
    }
    User.invariants = invariants;
})(User || (User = {}));
module.exports = User;
