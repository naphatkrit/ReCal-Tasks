import express = require('express');
import Q = require('q');

import ApiResponse = require('./api_response');
import PromiseAdapter = require('../../lib/promise_adapter');
import Query = require('../../models/logic/query');

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
    // TODO
    res.json({ message: "Post a new task" });
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
