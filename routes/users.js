var userCtrl = require('../controllers/users.js'),
    express = require('express'),
    userRouter = express.Router()

// - register - //
userRouter.post('/', userCtrl.create)

// - login - //
userRouter.post('/:id', userCtrl.login)

// - show user - //
userRouter.get('/:id', userCtrl.show)

// - index of users - //
userRouter.get('/', userCtrl.index)
