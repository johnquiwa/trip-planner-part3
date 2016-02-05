var express = require('express');
var daysRouter = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Days = models.Days;
var Promise = require('bluebird');


daysRouter.get('/days', function(req,res){
  Days.find({}).then(function(day){
      res.send(day);
  });
})


daysRouter.post('/days', function(req,res,next){
  var dayInfo = req.body;
  Days.create(dayInfo).then(function(dayCreated){
      res.send(dayCreated);
  }).then(null, next);
});

daysRouter.get("/days/:id", function (req, res) {
    // console.log("THIS IS THE BODY", req.body);
    // console.log("THESE ARE THE PARAMS", req.params.id);
  Days.findOne({ number: req.params.id })
  .populate("hotel restaurants activities").exec()
  .then(function (stuffWeGot) {
    res.send(stuffWeGot);
  })
  
})



//hotels
daysRouter.get('/days/:id/hotel', function(req,res){
  console.log('made it to hotel');
});


daysRouter.post('/days/:id/hotel', function(req,res,next){
  var dayNum = req.params.id;
  var attractionId = req.body._id

  Days.findOne({ number: dayNum })
  .then(function (returnedDay) {
    returnedDay.hotel = [attractionId];
    return returnedDay.save()
  })
  .then(null, next);
});



//restaurants
daysRouter.get('/days/:id/restaurant', function(req,res){
  console.log('made it to restaurants');
})

daysRouter.post('/days/:id/restaurant', function(req,res,next){
  var dayNum = req.params.id;
  var attractionId = req.body._id

  Days.findOne({ number: dayNum })
  .then(function (returnedDay) {
    returnedDay.restaurants.push(attractionId);
    return returnedDay.save()
  })
  .then(null, next);
});



//activities
daysRouter.get('/days/:id/activity', function(req,res){
  console.log('made it to activities');
})


daysRouter.post('/days/:id/activity', function(req,res,next){
  var dayNum = req.params.id;
  var attractionId = req.body._id

  Days.findOne({ number: dayNum })
  .then(function (returnedDay) {
    returnedDay.activities.push(attractionId);
    return returnedDay.save()
  })
  .then(null, next);
});
module.exports = daysRouter;

















