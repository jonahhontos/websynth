// ---- Dependecies ---- //
var userCtrl = require('../controllers/users.js'),
    express = require('express'),
    userRouter = express.Router()


// ---- Routes ---- //
// - register - //
userRouter.post('/', userCtrl.create)

// - login - //
userRouter.post('/login', userCtrl.login)

// - show user - //
userRouter.get('/:id', userCtrl.show)

// - index of users - //
userRouter.get('/', userCtrl.index)


// ---- Export Module ---- //
module.exports = userRouter
