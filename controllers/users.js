var User = require('../models/User.js')

module.exports = {
  // - register a new user - //
  create: function(req,res){
    var newUser = new User()
    newUser.name = req.body.name

  },
  // - return all users - //
  index: function(req,res){

  },
  // - return a specific user - //
  show: function(req,res){

  },
  // - log an existing user in - //
  login: function(req,res){
    
  }
}
