var express = require('express');
var taskRouter = require('./task');
var router = express.Router();
router.use('/task', taskRouter);
module.exports = router;
