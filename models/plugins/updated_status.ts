import mongoose = require('mongoose');
// TODO doesn't work with find, findOneAndUpdate, etc. See http://mongoosejs.com/docs/middleware.html
export = function updatedStatusPlugin (schema: mongoose.Schema, options) {
    schema.add({
        lastModified: Date,
        created: Date
    })
    schema.pre('save', function(next) {
        let date = new Date()
        this.lastModified = date;
        if (!this.created) {
            this.created = date;
        }
        next();
    })
    if (options && options.index) {
        schema.path('lastModified').index(options.index);
        schema.path('created').index(options.index);
    }
}
