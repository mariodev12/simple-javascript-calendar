var express = require('express');
var app = express();
var port = process.env.PORT || 8500;
var request = require('request');
var responseJSON;
var parsedDataEvents = [];
var options = {
  url:'http://api.tvmaze.com/schedule/full',
  method: 'GET'
}
request('http://api.tvmaze.com/schedule/full', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    responseJSON = JSON.parse(body);
    for (var i = 0; i < responseJSON.length; i++) {
      parsedDataEvents.push({title: responseJSON[i]._embedded.show.name,
        start: responseJSON[i].airdate, episode: responseJSON[i].season+"x"+responseJSON[i].number });
    }
  }
});
app.get('/', function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.json(responseJSON);
});

app.get('/events', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.json(parsedDataEvents);
});

app.listen(port, function(){
  console.log('Listening in on ' + port);
});
