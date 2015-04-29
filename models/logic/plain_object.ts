import assert = require('assert');
import mongoose = require('mongoose');
import Q = require('q');

import models = require('../index');
import Task = require('../task');
import TaskInfo = require('../task_info');
import TaskGroup = require('../task_group');
import PromiseAdapter = require('../../lib/promise_adapter');

module PlainObject
{
    export function convertTaskGroupInstance(taskGroup: TaskGroup.Instance): Q.Promise<Interfaces.TaskGroupPlainObject>
    {
        return Q.fcall(() =>
        {
            assert(taskGroup !== null && taskGroup !== undefined);
            return {
                id: taskGroup.id,
                name: taskGroup.name
            }
        })
    }

    export function convertTaskInfoInstance(taskInfo: TaskInfo.Instance): Q.Promise<Interfaces.TaskInfoPlainObject>
    {

        return Q.fcall(() =>
        {
            assert(taskInfo !== null && taskInfo !== undefined);
        }).then(() =>
        {
            return PromiseAdapter.convertMongoosePromise((<TaskInfo.Instance>taskInfo.populate('_taskGroup')).execPopulate())
        }).then((taskInfo) =>
        {
            return convertTaskGroupInstance(taskInfo.taskGroup);
        }).then((taskGroupPlainObject) =>
        {
            return {
                id: taskInfo.id,
                title: taskInfo.title,
                description: taskInfo.description,
                privacy: taskInfo.privacy,
                taskGroup: taskGroupPlainObject,
                previousVersionId: taskInfo.previousVersion ? (<any> taskInfo.previousVersion) : undefined
            }
        })
    }

    export function convertTaskInstance(task: Task.Instance): Q.Promise<Interfaces.TaskPlainObject>
    {
        return Q.fcall(() =>
        {
            assert(task !== null && task !== undefined);
        }).then(() =>
        {
            return PromiseAdapter.convertMongoosePromise((<Task.Instance>task.populate('_taskInfo')).execPopulate())
        }).then((task) =>
        {
            return convertTaskInfoInstance(task.taskInfo);
        }).then((taskInfoPlainObject) =>
        {
            return {
                id: task.id,
                state: task.state,
                taskInfo: taskInfoPlainObject
            }
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
            description: string,
            privacy: TaskInfo.TaskPrivacy,
            previousVersionId?: string,
            taskGroup: TaskGroupPlainObject,
        }
        export interface TaskPlainObject
        {
            id?: string, // optional since new objects don't have id
            state: Task.TaskState,
            taskInfo: TaskInfoPlainObject,
        }
    }
}

export = PlainObject;
