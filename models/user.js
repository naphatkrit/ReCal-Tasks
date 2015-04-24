var mongoose = require('mongoose');
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
module.exports = User;
