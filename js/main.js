'use strict';

var showBrowser = {

    todayShow: undefined,
    currentNetwork: undefined,
    tvmazeAPi: 'http://api.tvmaze.com/schedule/full',
    listShows: [],
    favShows: [],
    events: [],

    requestShows: function(){
        return $.ajax({
                dataType: "json",
                type: "GET",
                url: this.tvmazeAPi,
                success: this.getTvShowFromMaze.bind(this),
                error: this.loadErrors,
                beforeSend: function(){
                  $('#loading').show();
                },
                complete: function(){
                  $('#loading').hide();
                }
        });
    },
    loadErrors : function(x,t,m) {
		    console.log("Error while loading",x,t,m);
	  },
    getTvShowFromMaze: function(responseJSON){
      var data = JSON.stringify(responseJSON);
      /*var show = new Show(responseJSON[i].show.name, responseJSON[i].name,
        responseJSON[i].show.schedule.time, responseJSON[i].show.network.name);
      this.listShows.push(show);*/
      var networks = ["Teen Wolf","TNT","CBS","Showtime","ABC","Discovery","HBO","AMC","CNN","The CW","NBC","USA","BBC"];
      var time = ["06:00","20:00","20:30","21:00","21:30","22:00"];

      for (var i = 0; i < responseJSON.length; i++) {
        for (var j = 0; j < networks.length; j++) {
            if (responseJSON[i]._embedded.show.name === networks[j] ) {
              this.events.push({title: responseJSON[i]._embedded.show.name, start: responseJSON[i].airdate});
            }
          }
      };
    },
    populateSelectNetworks: function(){
      var _arr = [];
      var _cleanArr = [];
      var _cleanWithoutSpace = [];

      for (var i = 0; i < this.listShows.length; i++) {
        _arr.push(this.listShows[i].network);
      }
      $.each(_arr, function(i,val){
        if($.inArray(val, _cleanArr) === -1) _cleanArr.push(val);
      });
      for (var i = 0; i < _cleanArr.length; i++) {
        _cleanWithoutSpace.push(_cleanArr[i].split(' ').join('-'));
      }
      for (var i = 0; i < _cleanArr.length; i++) {
        for (var i = 0; i < _cleanWithoutSpace.length; i++) {
            $('#networkShows').append('<option value="'+_cleanWithoutSpace[i]+'">'+_cleanArr[i]+'</option>');
        }
      }
    },
    fullCalendarTv: function(){
      $('#calendar').fullCalendar({
        events: this.events
      });
    },
    selectFromOption: function(){
      $('#networkShows').change(function(){
        this.currentNetwork = this.value.split('-').join(' ');
      });

    },
    fillTab: function(){
        $('<ul></ul>');

        for (var i = 0; i < this.listShows.length; i++) {
          if(this.listShows[i].network === this.currentNetwork){
            $('#tvshow-app-chrome-extension__list').append('<li>'+this.listShows[i].title+" on "+this.listShows[i].network+'</li>');
          }
        }
        //this.selectFromOption();
        //this.populateSelectNetworks();
        this.fullCalendarTv();
        //this.formatEvents();
    },
    start: function(){
      $.when(this.requestShows()).done(function(a1){
        showBrowser.fillTab();
      });
    }
};
document.addEventListener('DOMContentLoaded', function () {
  showBrowser.start();
});
