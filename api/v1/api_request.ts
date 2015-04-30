import assert = require('assert');

export interface ApiRequestSingleObject
{
    serializedObject: string,
}

export function validateApiRequestSingleObject(object: any): boolean
{
    try
    {
        assert(object !== null && object !== undefined);
        assert(typeof object.serializedObject === 'string');
        return true;
    }
    catch (e)
    {
        return false;
    }
}

export function tryGetObject(request: ApiRequestSingleObject): any
{
    try
    {
        return JSON.parse(request.serializedObject);
    }
    catch (e)
    {
        return null;
    }
}
