var User = require('../models/User.js'),
    Patch = require('../models/Patch.js')
    jwt = require('jsonwebtoken')

// ---- Export User Actions ---- //
module.exports = {
  // - register a new user - //
  create: function(req,res){
    var newUser = new User()
    newUser.name = req.body.name
    newUser.password = newUser.generateHash(req.body.password)
    newUser.save(function(err, user){
      if (err) return res.json({success: false, error: err})
      res.json({success:true, user:user})
    })
  },
  // - return all users - //
  index: function(req,res){
    User.find({}, function(err, users){
      if (err) return res.json({success: false, error: err})
      res.json({success:true, users:users})
    })
  },
  // - return a specific user - //
  show: function(req,res){
    User.find({_id: req.params.id}, function(err, user){
      if (err) return res.json({success: false, error: err})
      res.json({success:true, user:user})
    })
  },
  // - log an existing user in - //
  login: function(req,res){
    User.findOne({name: req.body.name}, function(err,user){
      if (err) return res.json({success: false, error: err})
      if (user.validPassword(req.body.password)){
        var token = jwt.sign(user,'secret',{
          expiresInMinutes: 1440
        })
        res.json({success:true,message:'login successful',token:token})
      } else {
        res.json({success:false, message:"password is incorrect"})
      }
    })
  },
  // - add a new patch - //
  createPatch: function(req,res){
    var newPatch = new Patch()
    User.findById(req.params.id, function(err, user){
      if (err) return res.json({success:false, error: err})
      newPatch.user = user
      newPatch.save(function(err, patch){
        if (err) return res.json({success:false, error: err})
        user.patches.push(patch)
        user.save(function(err,user){
          if (err) return res.json({success:false, error: err})
          res.json({success:true, patch: patch})
        })
      })
    })
  },
  // - modify a patch - //
  updatePatch: function(req,res){
    Patch.findOneAndUpdate({_id:req.params.p_id}, req.body, {new:true}, function(err, patch){
      if (err) return res.json({success:false, error: err})
      res.json({success:true, patch: patch})
    })
  }
}
