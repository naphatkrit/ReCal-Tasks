var express = require('express');
var ApiRequest = require('./api_request');
var ApiResponse = require('./api_response');
var PlainObject = require('../../models/logic/plain_object');
var Query = require('../../models/logic/query');
var TaskLogic = require('../../models/logic/task_logic');
var UserLogic = require('../../models/logic/user_logic');
var router = express.Router();
router.route('/')
    .get(function (req, res) {
    Query.getTasksForUser(req.user.userId).done(function (tasks) {
        res.json(ApiResponse.createResponse(tasks));
    }, function (err) {
        res.sendStatus(500);
    });
})
    .post(function (req, res) {
    if (!ApiRequest.validateApiRequestSingleObject(req.body)) {
        res.sendStatus(400);
    }
    var request = req.body;
    var requestObject = ApiRequest.tryGetObject(request);
    if (requestObject === null || requestObject === undefined) {
        res.sendStatus(400);
    }
    if (!PlainObject.validateTaskPlainObject(requestObject)) {
        res.sendStatus(400);
    }
    var task = requestObject;
    TaskLogic.createTask(task).then(function (task) {
        return Query.getUser(req.user.id).then(function (user) {
            return UserLogic.addTask(user, task);
        }).then(function () {
            res.json(ApiResponse.createResponse([task]));
        });
    }).fail(function () {
        res.sendStatus(400);
    });
});
router.route('/:task_id')
    .get(function (req, res) {
    res.json({ message: "Get specific task with id " + req.params.task_id });
})
    .put(function (req, res) {
    res.json({ message: "Update task with id " + req.params.task_id });
})
    .delete(function (req, res) {
    res.json({ message: "delete task with id " + req.params.task_id });
});
module.exports = router;
