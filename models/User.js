// ---- Dependecies ---- //
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs')


// ---- Schema ---- //
var userSchema = new mongoose.Schema({
  name: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  patches: [{type: mongoose.Schema.Types.ObjectId, ref:'Patch'}]
})


// ---- Password Encryption ---- //
userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password)
}


// ---- Export Module ---- //
var User = mongoose.model('User', userSchema)

module.exports = User
