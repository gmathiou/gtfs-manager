var servicesModule = angular.module('servicesModule', []);

servicesModule.service('LoadDataService', function($rootScope, $http, $q) {


	/* Methods for loading data */

	this.loadRoutes = function() {
		var defer = $q.defer();

		if ($rootScope.routes != null) {
			defer.resolve();
			return defer.promise;
		}

		$http({
			method: 'GET',
			url: '/api/routes'
		}).
		success(function(data, status, headers, config) {
			$rootScope.routes = data;
			console.log("Routes loaded");
			defer.resolve();
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	};

	this.loadTrips = function() {
		var defer = $q.defer();

		if ($rootScope.trips != null) {
			defer.resolve();
			return defer.promise;
		}

		$http({
			method: 'GET',
			url: '/api/trips'
		}).
		success(function(data, status, headers, config) {
			$rootScope.trips = data;
			console.log("Trips loaded");
			defer.resolve();
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.loadTripsForRoute = function(routeId) {
		var defer = $q.defer();

		if ($rootScope.trips == null) {
			$rootScope.trips = [];
		}

		if ($rootScope.trips[routeId] != null) {
			defer.resolve($rootScope.trips[routeId]);
			return defer.promise;
		}

		$http({
			method: 'GET',
			url: '/api/trips-for-route/' + routeId
		}).
		success(function(data, status, headers, config) {
			$rootScope.trips[routeId] = data;

			console.log("Trips for route " + routeId + " loaded");
			defer.resolve(data);
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.loadTimezones = function() {
		var defer = $q.defer();
		if ($rootScope.timezones != null) {
			defer.resolve();
			return defer.promise;
		}
		$http({
			method: 'GET',
			url: '/files/timezones.json'
		}).
		success(function(data, status, headers, config) {
			$rootScope.timezones = data;
			console.log("Timezones loaded");
			defer.resolve();
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.loadStops = function() {
		var defer = $q.defer();

		if ($rootScope.stops != null) {
			defer.resolve();
			return defer.promise;
		}

		$http({
			method: 'GET',
			url: '/api/stops'
		}).
		success(function(data, status, headers, config) {
			$rootScope.stops = data;
			console.log("Stops loaded " + data.length);
			defer.resolve();
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.loadCalendars = function() {
		var defer = $q.defer();

		if ($rootScope.calendars != null) {
			defer.resolve();
			return defer.promise;
		}

		$http({
			method: 'GET',
			url: '/api/calendars'
		}).
		success(function(data, status, headers, config) {
			$rootScope.calendars = data;
			defer.resolve();
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.loadAgencies = function() {
		var defer = $q.defer();
		if ($rootScope.agencies != null) {
			defer.resolve();
			return defer.promise;
		}
		$http({
			method: 'GET',
			url: '/api/agencies'
		}).
		success(function(data, status, headers, config) {
			$rootScope.agencies = data;
			console.log("Agencies Loaded");
			defer.resolve();
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.loadStopTimes = function() {
		var defer = $q.defer();
		if ($rootScope.stoptimes != null) {
			defer.resolve();
			return defer.promise;
		}
		$http({
			method: 'GET',
			url: '/api/stoptimes'
		}).
		success(function(data, status, headers, config) {
			$rootScope.stoptimes = data;
			defer.resolve();
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.loadStopTimesForTrip = function(tripID) {
		var urlStr = '/api/stoptimes-for-trip/' + tripID;
		var defer = $q.defer();
		$http({
			method: 'GET',
			url: urlStr
		}).
		success(function(data, status, headers, config) {
			console.log(data);
			angular.copy(data, $rootScope.stoptimesForTrip);
			defer.resolve(data);
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});

		return defer.promise;
	}

	this.loadStopDetails = function(stopID) {
		var urlStr = '/api/stop/' + stopID;
		var defer = $q.defer();
		$http({
			method: 'GET',
			url: urlStr
		}).
		success(function(data, status, headers, config) {
			defer.resolve(data);
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.loadDrivingTime = function(startLat, startLon, stopLat, stopLon) {
		var defer = $q.defer();
		$http({
			method: 'GET',
			url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=48.851995,2.432&destinations=48.851995,2.342148&mode=driving&language=en-EN&key=AIzaSyAzGCiEl7vavGSb0bnSZBARQDVXzBLXoT8'
		}).
		success(function(data, status, headers, config) {
			defer.resolve(data);
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	/* Methods for removing data */
	this.removeAgency = function(itemToRemove) {
		var defer = $q.defer();
		$http.delete('/delete-entry/agencies/id/' + itemToRemove['_id']).
		success(function(data, status, headers, config) {
			$rootScope.agencies.splice($rootScope.agencies.indexOf(itemToRemove), 1);
			defer.resolve(data);
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.removeTrip = function(itemToRemove) {
		var defer = $q.defer();
		$http.delete('/delete-entry/trips/id/' + itemToRemove['_id']).
		success(function(data, status, headers, config) {
			$rootScope.trips.splice($rootScope.trips.indexOf(itemToRemove), 1);
			defer.resolve(data);
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.removeStop = function(itemToRemove) {
		var defer = $q.defer();
		$http.delete('/delete-entry/stops/id/' + itemToRemove['_id']).
		success(function(data, status, headers, config) {
			$rootScope.stops.splice($rootScope.stops.indexOf(itemToRemove), 1);
			defer.resolve(data);
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.removeRoute = function(itemToRemove) {
		var defer = $q.defer();
		$http.delete('/delete-entry/routes/id/' + itemToRemove['_id']).
		success(function(data, status, headers, config) {
			$rootScope.routes.splice($rootScope.routes.indexOf(itemToRemove), 1);
			defer.resolve(data);
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.removeCalendar = function(itemToRemove) {
		var defer = $q.defer();
		$http.delete('/delete-entry/calendars/id/' + itemToRemove['_id']).
		success(function(data, status, headers, config) {
			$rootScope.calendars.splice($rootScope.calendars.indexOf(itemToRemove), 1);
			defer.resolve(data);
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	/* Methods for saving data */
	this.saveAgency = function(agency) {
		var defer = $q.defer();
		$http.post('/save-entry/agencies', agency).
		success(function(data, status, headers, config) {
			if (data["_id"] != null) {
				$rootScope.agencies.push(data);
			}
			defer.resolve(data);
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.saveCalendar = function(agency) {
		var defer = $q.defer();
		$http.post('/save-entry/calendars', agency).
		success(function(data, status, headers, config) {
			if (data["_id"] != null) {
				$rootScope.calendars.push(data);
			}
			defer.resolve(data);
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.saveRoute = function(itemToSave) {
		var defer = $q.defer();
		$http.post('/save-entry/routes', itemToSave).
		success(function(data, status, headers, config) {
			//If new if exists then it is a new entry
			if (data["_id"] != null) {
				$rootScope.routes.push(data);
				//TODO: Remove # from color before storing or when exporting
			}
			defer.resolve(data);
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.saveTrip = function(itemToSave) {
		var defer = $q.defer();
		$http.post('/save-entry/trips', itemToSave).
		success(function(data, status, headers, config) {
			//If entry already exists in the database the servers returns just OK. Otherwise it returns the object itself
			// if (data["_id"] != null) {
			// 	$rootScope.trips.push(data);
			// }
			defer.resolve(data);
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.saveStop = function(itemToSave) {
		var defer = $q.defer();
		$http.post('/save-entry/stops', itemToSave).
		success(function(data, status, headers, config) {
			//If entry already exists in the database the servers returns just OK. Otherwise it returns the object itself
			if (data["_id"] != null) {
				$rootScope.stops.push(data);
			}
			defer.resolve(data);
		}).
		error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			defer.reject();
		});
		return defer.promise;
	}

	this.saveStopTimesForTrip = function(stopTimes) {
		var defer = $q.defer();
		var count = 1;
		angular.forEach(stopTimes, function(item) {
			$http.post('/save-entry/stoptimes', item).
			success(function(data, status, headers, config) {
				if (count == stopTimes.length) {
					defer.resolve(data);
				}
				count++;
			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				defer.reject();
			});
		});
		return defer.promise;
	}


});