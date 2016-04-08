// ---- Dependecies ---- //
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    userRoutes = require('./routes/users.js')

var PORT = process.env.PORT || 3000

// ---- DB Connection ---- //
mongoose.connect('mongodb://websynth:websynth@ds021010.mlab.com:21010/websynth', function(){
  console.log('mongodb connected')
})


// ---- Middleware ---- //
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))


// ---- Routes ---- //
app.get('/', function(req,res){
  res.sendFile('index.html')
})
app.use('/users',userRoutes)


// ---- Run Server ---- //
app.listen(3000, function(){
  console.log('server running on port 3000');
})
