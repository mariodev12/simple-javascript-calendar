'use strict';

var showBrowser = {
    tvmazeAPi: 'http://api.tvmaze.com/schedule/full',
    tvMazeApiSearch: 'http://api.tvmaze.com/search/shows?q=',
    listShows: [],
    favShows: [],
    events: [],

    requestSearchShows: function(){
      var that = this;
        $('#search-box').keyup(function(){
        return $.ajax({
          dataType: "json",
          type: "GET",
          url: 'http://api.tvmaze.com/search/shows?q='+ $(this).val(),
          success: that.multisearchShows.bind(this),
        });
      })
    },
    multisearchShows: function(data){
        var that = this;
        var link = [];
        var searchShows = [];
        for (var i = 0; i < data.length; i++) {
          searchShows.push({name: data[i].show.name, id: data[i].show.id});
        }
        $('#suggesstion-box').empty();
        for (var i = 0; i < searchShows.length; i++) {
          /*$('<a>',{
              id: "result",
              text: searchShows[i].name,
              title: searchShows[i].name,
              href: '#'+searchShows[i].id,
              click: function(){
                showBrowser.favShows.push($(this).attr('href'));
              },
          }).wrap('<li><input type="checkbox" value="'+searchShows[i].id+'"/>').parent().appendTo('#suggesstion-box');
          */
          $('<input class="searchResults" type="checkbox" value="'+searchShows[i].name+'"/>' + '<label>'+searchShows[i].name+'</label>')
          .wrap('<li>').parent().appendTo('#suggesstion-box');
        };
        console.log(searchShows);
    },
    addToFav: function(){
        var that = this;
        //that.favShows = [];
        $('.searchResults:checked').each(function(){
            if(that.favShows.indexOf($(this).val()) == -1){
              that.favShows.push($(this).val());
            } else {
              alert('you cant do that');
            }
          });
        //that.saveAll();
        console.log(that.favShows);

    },
    saveAll: function(){
        var that = this;
        var favStrings = null;
        var allEntries;
        var arr = [];
        //var a = localStorage.getItem("favs");
        try {
            favStrings = JSON.stringify(that.favShows);
            localStorage['favs'] = favStrings;
        } catch (e) {
          alert('Error when writing on storage '+e);
        }
    },
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
      var idStrings = localStorage['favs'];
      var idShow = JSON.parse(idStrings);

      for (var i = 0; i < responseJSON.length; i++) {
        for (var j = 0; j < idShow.length; j++) {
            if (responseJSON[i]._embedded.show.name === idShow[j] ) {
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
        this.fullCalendarTv();
    },
    init: function(){
      $.when(this.requestShows(), this.requestSearchShows()).done(function(a1,a2){
        showBrowser.fillTab();
      });
    }
};
document.addEventListener('DOMContentLoaded', function () {
  showBrowser.init();
  console.log(localStorage['favs']);
});
