var assert = require('assert');
function validateApiRequestSingleObject(object) {
    try {
        assert(object !== null && object !== undefined);
        assert(typeof object.serializedObject === 'string');
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.validateApiRequestSingleObject = validateApiRequestSingleObject;
function tryGetObject(request) {
    try {
        return JSON.parse(request.serializedObject);
    }
    catch (e) {
        return null;
    }
}
exports.tryGetObject = tryGetObject;
