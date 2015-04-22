// logic about tasks
import Sequelize = require("sequelize");
import models = require("../index");
import ReCalLib = require("../../lib/lib");
import PromiseAdapter = ReCalLib.PromiseAdapter;

module TaskLogic
{
    function modelInstanceExists(model: Sequelize.Model<any, any>, modelId: number): Q.Promise<boolean>
    {
        let promise = PromiseAdapter.convertSequelize(model.count({ where: { id: modelId } }))
        return promise.then(function(count) { return count > 0; })
    }

    export function exportTaskGroup(taskGroupModel: any): Q.Promise<Interfaces.TaskGroupObject>
    {
        return Q.fcall(()=>{
            return {
                id: taskGroupModel.getDataValue('id'),
                name: taskGroupModel.getDataValue('name')
            }
        })
    }

    export function exportTaskInfo(taskInfoModel: any): Q.Promise<Interfaces.TaskInfoObject>
    {
        return taskInfoModel.getTaskGroup()
            .then(exportTaskGroup)
            .then((taskGroupObject)=>{
                return {
                    id: taskInfoModel.getDataValue('id'),
                    title: taskInfoModel.getDataValue('title'),
                    privacy: taskInfoModel.getDataValue('privacy'),
                    taskGroup: taskGroupObject
                };
            })
    }

    export function exportTask(taskModel: any): Q.Promise<Interfaces.TaskObject>
    {
        let taskInfoPromise: Q.Promise<any> = PromiseAdapter.convertSequelize(taskModel.getTaskInfo());
        let userPromise: Q.Promise<any> = PromiseAdapter.convertSequelize(taskModel.getUser());
        return Q.spread([taskInfoPromise, userPromise], (taskInfoModel, userModel)=>
        {
            return exportTaskInfo(taskInfoModel).then((taskInfoObject)=>{
                return {
                    id: taskModel.getDataValue('id'),
                    userId: userModel.getDataValue('id'),
                    status: taskModel.getDataValue('status'),
                    taskInfo: taskInfoObject
                };
            })
        });
    }

    export function createTask(taskObject: Interfaces.TaskObject): Q.Promise<Interfaces.TaskObject>
    {
        return modelInstanceExists(models.TaskGroup, taskObject.taskInfo.taskGroup.id)
            .then((exists) =>
        {
            if (!exists)
            {
                throw new Error("Task Group with ID " + taskObject.taskInfo.taskGroup.id + " does not exist.");
            }
            return modelInstanceExists(models.User, taskObject.userId);
        }).then((exists) =>
        {
            if (!exists)
            {
                throw new Error("User with ID " + taskObject.userId + " does not exist.");
            }
        }).then(() =>
        {
            if (taskObject.id !== null && taskObject.id !== undefined)
            {
                throw new Error("Task ID cannot exist when trying to create a task.");
            }
            if (taskObject.taskInfo.id !== null && taskObject.taskInfo.id !== undefined)
            {
                throw new Error("Task Info ID cannot exist when trying to create a task.");
            }
        }).then(() =>
        {
            return PromiseAdapter.convertSequelize(models.TaskGroup.find(taskObject.taskInfo.taskGroup.id));
        }).then((taskGroupModel) =>
        {
            return PromiseAdapter.convertSequelize(models.TaskInfo.create({
                title: taskObject.taskInfo.title,
                privacy: taskObject.taskInfo.privacy,
                TaskGroupId: taskGroupModel.id
            }))
        }).then((taskInfoModel) =>
        {
            return PromiseAdapter.convertSequelize(models.Task.create({
                status: taskObject.status,
                TaskInfoId: taskInfoModel.id,
                UserId: taskObject.userId
            }))
        }).then(exportTask);
    }
}

module TaskLogic
{
    export module Interfaces
    {
        export interface TaskGroupObject
        {
            id: number,
            name: string
        }
        export interface TaskInfoObject
        {
            id?: number,
            title: string,
            privacy: string,
            taskGroup: TaskGroupObject,
        }
        export interface TaskObject
        {
            id?: number, // optional since new objects don't have id
            userId: number,
            status: string,
            taskInfo: TaskInfoObject,
        }
    }
}

export = TaskLogic;
