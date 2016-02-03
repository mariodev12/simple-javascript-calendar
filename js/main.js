'use strict';
var showBrowser = {
    tvmazeAPi: 'http://localhost:8500/traktApi',
    tvMazeApiSearch: 'http://api.tvmaze.com/search/shows?q=',
    listShows: [],
    events: [],

    checkValue: function(){
      var ref = new Firebase("https://tvshow.firebaseio.com/users");
      var authData = ref.getAuth();
      ref.once("value", function(snapshot){
        console.log(snapshot.child("9feef388-88c7-4d4f-a3dd-9c6529ee4ada/following/Castle").exists());
      });
    },
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
        var ref = new Firebase("https://tvshow.firebaseio.com/users");
        var authData = ref.getAuth();
        var checkValueFollow = new Firebase('https://tvshow.firebaseio.com/users/'+ authData.uid +'/following');
        checkValueFollow.once('value', function(snapshot){
          return snapshot.val();
        });
        var showData = JSON.parse(localStorage.getItem('favShows'));
        console.log(showData);
        var that = this;
        var searchShows = [];
        for (var i = 0; i < data.length; i++) {
          searchShows.push({name: data[i].show.name, id: data[i].show.id});
        }
        $('#suggesstion-box').empty();
        for (var i = 0; i < searchShows.length; i++) {
          $('#suggesstion-box').append('<li/>');
          var nameShow = searchShows[i].name;
          var noSpacenameShow = nameShow.replace(/['.]/g, "_");
          var noNoSpacenameShow = noSpacenameShow.split(' ').join('_');
          console.log(noNoSpacenameShow);
          var checkValue = ref.once("value", function(snapshot){
            return snapshot.child(authData.uid+"/following/"+noNoSpacenameShow).exists();
          });
          console.log(checkValue);
            if(checkValue){
              $('#suggesstion-box li:last').append(
                $('<i />', {
                  class: 'fa fa-heart fav unfollowing',
                  'data-value': searchShows[i].name,
                  click: function(e){
                    console.log($(this).data('value'));
                    var noSplit = $(this).data('value');
                    var splitJoinValue = $(this).data('value').split(' ').join('_');
                    console.log(splitJoinValue);
                    var ref = new Firebase("https://tvshow.firebaseio.com/users");
                    var authData = ref.getAuth();
                    console.log(authData.uid);
                    var following = new Firebase('https://tvshow.firebaseio.com/users/'+ authData.uid +'/following');
                    //var index = $.inArray($(this).data('value'), showData);
                    var checkValue = ref.once("value", function(snapshot){
                      return snapshot.child(authData.uid+"/following/"+splitJoinValue).exists();
                    });
                    if(checkValue){
                      var dataS = new Firebase('https://tvshow.firebaseio.com/users/'+ authData.uid +'/following/'+splitJoinValue);
                      dataS.set(noSplit);
                      //following.set({ splitJoinValue: $(this).data('value')});
                    } else {
                      console.log('error');
                    }
                    $(this).removeClass('unfollowing');
                    $(this).addClass('following');
                  }
                })
              );
            } else {
              $('#suggesstion-box li:last').append(
                $('<i />', {
                  class: 'fa fa-heart fav following',
                  'data-value': searchShows[i].name,
                  click: function(e){
                    var index = $.inArray($(this).data('value'), showData);
                    if(index > -1){
                      showData.splice(index, 1);
                    }
                    localStorage['favShows'] = JSON.stringify(showData);
                    $(this).removeClass('following');
                    $(this).addClass('unfollowing');
                  }
                })
              );
            }
          $('#suggesstion-box li:last').append(
            $('<label />', {
                'text': searchShows[i].name,
            })
          );
        };
    },
    addToFav: function(){
      var data = JSON.parse(localStorage['favShows']);
      var index;
      var dataValue;
      $('.fav').on('click', function(){
        if($(this).hasClass('unfollowing')){
          index = data.indexOf($(this).data('value'));
          if(index > -1){
            data.splice(index, 1);
          }
          //insertar data en localStorage['favShows']
          localStorage['favShows'] = JSON.stringify(data);
          $(this).removeClass('unfollowing');
          $(this).addClass('following');

        } else {
          dataValue = $('.following').data('value');
          data.push(dataValue);
          localStorage['favShows'] = JSON.stringify(data);
          $(this).removeClass('following');
          $(this).addClass('unfollowing');
        }
      });
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
      var idStrings = localStorage['favShows'];
      var idShow = JSON.parse(idStrings);
      for (var i = 0; i < responseJSON.length; i++) {
        for (var j = 0; j < idShow.length; j++) {
            if (responseJSON[i].title === idShow[j] ) {
              this.events.push({title: responseJSON[i].title,
                start: responseJSON[i].start, episode: responseJSON[i].episode });
            }
          }
      };
    },
    populateSelectNetworks: function(){
      var _data;
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
        header: {
            left: 'prev',
            center: 'title',
            right : 'next'
        },
        firstDay:1,
        events: this.events,
        lazyFetching: true,
        eventRender: function(event, element) {
            $(element).tooltip({title: event.episode});
        }
      });
    },
    selectWithDeleteFavs: function(){
      /* ["Teen Wolf","Quantico","The Big Bang Theory","The Simpsons","The Good Wife","Beowulf: Return to the Shieldlands","Hawaii Five-0","MasterChef Junior","Supergirl","Scorpion","NCIS: Los Angeles","New Girl","The Shannara Chronicles","Modern Family","Arrow","The Flash","DC's Legends of Tomorrow","The 100"] */
      var arraySelect = JSON.parse(localStorage['favShows']);
      for (var i = 0; i < arraySelect.length; i++) {
        $('#deleteFav').append('<option>'+arraySelect[i]+'</option>');
      }
      this.deleteFavSelect();
    },
    deleteFavSelect: function(callback){
      var arraySelect = JSON.parse(localStorage['favShows']);
      $('#deleteFav').change(function(){
        $('select option:selected').each(function(){
          console.log($(this).text());
          for (var i = 0; i < arraySelect.length; i++) {
            if(arraySelect[i] === $(this).text()){
              arraySelect.splice(i,1);
            }
          }
          localStorage['favShows'] = JSON.stringify(arraySelect);
        });
      });
    },
    showModule: function(){
      $(function() {
          //OPEN
          $('[data-popup-open]').on('click', function(e)  {
              var targeted_popup_class = jQuery(this).attr('data-popup-open');
              $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

              e.preventDefault();
          });

          //CLOSE
          $('[data-popup-close]').on('click', function(e)  {
              var targeted_popup_class = jQuery(this).attr('data-popup-close');
              $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);

              e.preventDefault();
          });
      });
    },
    fillTab: function(){
      this.fullCalendarTv();
    },
    init: function(){
      $.when(this.requestShows()).done(function(a1,a2){
        showBrowser.fillTab();
      });
      $.when(this.requestSearchShows()).done(function(a1,a2){
        showBrowser.showModule();
        showBrowser.selectWithDeleteFavs();
      });
    }
};
document.addEventListener('DOMContentLoaded', function () {
  if(!localStorage['favShows'] || localStorage['favShows'].length == 0
  || localStorage['favShows'] === null || localStorage['favShows'] === undefined || localStorage['favShows'] === 'undefined') {
    localStorage.setItem("favShows", "[]");
      $.when(showBrowser.requestSearchShows()).done(function(a1,a2){
        showBrowser.showModule();
        showBrowser.selectWithDeleteFavs();
        $('[data-popup="popup-1"]').css('display','block');
      });
  } else {
    showBrowser.init();
  }
});
