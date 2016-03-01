var express = require('express');
var app = express();
var port = process.env.PORT || 8500;
var request = require('request');
var responseJSON;
var traktResponse;
var result = [];
var parsedDataEvents = [];
var trakt = [];
var headers = {
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Headers': 'X-Requested-With'
}
var options = {
  url:'http://api.tvmaze.com/schedule/full',
  method: 'GET',
  headers: headers
}
request({
  method: 'GET',
  url: 'https://api-v2launch.trakt.tv/calendars/all/shows/2016-01-01/366',
  headers: {
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': ''
  }}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var traktResponse = JSON.parse(body);
      for (var i = 0; i < traktResponse.length; i++) {
        trakt.push({title: traktResponse[i].show.title, start: traktResponse[i].first_aired.substring(0,10),
        episode: traktResponse[i].episode.season+"x"+traktResponse[i].episode.number });
      }
    }
});

request({
  method: 'GET',
  url: 'https://api-v2launch.trakt.tv/calendars/all/shows/2016-01-01/366',
  headers: {
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': ''
  }}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    traktResponse = JSON.parse(body);
    for (var i = 0; i < traktResponse.length; i++) {
      trakt.push({title: traktResponse[i].show.title, start: traktResponse[i].first_aired.substring(0,10),
      episode: traktResponse[i].episode.season+"x"+traktResponse[i].episode.number });
    }
    var groups = {};
    for (var i = 0; i < traktResponse.length; i++) {
      var item = traktResponse[i];

      if(!groups[item.first_aired.substring(0,10)]){
        groups[item.first_aired.substring(0,10)] = [];
      }
      groups[item.first_aired.substring(0,10)].push({
        title: item.show.title,
        episode: traktResponse[i].episode.season+"x"+traktResponse[i].episode.number
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
app.get('/traktApi', function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.json(trakt);
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
