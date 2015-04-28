var Q = require('q');
var PlainObject;
(function (PlainObject) {
    function convertTaskGroupInstance(taskGroup) {
        return Q.fcall(function () {
            return {
                id: taskGroup.id,
                name: taskGroup.name
            };
        });
    }
    PlainObject.convertTaskGroupInstance = convertTaskGroupInstance;
    function convertTaskInstance(task) {
        return Q.fcall(function () {
            return null;
        });
    }
    PlainObject.convertTaskInstance = convertTaskInstance;
})(PlainObject || (PlainObject = {}));
module.exports = PlainObject;
