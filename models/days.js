var mongoose = require('mongoose');
var HotelSchema = require('./hotel').schema;
var RestaurantSchema = require('./restaurant').schema;
var ActivitySchema = require('./activity').schema;

var DaysSchema = new mongoose.Schema({
	number: {type: Number, unique: true},
	hotel: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel'}],
	restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}],
	activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}]
});

module.exports = mongoose.model('Days', DaysSchema);