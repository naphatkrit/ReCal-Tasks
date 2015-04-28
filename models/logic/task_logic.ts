import assert = require('assert');
import mongoose = require('mongoose');
import Q = require('q');

import PromiseAdapter = require('../../lib/promise_adapter');
import PlainObject = require('./plain_object');

import Task = require('../task');
import TaskInfo = require('../task_info');
import TaskGroup = require('../task_group');

module TaskLogic
{
    export function createTaskInfo(taskInfoPlainObject: PlainObject.Interfaces.TaskInfoPlainObject): Q.Promise<PlainObject.Interfaces.TaskInfoPlainObject>
    {
        return Q.fcall(() =>
        {
            assert(taskInfoPlainObject !== null && taskInfoPlainObject !== undefined);
            assert(taskInfoPlainObject.id === null || taskInfoPlainObject.id === undefined);
        }).then(() =>
        {
            return PromiseAdapter.convertMongooseQuery(TaskGroup.model.count({
                _id: (<any>mongoose.Types.ObjectId)(taskInfoPlainObject.taskGroup.id),
                _name: taskInfoPlainObject.taskGroup.name
            })).then((count) => { assert(count > 0, "Task Group Plain Object must correspond to a valid Task Group instance.") })
        }).then(() =>
        {
            const taskInfo = <TaskInfo.Instance> new TaskInfo.model({
                _title: taskInfoPlainObject.title,
                _description: taskInfoPlainObject.description,
                _privacy: taskInfoPlainObject.privacy,
                _taskGroup: (<any>mongoose.Types.ObjectId)(taskInfoPlainObject.taskGroup.id),
            })
            return PromiseAdapter.convertMongooseDocumentSave(taskInfo);
        }).then((taskInfo)=>{
            return PlainObject.convertTaskInfoInstance(taskInfo)
        })
    }

    export function updateTaskInfo(taskInfoPlainObject: PlainObject.Interfaces.TaskInfoPlainObject): Q.Promise<PlainObject.Interfaces.TaskInfoPlainObject>
    {
        return Q.fcall(() =>
        {
            assert(taskInfoPlainObject !== null && taskInfoPlainObject !== undefined);
            assert(taskInfoPlainObject.id !== null && taskInfoPlainObject.id !== undefined);
        }).then(() =>
        {
            return PromiseAdapter.convertMongooseQuery(TaskGroup.model.count({
                _id: (<any>mongoose.Types.ObjectId)(taskInfoPlainObject.taskGroup.id),
                _name: taskInfoPlainObject.taskGroup.name
            })).then((count) => { assert(count > 0, "Task Group Plain Object must correspond to a valid Task Group instance.") })
        }).then(() =>
        {
            return PromiseAdapter.convertMongooseQuery(TaskInfo.model.findById(taskInfoPlainObject.id))
        }).then((taskInfo: TaskInfo.Instance)=>{
            taskInfo.title = taskInfoPlainObject.title;
            taskInfo.description = taskInfoPlainObject.description;
            taskInfo.privacy = taskInfoPlainObject.privacy;
            taskInfo.taskGroup = (<any>mongoose.Types.ObjectId)(taskInfoPlainObject.taskGroup.id);
            return PromiseAdapter.convertMongooseDocumentSave(taskInfo);
        }).then((taskInfo)=>{
            return PlainObject.convertTaskInfoInstance(taskInfo)
        })
    }

    export function createTask(taskPlainObject: PlainObject.Interfaces.TaskPlainObject): Q.Promise<PlainObject.Interfaces.TaskPlainObject>
    {
        return null;
    }
}
export = TaskLogic;
