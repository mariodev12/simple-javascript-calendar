'use strict';
var showBrowser = {
  api: 'http://localhost:8500',
  apisearch: '',
  listShows: [],
  events: [],
  dataHiatusShows: [],
  unique: function(list) {
    var result = [];
    $.each(list, function(i, e) {
      if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
  },
  getDataShows: function() {
    return $.ajax({
      dataType: 'json',
      type: 'GET',
      url: '/js/data.json',
      success: this.getTvShowHiatus.bind(this)
    });
  },
  getTvShowHiatus: function(data) {
    if (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].country === "US" && data[i]['end date'] === "___ ____") {
          this.dataHiatusShows.push(data[i].title);
        }
      }
    }
  },
  requestSearchShows: function() {
    var that = this;
    $('#search-box').keyup(function() {
      return $.ajax({
        dataType: "json",
        type: "GET",
        url: '' + $(this).val(),
        success: that.multisearchShows.bind(this),
      });
    })
  },
  multisearchShows: function(data) {
    var showData = JSON.parse(localStorage.getItem('favShows'));
    var that = this;
    var searchShows = [];
    for (var i = 0; i < data.length; i++) {
      searchShows.push({
        name: data[i].show.name,
        id: data[i].show.id
      });
    }
    $('#suggesstion-box').empty();
    for (var i = 0; i < searchShows.length; i++) {
      $('#suggesstion-box').append('<li/>');
      if (showData.indexOf(searchShows[i].name) == -1) {
        $('#suggesstion-box li:last').append(
          $('<i />', {
            class: 'fa fa-heart fav unfollowing',
            'data-value': searchShows[i].name,
            click: function(e) {
              var index = $.inArray($(this).data('value'), showData);
              if (index == -1) {
                showData.push($(this).data('value'));
              }
              localStorage['favShows'] = JSON.stringify(showData);
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
            click: function(e) {
              var index = $.inArray($(this).data('value'), showData);
              if (index > -1) {
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
  addToFav: function() {
    var data = JSON.parse(localStorage['favShows']);
    var index;
    var dataValue;
    $('.fav').on('click', function() {
      if ($(this).hasClass('unfollowing')) {
        index = data.indexOf($(this).data('value'));
        if (index > -1) {
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
  requestShows: function() {
    return $.ajax({
      dataType: "json",
      type: "GET",
      url: '',
      success: this.getTvShow.bind(this),
      error: this.loadErrors,
      beforeSend: function() {
        $('#loading').show();
      },
      complete: function() {
        $('#loading').hide();
      }
    });
  },
  loadErrors: function(x, t, m) {
    console.log("Error while loading", x, t, m);
  },
  getTvShowFromMaze: function(responseJSON) {
    var data = JSON.stringify(responseJSON);
    var idStrings = localStorage['favShows'];
    var uniqueShows = this.unique(this.dataHiatusShows);
    console.log(uniqueShows);
    var idShow = JSON.parse(idStrings);
    for (var i = 0; i < responseJSON.length; i++) {
      for (var j = 0; j < uniqueShows.length; j++) {
        if (responseJSON[i].title === uniqueShows[j]) {
          //console.log(responseJSON[i].title);
          this.events.push({
            title: responseJSON[i].title,
            start: responseJSON[i].start,
            episode: responseJSON[i].episode
          });
        }
      }
    };
    //console.log(this.events);
  },
  fullCalendarTv: function() {
    $('#calendar').fullCalendar({
      header: {
        left: 'prev',
        center: 'title',
        right: 'next'
      },
      events: this.events,
      lazyFetching: true,
      eventRender: function(event, element) {
        $(element).tooltip({
          title: event.episode
        });
      }
    });
  },
  selectWithDeleteFavs: function() {
    /* ["Teen Wolf","Quantico","The Big Bang Theory","The Simpsons","The Good Wife","Beowulf: Return to the Shieldlands","Hawaii Five-0","MasterChef Junior","Supergirl","Scorpion","NCIS: Los Angeles","New Girl","The Shannara Chronicles","Modern Family","Arrow","The Flash","DC's Legends of Tomorrow","The 100"] */
    var arraySelect = JSON.parse(localStorage['favShows']);
    for (var i = 0; i < arraySelect.length; i++) {
      $('#deleteFav').append('<option>' + arraySelect[i] + '</option>');
    }
    this.deleteFavSelect();
  },
  deleteFavSelect: function(callback) {
    var arraySelect = JSON.parse(localStorage['favShows']);
    $('#deleteFav').change(function() {
      $('select option:selected').each(function() {
        console.log($(this).text());
        for (var i = 0; i < arraySelect.length; i++) {
          if (arraySelect[i] === $(this).text()) {
            arraySelect.splice(i, 1);
          }
        }
        localStorage['favShows'] = JSON.stringify(arraySelect);
      });
    });
  },
  showModule: function() {
    $(function() {
      //OPEN
      $('[data-popup-open]').on('click', function(e) {
        var targeted_popup_class = jQuery(this).attr('data-popup-open');
        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

        e.preventDefault();
      });

      //CLOSE
      $('[data-popup-close]').on('click', function(e) {
        var targeted_popup_class = jQuery(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);

        e.preventDefault();
      });
    });
  },
  fillTab: function() {
    this.fullCalendarTv();
  },
  init: function() {
    if (this.getDataShows) {
      console.log(this.dataHiatusShows);
    }
    $.when(this.getDataShows()).done(function(a1, a2) {

    });
    $.when(this.requestShows()).done(function(a1, a2) {
      showBrowser.fillTab();
    });
    $.when(this.requestSearchShows()).done(function(a1, a2) {
      showBrowser.showModule();
      showBrowser.selectWithDeleteFavs();
    });
  }
};
document.addEventListener('DOMContentLoaded', function() {
  if (!localStorage['favShows'] || localStorage['favShows'].length == 0 || localStorage['favShows'] === null ||  localStorage['favShows'] === undefined ||  localStorage['favShows'] === 'undefined') {
    localStorage.setItem("favShows", "[]");
    $.when(showBrowser.requestSearchShows()).done(function(a1, a2) {
      showBrowser.showModule();
      showBrowser.selectWithDeleteFavs();
      $('[data-popup="popup-1"]').css('display', 'block');
    });
  } else {
    showBrowser.init();
  }
});
if (showBrowser.getDataShows()) {
  console.log(showBrowser.dataHiatusShows);
}
