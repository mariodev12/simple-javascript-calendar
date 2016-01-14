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
          $('#suggesstion-box').append('<li/>');
          $('#suggesstion-box li:last').append(
            $('<input />', {
              class: 'searchResults',
              type: 'checkbox',
              name: 'favorite',
              value: searchShows[i].name
            })
          );
          $('#suggesstion-box li:last').append(
            $('<label />', {
                'text': searchShows[i].name,
            })
          );
          /*
          $('<input class="searchResults" type="checkbox" value="'+searchShows[i].name+'"/><label>'
          +searchShows[i].name+'</label>').wrap('<li>').parent().appendTo('#suggesstion-box'); */
        };
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
        that.saveAll();
        console.log(that.favShows);

    },
    saveAll: function(){
        var that = this;
        var getData = localStorage.getItem('favShows');
        var parsedData;
        var uniqueArray;
        //var noRepeatFavShows = that.checkrepeat(that.favShows);

        try {
          //Si el localstorage favshows es nulo inserta lo que haya en la array
          if(localStorage.getItem('favShows') === null || localStorage.getItem('favShows') === 'undefined'
          || localStorage.getItem('favShows') === undefined ){
            localStorage.setItem('favShows', JSON.stringify(that.favShows));
            //console.log(noRepeatFavShows);
          } else {
          /*Si por lo contrario ya hay algo obtiene el contenido de localstorage
          y conviertelo en un objeto (en este caso un array) y guardalo en una
          variable. Recorre el array y guardalo en la array que hemos creado antes
          una vez listo vuelve a convertirlo en un string y metelo en localstorage */
            parsedData = JSON.parse(getData);
            for (var i = 0; i < that.favShows.length; i++) {
              parsedData.push(that.favShows[i]);
            }
            uniqueArray = parsedData.filter(function(elem, index, array) {
                return array.indexOf(elem) === index;
              }
            );
            localStorage.setItem('favShows', JSON.stringify(uniqueArray));
          }
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
      var idStrings = localStorage['favShows'];
      var idShow = JSON.parse(idStrings);

      for (var i = 0; i < responseJSON.length; i++) {
        for (var j = 0; j < idShow.length; j++) {
            if (responseJSON[i]._embedded.show.name === idShow[j] ) {
              this.events.push({title: responseJSON[i]._embedded.show.name,
                start: responseJSON[i].airdate, episode: responseJSON[i].season+"x"+responseJSON[i].number });
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
        events: this.events,
        eventRender: function(event, element) {
            $(element).tooltip({title: event.episode});
        }
      });
    },
    selectFromOption: function(){
      $('#networkShows').change(function(){
        this.currentNetwork = this.value.split('-').join(' ');
      });

    },
    selectWithDeleteFavs: function(){
      /* ["Teen Wolf","Quantico","The Big Bang Theory","The Simpsons","The Good Wife",
      "Beowulf: Return to the Shieldlands","Hawaii Five-0","MasterChef Junior","Supergirl",
      "Scorpion","NCIS: Los Angeles","New Girl",
      "The Shannara Chronicles","Modern Family","Arrow","The Flash","DC's Legends of Tomorrow","The 100"] */
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
          //----- OPEN
          $('[data-popup-open]').on('click', function(e)  {
              var targeted_popup_class = jQuery(this).attr('data-popup-open');
              $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

              e.preventDefault();
          });

          //----- CLOSE
          $('[data-popup-close]').on('click', function(e)  {
              var targeted_popup_class = jQuery(this).attr('data-popup-close');
              $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);

              e.preventDefault();
          });
      });
    },
    fillTab: function(){
      this.showModule();
      this.fullCalendarTv();
    },
    init: function(){
      $.when(this.requestShows(), this.requestSearchShows()).done(function(a1,a2){
        showBrowser.fillTab();
        showBrowser.selectWithDeleteFavs();
      });
    }
};
document.addEventListener('DOMContentLoaded', function () {
  showBrowser.init();
  console.log(localStorage['favs']);
});
