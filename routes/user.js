const express = require('express');

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.send("Hello from user route");
});

module.exports = userRouter;

