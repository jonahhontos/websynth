var User = require('../models/User.js')

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
        res.json({success:true, message:"password is correct"})
      } else {
        res.json({success:false, message:"password is incorrect"})
      }
    })
  }
}
