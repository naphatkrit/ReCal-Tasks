var express = require('express');
var router = express.Router();
router.route('/')
    .get(function (req, res) {
    res.json({ message: "Get all tasks" });
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
