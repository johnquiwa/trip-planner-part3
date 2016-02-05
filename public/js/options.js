'use strict';
/* global daysModule hotels restaurants activities */

// shortcut for $(document).ready(func)
$(function(){

  var $optionsPanel = $('#options-panel');

  // will this be loaded first?

  hotels.forEach(makeOption, $optionsPanel.find('#hotel-choices select'));
  restaurants.forEach(makeOption, $optionsPanel.find('#restaurant-choices select'));
  activities.forEach(makeOption, $optionsPanel.find('#activity-choices select'));

  function makeOption (attraction) {
    attraction.type = this.data('type'); // customizing for future use
    var $option = $('<option></option>')
      .text(attraction.name)
      .data(attraction);
    this.append($option);
  }

  $optionsPanel.on('click', 'button', addAttraction);

  function addAttraction () {
    var $button = $(this);
    var attraction = $button.siblings('select').find(':selected').data();
    daysModule.addAttraction(attraction);
    console.log("Hi there", attraction.type) // gives us the object!

    $.ajax({
        method: 'POST',
        url: '/api/days/' + currentDay.number + "/" + attraction.type,
        data: attraction,
        success: function (responseData) {
          console.log(responseData)
        },
        error: function (errorObj) {
          console.log("error!")
        }
      });
  }


});
