import express = require('express');

let router = express.Router();

router.route('/')
    .get((req: express.Request, res: express.Response) =>
{
    res.json({ message: "Get all tasks" });
})
    .post((req: express.Request, res: express.Response) =>
{
    res.json({ message: "Post a new task" });
})

router.route('/:task_id')
    .get((req: express.Request, res: express.Response) =>
{
    res.json({ message: "Get specific task with id " + req.params.task_id });
})
    .put((req: express.Request, res: express.Response) =>
{
    res.json({ message: "Update task with id " + req.params.task_id });
})
    .delete((req: express.Request, res: express.Response) =>
{
    res.json({ message: "delete task with id " + req.params.task_id });
})

export = router;
