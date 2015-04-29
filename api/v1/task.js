var express = require('express');
var ApiResponse = require('./api_response');
var Query = require('../../models/logic/query');
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
    res.json({ message: "Post a new task" });
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
