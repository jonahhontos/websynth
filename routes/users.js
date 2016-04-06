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

// - add a patch - //
userRouter.post('/:id/patches', userCtrl.createPatch)

// - update a patch - //
userRouter.patch('/:u_id/patches/:p_id', userCtrl.updatePatch)

// - get patch data - //
userRouter.get('/:u_id/patches/:p_id', userCtrl.showPatch)


// ---- Export Module ---- //
module.exports = userRouter
