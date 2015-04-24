import mongoose = require('mongoose');
import updatedStatusPlugin = require("./plugins/updated_status");

let userSchema = new mongoose.Schema({
    username: String,
}, {
    autoIndex: process.env.NODE_ENV === 'development',
})

userSchema.plugin(updatedStatusPlugin);

let User = mongoose.model('User', userSchema);

export = User;
