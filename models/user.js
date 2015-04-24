var mongoose = require('mongoose');
var ReCalLib = require("../lib/lib");
var updatedStatusPlugin = require("./plugins/updated_status");
var userSchema = new mongoose.Schema({
    _username: String,
}, {
    autoIndex: process.env.NODE_ENV === 'development',
});
userSchema.virtual('username').get(function () {
    if (this._username === undefined || this._username === null) {
        return "";
    }
    return this._username;
});
userSchema.plugin(updatedStatusPlugin);
var User = mongoose.model('User', userSchema);
exports.model = User;
function invariants(user) {
    var _this = this;
    var Invariants = ReCalLib.Invariants;
    return [
        function () {
            return _this.username.length > 0;
        }
    ].reduce(Invariants.chain, Invariants.alwaysTrue);
}
exports.invariants = invariants;
