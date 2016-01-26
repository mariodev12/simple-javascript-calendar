var express = require('express');
var app = express();
var port = process.env.PORT || 8500;
var request = require('request');
var responseJSON;
var result = [];
var parsedDataEvents = [];
var headers = {
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Headers': 'X-Requested-With'
}
var options = {
  url:'http://api.tvmaze.com/schedule/full',
  method: 'GET',
  headers: headers
}
request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    responseJSON = JSON.parse(body);
    for (var i = 0; i < responseJSON.length; i++) {
      parsedDataEvents.push({title: responseJSON[i]._embedded.show.name,
        start: responseJSON[i].airdate, episode: responseJSON[i].season+"x"+responseJSON[i].number });
    }
    var groups = {};
    for (var i = 0; i < responseJSON.length; i++) {
      var item = responseJSON[i];

      if(!groups[item.airdate]){
        groups[item.airdate] = [];
      }
      groups[item.airdate].push({
        title: item._embedded.show.name,
        episode: responseJSON[i].season+"x"+responseJSON[i].number
      });
    }
    for(var x in groups) {
      if(Object.prototype.hasOwnProperty.call(groups, x)) {
        var obj = {};
        obj[x] = groups[x];
        result.push(obj);
      }
    }
  }
});

app.get('/', function(req, res){
  res.json(responseJSON);
});

app.get('/events', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.json(parsedDataEvents);
});
app.get('/events/groupby', function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.json(result);
});
app.listen(port, function(){
  console.log('Listening in on ' + port);
});
