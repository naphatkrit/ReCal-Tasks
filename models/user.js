var mongoose = require('mongoose');
var updatedStatusPlugin = require("./plugins/updated_status");
var userSchema = new mongoose.Schema({
    username: String,
}, {
    autoIndex: process.env.NODE_ENV === 'development',
});
userSchema.plugin(updatedStatusPlugin);
var User = mongoose.model('User', userSchema);
module.exports = User;
