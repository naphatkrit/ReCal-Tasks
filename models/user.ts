import mongoose = require('mongoose');

import ReCalLib = require("../lib/lib");
import updatedStatusPlugin = require("./plugins/updated_status");

let userSchema = new mongoose.Schema({
    _username: String,

}, {
    autoIndex: process.env.NODE_ENV === 'development',
})

userSchema.virtual('username').get(function(): string{
    if (this._username === undefined || this._username === null) {
        return ""
    }
    return this._username;
})

userSchema.plugin(updatedStatusPlugin);

let User = mongoose.model('User', userSchema);

export var model = User;

export function invariants(user) {
    let Invariants = ReCalLib.Invariants;
    return [
        ()=>{
            return this.username.length > 0;
        }
    ].reduce(Invariants.chain, Invariants.alwaysTrue);
}
