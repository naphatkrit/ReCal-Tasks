module.exports = function updatedStatusPlugin(schema, options) {
    schema.add({
        lastModified: Date,
        created: Date
    });
    schema.pre('save', function (next) {
        var date = new Date();
        this.lastModified = date;
        if (!this.created) {
            this.created = date;
        }
        next();
    });
    if (options && options.index) {
        schema.path('lastModified').index(options.index);
        schema.path('created').index(options.index);
    }
};
