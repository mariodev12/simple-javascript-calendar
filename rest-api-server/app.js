var express = require('express'),
    http = require('http'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    api = 'http://api.tvmaze.com/schedule/full';
var async = require('async');
var tvmazeResponse;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

app.get('/', function(req, res, next){
  async.waterfall([
      function(callback){
        req.get(api, function(error, response, body){
          var events = JSON.stringify(body);
          _.each(events, function(events){
            console.log(events._embedded.show.name)
          });
          /* var show = new tvShow({
            title:
          }) */
        });
      }
  ], function(err, events){
    if(err) next(err);
    events.save(function(err){
      if(err){
        if(err.code == 11000){
          return res.send(409);
        }
        return next(err);
      }
      res.send(200);
    });
  });
});

router.get('/', function(req, res){
  res.send(body);
});

app.use(router);

mongoose.connect('mongodb://localhost/tvshows', function(err, res) {
  if(err) {
    console.log('ERROR: connecting to Database. ' + err);
  } else {
    console.log('Connected!');
   }
  app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
  });
});
