'use strict';
/* global $ attractionsModule */

var daysModule = (function(){

  // state (info that should be maintained)

  var days = []
  window.currentDay = this;

  // jQuery selections

  var $dayButtons, $dayTitle, $addButton, $removeDay;
  $(function(){
    $dayButtons = $('.day-buttons');
    $removeDay = $('#day-title > button.remove');
    $dayTitle = $('#day-title > span');
    $addButton = $('#day-add');
  })

  // Day class

  function Day () {
    this.hotel = null;
    this.restaurants = [];
    this.activities = [];
    this.number = days.push(this);
    this.buildButton().drawButton();
  }

  Day.prototype.buildButton = function() {
    this.$button = $('<button class="btn btn-circle day-btn"></button>')
      .text(this.number);
    var self = this;
    this.$button.on('click', function(){
      this.blur();
      self.switchTo();
    })
    return this;
  };

  Day.prototype.drawButton = function() {
    this.$button.appendTo($dayButtons);
    return this;
  };

  Day.prototype.switchTo = function() {
    // day button panel changes
    currentDay.$button.removeClass('current-day');
    console.log('before', currentDay);
    // itinerary clear
    function erase (attraction) { attraction.eraseItineraryItem(); }

    if(currentDay.DB){
      if (currentDay.DB.hotel) erase(currentDay.DB.hotel);
      console.log('read me', currentDay);
      if(currentDay.DB.restaurants) currentDay.DB.restaurants.forEach(erase);
      if(currentDay.DB.activities) currentDay.DB.activities.forEach(erase);
        console.log('after erase', currentDay);
    }
    console.log('after erase', currentDay);
    if (currentDay.hotel) erase(currentDay.hotel);
    currentDay.restaurants.forEach(erase);
    currentDay.activities.forEach(erase);
    // front-end model change
    currentDay = this;
    console.log('current this',currentDay);

    // day button panel changes
    currentDay.$button.addClass('current-day');
    $dayTitle.text('Day ' + currentDay.number);

    ///AJAX REQUEST
    var $dayValueTest = $("#day-title span").text().split(" ")[1];

    $.ajax({
      method: "GET",
      url: "api/days/" + $dayValueTest,
      data: {number: $dayValueTest},
      success: function (data) {
        var thisNewDay = {}
        // DRAW SOME SWEET SHIT!
        thisNewDay.dayNumber = $dayValueTest;
        if(data.hotel[0]){
          data.hotel[0].type = 'hotel';
          thisNewDay.hotel = attractionsModule.create(data.hotel[0]);
        }
        // draw(thisNewDay.hotel);
        if(data.restaurants.length){
          thisNewDay.restaurants = data.restaurants.map(function (element) {
            element.type = "restaurant";
            var attraction = attractionsModule.create(element)
    
            // draw(attraction);
            return attraction;
          });
        }
        if(data.activities.length){
          thisNewDay.activities = data.activities.map(function (element) {
            element.type = "activity";
            var attraction = attractionsModule.create(element)
            // draw(attraction);
            return attraction;
          });;
        }
        console.log(currentDay);
        currentDay.DB = thisNewDay;
      },
      error: function (error) {
        console.log("It didn't work!" + error)
      }
    })
    ///
    // itinerary repopulation
    function thisNewDraw (object) {
      // turn that object into somethins that attraction can use
    if (object.hotel) draw(object.hotel);
    object.restaurants.forEach(draw);
    object.activities.forEach(draw);
    }

    function draw (attraction) { attraction.drawItineraryItem(); }
    if (currentDay.hotel) draw(currentDay.hotel);
    currentDay.restaurants.forEach(draw);
    currentDay.activities.forEach(draw);

    return currentDay;
  };

  // private functions in the daysModule

  function addDay () {
    if (this && this.blur) this.blur();
    var newDay = new Day();
    if (days.length === 1) currentDay = newDay;
    newDay.switchTo();

    $.ajax({
        method: 'POST',
        url: '/api/days',
        data: {number: currentDay.number},
        success: function (responseData) {
          console.log(responseData)
        },
        error: function (errorObj) {
          console.log("error!")
        }
    });

  }

  function deleteCurrentDay () {
    console.log('will delete this day:', currentDay);
  }

  // jQuery event binding

  $(function(){
    $addButton.on('click', function () {
      addDay();
    });
    $removeDay.on('click', deleteCurrentDay);
  })

  // globally accessible methods of the daysModule

  var methods = {

    load: function(){
      $.get('/api/days', function(data){
        if(data.length){
          data.forEach(function(day){
            // draw all buttons/ attractions
            // populate the current day that is displayed
            new Day();
          });
          currentDay = days[0];
          days[0].switchTo();
        } else {
        $(addDay);
        }
      }).fail(function (error) {
        console.log(error)
      }) 
    },

    addAttraction: function(attractionData){
      var attraction = attractionsModule.create(attractionData);
      console.log(attractionData);
      switch (attraction.type) {
        case 'hotel': currentDay.hotel = attraction; break;
        case 'restaurant': currentDay.restaurants.push(attraction); break;
        case 'activity': currentDay.activities.push(attraction); break;
        default: console.error('bad type:', attraction);
      }
    },

    getAttraction: function(attractionData){
      return attractionsModule.create(attractionData);
    },

    getCurrentDay: function(){
      return currentDay;
    }

  };

  // we return this object from the IIFE and store it on the global scope
  // that way we can use `daysModule.load` and `.addAttraction` elsewhere

  return methods;

}());
