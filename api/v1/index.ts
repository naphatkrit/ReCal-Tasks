import express = require('express');

import taskRouter = require('./task');

let router = express.Router();

router.use('/task', taskRouter);

export = router;
