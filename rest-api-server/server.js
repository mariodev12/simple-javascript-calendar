var express = require('express');
var app = express();
var port = process.env.PORT || 8500;
var request = require('request');

app.listen(port, function(){
  console.log('Listening in on ' + port);
});
