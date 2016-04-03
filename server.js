var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/websynth', function(){
  console.log('mongodb connected')
})

app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.get('/', function(req,res){
  res.sendFile('index.html')
})

app.listen(3000, function(){
  console.log('server running on port 3000');
})
