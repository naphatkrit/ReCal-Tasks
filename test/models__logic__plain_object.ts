import mocha = require('mocha');
import assert = require('assert');

import Models = require('../models/index');
import TaskGroup = require('../models/task_group');
import Invariants = require('../lib/invariants');
import PromiseAdapter = require('../lib/promise_adapter');
import PlainObject = require('../models/logic/plain_object');

describe('Models Logic - Plain Object Unit Tests', () =>
{
    before((done) =>
    {
        Models.connection.once('error', (error) =>
        {
            done(error);
        })
        Models.connection.once('open', () =>
        {
            done();
        })
    })

    describe('Task Group Plain Object', () =>
    {
        var taskGroupId = '';
        beforeEach((done)=>{
            let taskGroup = new TaskGroup.model({
                _name: "Dummy Task Group"
            });
            taskGroup.save<TaskGroup.Instance>((err, taskGroup)=>{
                taskGroupId = taskGroup.id;
                return TaskGroup.invariants(taskGroup).then((invariants)=>{
                    // console.log(invariants.toString())
                    Invariants.check(invariants);
                    done();
                },(err)=>{
                    done(err);
                })
            })

        })
        afterEach((done)=>{
            TaskGroup.model.remove({ _id: taskGroupId }, (err)=>{
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
        })
        it('Should successfully create a plain object', ()=>{
            return PromiseAdapter.convertMongooseQuery(TaskGroup.model.findById(taskGroupId))
            .then((taskGroupInstance: TaskGroup.Instance)=>{
                return PlainObject.convertTaskGroupInstance(taskGroupInstance);
            })
        });
    })
})
