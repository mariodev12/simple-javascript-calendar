var express = require('express');
var app = express();
var port = process.env.PORT || 8500;
var request = require('request');

var options = {
  url:'http://api.tvmaze.com/schedule/full',
  method: 'GET'
}
app.get('/', function(req, res){
  request('http://api.tvmaze.com/schedule/full', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body)); // Show the HTML for the Google homepage.
    }
  })
});

app.get('/joke/random', function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var index = Math.floor(Math.random() * jokes.length);
  var randomQuote = jokes[index];
  res.json(randomQuote);
});

app.get('/joke/:id', function(req, res) {
  if(jokes.length <= req.params.id || req.params.id < 0) {
    res.statusCode = 404;
    return res.send('Error 404: No joke found');
  }
var q = jokes[req.params.id];
  res.json(q);
});

app.listen(port, function(){
  console.log('Listening in on ' + port);
});
