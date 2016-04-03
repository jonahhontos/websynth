// ---- Dependecies ---- //
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose')


// ---- DB Connection ---- //
mongoose.connect('mongodb://localhost/websynth', function(){
  console.log('mongodb connected')
})


// ---- Middleware ---- //
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))


// ---- Routes ---- //
app.get('/', function(req,res){
  res.sendFile('index.html')
})


// ---- Run Server ---- //
app.listen(3000, function(){
  console.log('server running on port 3000');
})
