import express = require('express');
import Q = require('q');

import ApiRequest = require('./api_request');
import ApiResponse = require('./api_response');
import PromiseAdapter = require('../../lib/promise_adapter');
import PlainObject = require('../../models/logic/plain_object');
import Query = require('../../models/logic/query');
import TaskLogic = require('../../models/logic/task_logic');

const router = express.Router();

router.route('/')
    .get((req: express.Request, res: express.Response) =>
{
    Query.getTasksForUser(req.user.userId).done(
        (tasks) =>
        {
            res.json(ApiResponse.createResponse(tasks))
        }, (err) =>
        {
            res.sendStatus(500);
        })
})
    .post((req: express.Request, res: express.Response) =>
{
    if (!ApiRequest.validateApiRequestSingleObject(req.body)) {
        // bad request
        res.sendStatus(400);
    }
    const request = <ApiRequest.ApiRequestSingleObject> req.body;
    const requestObject = ApiRequest.tryGetObject(request);
    if (requestObject === null || requestObject === undefined) {
        // not a JSON string
        res.sendStatus(400);
    }
    if (!PlainObject.validateTaskPlainObject(requestObject)) {
        // not a valid task
        res.sendStatus(400);
    }
    const task = <PlainObject.Interfaces.TaskPlainObject> requestObject;
    TaskLogic.createTask(task).then((task)=>{
        // TODO add task to user
        res.json(task);
    }).fail(()=>{
        res.sendStatus(400);
    })
})

router.route('/:task_id')
    .get((req: express.Request, res: express.Response) =>
{
    // TODO
    res.json({ message: "Get specific task with id " + req.params.task_id });
})
    .put((req: express.Request, res: express.Response) =>
{
    // TODO
    res.json({ message: "Update task with id " + req.params.task_id });
})
    .delete((req: express.Request, res: express.Response) =>
{
    // TODO
    res.json({ message: "delete task with id " + req.params.task_id });
})

export = router;
