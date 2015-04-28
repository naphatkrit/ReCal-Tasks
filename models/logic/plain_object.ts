import models = require('../index');
import Task = require('../task');
import TaskInfo = require('../task_info');
import TaskGroup = require('../task_group');
import Q = require('q');

module PlainObject
{
    export function convertTaskGroupInstance(taskGroup: TaskGroup.Instance): Q.Promise<Interfaces.TaskGroupPlainObject>
    {
        return Q.fcall(() =>
        {
            return {
                id: taskGroup.id,
                name: taskGroup.name
            }
        })
    }

    export function convertTaskInstance(task: Task.Instance): Q.Promise<Interfaces.TaskPlainObject>
    {
        // TODO
        return Q.fcall(() =>
        {
            return null;
        })
    }
}

module PlainObject
{
    export module Interfaces
    {
        export interface TaskGroupPlainObject
        {
            id: string,
            name: string
        }
        export interface TaskInfoPlainObject
        {
            id?: string,
            title: string,
            privacy: string,
            taskGroup: TaskGroupPlainObject,
        }
        export interface TaskPlainObject
        {
            id?: string, // optional since new objects don't have id
            userId: number,
            status: string,
            taskInfo: TaskInfoPlainObject,
        }
    }
}

export = PlainObject;
