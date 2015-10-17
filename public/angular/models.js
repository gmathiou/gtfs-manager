var modelsModule = angular.module('modelsModule', []);

modelsModule.service('Route', function() {

	this.getRouteTypes = function() {
		var types = [{
			value: "0",
			label: "Tram, Streetcar, Light rail. Any light rail or street level system within a metropolitan area"
		}, {
			value: "1",
			label: "Subway, Metro. Any underground rail system within a metropolitan area"
		}, {
			value: "2",
			label: "Rail. Used for intercity or long-distance travel"
		}, {
			value: "3",
			label: "Bus. Used for short- and long-distance bus routes"
		}, {
			value: "4",
			label: "Ferry. Used for short- and long-distance boat service"
		}, {
			value: "5",
			label: "Cable car. Used for street-level cable cars where the cable runs beneath the car"
		}, {
			value: "6",
			label: "Gondola, Suspended cable car. Typically used for aerial cable cars where the car is suspended from the cable"
		}, {
			value: "7",
			label: "Funicular. Any rail system designed for steep inclines"
		}];
		return types;
	};

	this.makeNewItem = function() {
		var newItem = {
			route_id: "0",
			agency_id: "0",
			route_short_name: "New route Short Name",
			route_long_name: "New route Long Name",
			route_desc: "",
			route_type: "3",
			route_url: "http://",
			route_color: "00aa00",
			route_text_color: "ffffff"
		};
		return newItem;
	}
});

modelsModule.service('Agency', function() {
	this.makeNewItem = function() {
		var newItem = {
			agency_name: "New agency name",
			agency_id: "0",
			agency_url: "http://",
			agency_timezone: "UTC",
			agency_lang: "en",
			agency_phone: "555-",
			agency_fare_url: "http://"
		};
		return newItem;
	}
});

modelsModule.service('Stop', function($rootScope) {
	this.makeNewItem = function() {
		var stopLat = 0;
		var stopLon = 0;
		var stop_timezone = 0;
		var stops_length = 0;
		if ($rootScope.stops.length > 0) {
			var stops_length = $rootScope.stops.length - 1;
			stopLat = $rootScope.stops[stops_length].stop_lat;
			stopLon = $rootScope.stops[stops_length].stop_lon;
			stop_timezone = $rootScope.stops[stops_length].stop_timezone;
		}

		var newItem = {
			stop_id: "0",
			stop_code: "code",
			stop_name: "New stop name",
			stop_desc: "",
			stop_lat: stopLat,
			stop_lon: stopLon,
			stop_code: "0",
			zone_id: "",
			stop_url: "",
			location_type: "0",
			parent_station: null,
			stop_timezone: stop_timezone,
			wheelchair_boarding: "0"
		};
		return newItem;
	}
});

modelsModule.service('Trip', function($rootScope) {
	this.makeNewItem = function(route) {
		var newItem = {
			route_id: route,
			service_id: "",
			trip_id: 0,
			trip_headsign: "New trip headsign",
			service_id: 0,
			trip_short_name: "New trip short name",
			direction_id: 1,
			block_id: null,
			shape_id: null,
			wheelchair_accessible: 0,
			bikes_allowed: 0
		};
		return newItem;
	}
});

modelsModule.service('StopTime', function($rootScope) {
	this.makeNewItem = function(tripId) {
		var stopId = 0;
		if ($rootScope.stops.length > 0)
			stopId = $rootScope.stops[0].stop_id;

		var newItem = {
			trip_id: tripId,
			arrival_time: "12:00:00",
			departure_time: "12:00:00",
			stop_id: stopId,
			stop_sequence: 1,
			stop_headsign: "",
			pickup_type: "",
			drop_off_type: "",
			shape_dist_traveled: ""
		};
		return newItem;
	}
});

modelsModule.service('Calendar', function($rootScope) {
	var now = Date();
	this.makeNewItem = function() {
		var newItem = {
			service_id: 0,
			monday: 0,
			tuesday: 0,
			wednesday: 0,
			friday: 0,
			saturday: 0,
			sunday: 0,
			start_date: now,
			end_date: now
		};
		return newItem;
	}
});