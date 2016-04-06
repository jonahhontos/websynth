var mongoose = require('mongoose'),
    Schema = mongoose.Schema


// ---- Schemas ---- //
// - vcos - //
var vco = {
  oType: String,
  detune: Number,
  gain: Number
}

// - envelope - //
var adsr = {
  attack: Number,
  decay: Number,
  sustain: Number,
  release: Number
}

// - filter - //
var filter = {
  fType: String,
  resonance: Number,
  cutoff: Number
}

// - lfos - //
var lfo = {
  parameter: String,
  amount: Number,
  frequency: Number
}

// - effects go here - //

// - patch - //
var patchSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: String,
  vcos: [vco,vco,vco],
  ampAdsr: adsr,
  filter: filter,
  filterAdsr: adsr,
  lfos: [lfo,lfo,lfo]
})


// ---- Export Module ---- //
var Patch = mongoose.model('Patch', patchSchema)

module.exports = Patch
