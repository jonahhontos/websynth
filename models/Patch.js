var mongoose = require('mongoose'),
    Schema = mongoose.Schema


// ---- Schemas ---- //
// - vcos - //
var vcoSchema = new Schema({
  type: String,
  detune: Number,
  gain: Number
})

// - envelope - //
var adsrSchema = new Schema({
  attack: Number,
  decay: Number,
  sustain: Number,
  release: Number
})

// - filter - //
var filterSchema = new Schema({
  type: String,
  resonance: Number,
  cutoff: Number
})

// - lfos - //
var lfoSchema = new Schema({
  parameter: String,
  amount: Number,
  frequency: Number
})

// - effects go here - //

// - patch - //
var patchSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: String,
  vcos: [vcoSchema],
  ampAdsr: adsrSchema,
  filter: filterSchema,
  filterAdsr: adsrSchema,
  lfos: [lfoSchema]
})


// ---- Export Module ---- //
var Patch = mongoose.model('Patch', patchSchema)

module.exports = Patch
