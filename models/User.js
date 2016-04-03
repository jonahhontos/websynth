var mongoose = require('mongoose')

module.exports = new mongoose.model('User',{
  name: String,
  password: String,
  patches: [{type: mongoose.Schema.Types.ObjectId, ref:'Patch'}]
})
