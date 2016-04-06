var User = require('../models/User.js'),
    Patch = require('../models/Patch.js'),
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
    User.findById(req.params.id)
        .populate('patches')
        .exec(function(err, user){
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
    var newPatch = blankPatch(req.body.name)
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
  // - get patch data - //
  showPatch: function(req,res){
    Patch.findById(req.params.p_id)
         .populate('user')
         .exec(function(err,patch){
           if (err) return res.json({success:false, error: err})
           res.json({success:true, patch:patch})
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


// ---- Generate a New Default Patch ---- //
function blankPatch(name){
  // -- set vars with defaults -- //
  // - vcos - //
  var vcos = [{
      oType: 'sine',
      detune: 0,
      gain: 0.5
    },
    {
      oType: 'sine',
      detune: -8,
      gain: 0
    },
    {
      oType: 'sine',
      detune: 8,
      gain: 0
    }]

  // - envelope - //
  var adsr = {
    attack: 0,
    decay: 0,
    sustain: 1,
    release: 0
  }

  // - filter - //
  var filter = {
    fType: 'lowpass',
    resonance: 0,
    cutoff: 20000
  }

  // - lfos - //
  var lfo = {
    parameter: null,
    amount: 0.1,
    frequency: 1
  }


  // -- return a new patch object -- //
  return new Patch({
    name: name,
    vcos: vcos,
    ampAdsr: adsr,
    filter: filter,
    filterAdsr: adsr,
    lfos: [lfo,lfo,lfo]
  })
}
