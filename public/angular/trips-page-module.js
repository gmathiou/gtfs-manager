'use strict';

var tripsPageModule = angular.module('tripsPageModule', ['naturalSort', 'ui.bootstrap',
  'ui.sortable', 'modelsModule', 'servicesModule', 'ui.utils'
]);
tripsPageModule.controller('tripsPageController', function($scope, $rootScope, $http, $q, $timeout, LoadDataService, Trip, Route, StopTime) {

  //Scope vars
  $rootScope.loading = true;
  $rootScope.stoptimesForTrip = [];
  $scope.sorting = '+route_long_name';
  $scope.editing = false;
  $scope.show_trips = false;
  $scope.showStopTimesMap = false;
  $scope.checkedRouteItems = [];
  $scope.checkedTripItems = [];
  $scope.stopTimesMapMarkers = [];
  $scope.tripsForRoutes = [];

  $scope.revertToItem = {};
  $scope.revertToTripItem = {};
  $scope.revertToStopTimesList = [];
  $scope.date = new Date();

  //Local vars
  var drivingTimes = [];
  getDataFromServer();

  function getDataFromServer() {
    if ($rootScope.trips != null) {
      initRoutesList();
      return;
    }
    LoadDataService.loadRoutes().
    then(initRoutesList).
    then(LoadDataService.loadAgencies).
    then(LoadDataService.loadStops).
    then(LoadDataService.loadCalendars);
  }

  function initRoutesList() {
    $scope.limit = 20;
    $scope.limitTrips = 20;
    $rootScope.loading = false;

    if ($scope.route_type == null)
      $scope.route_types = Route.getRouteTypes();
  }

  $scope.loadMore = function() {
    if ($scope.limit <= $rootScope.routes.length)
      $scope.limit += 20;
  }

  $scope.newTrip = function() {
    $scope.editing = true;
    $scope.active_trip_item = Trip.makeNewItem($scope.active_item.route_id);
    angular.copy(null, $scope.revertToItem);
    angular.copy(null, $scope.revertToTripItem);
    $scope.stoptimesForTrip = [];
  }

  $scope.activateTrip = function(selected_item) {

    if (selected_item == null)
      return;

    if ($scope.editing == true) {
      $scope.editingStop();
    }

    $scope.active_trip_item = selected_item;
    //Init empty values
    if (selected_item.route_id == null)
      selected_item.route_id = 0;

    if (selected_item.wheelchair_accessible == null)
      selected_item.wheelchair_accessible = 0;

    if (selected_item.bikes_allowed == null)
      selected_item.bikes_allowed = 0;

    setTimeout(function() {
      $('.pop').popover({
        html: 'true',
        animation: false,
        trigger: "hover",
        title: "Help",
        placement: "left",
        container: "body"
      });
    }, 100);

    LoadDataService.loadStopTimesForTrip(selected_item.trip_id);

    if ($scope.showStopTimesMap == true)
      $scope.showStopTimesMap = false;

    setTimeout(function() {
      $('.tip').tooltip();
    }, 100);
  }

  $scope.tripInitiliaze = function() {
    $scope.limitTrips = 30;
    $rootScope.loading = true;
    $timeout(expand, 0.001);
  }

  var expand = function() {
    $scope.limitTrips += 100;
    $rootScope.loading = false;
  }

  $scope.routeItemPressed = function(selected_item) {
    if ($scope.editing == true) {
      $scope.editingStop();
    }

    $scope.active_item = selected_item;
    LoadDataService.loadTripsForRoute(selected_item.route_id).then(
      function(data) {
        $scope.tripsForRoutes = data;
      });
    //Initialize item vars
    if ($scope.active_item.wheelchair_boarding == null)
      $scope.active_item.wheelchair_boarding = 0;

    if ($scope.active_item.location_type == null)
      $scope.active_item.location_type = 0;

    //Fix color # problem
    if ($scope.active_item.route_color != null && $scope.active_item.route_color.indexOf('#') == -1)
      $scope.active_item.route_color = '#' + $scope.active_item.route_color;

    if ($scope.active_item.route_text_color != '' && $scope.active_item.route_text_color.indexOf('#') == -1)
      $scope.active_item.route_text_color = '#' + $scope.active_item.route_text_color;

    $scope.show_trips = !$scope.show_trips;
    $scope.checkedRouteItems = [];
    $scope.checkedTripItems = [];
    $scope.tripInitiliaze();
    $scope.active_trip_item = null;
  }

  $scope.editingStart = function() {
    $scope.editing = true;
    angular.copy($scope.active_item, $scope.revertToItem);
    angular.copy($scope.active_trip_item, $scope.revertToTripItem);
    angular.copy($scope.stoptimesForTrip, $scope.revertToStopTimesList);

    //Enable the sortable stopTimes list
    $('.sortableList').sortable("enable");
  }

  $scope.editingStop = function() {
    $scope.editing = false;
    if ($scope.active_trip_item.trip_id != 0) {
      angular.copy($scope.revertToTripItem, $scope.active_trip_item);
      angular.copy($scope.revertToStopTimesList, $scope.stoptimesForTrip);
    } else {
      $scope.tripsForRoutes.splice($scope.tripsForRoutes.indexOf($scope.active_trip_item), 1);
    }
    //Disable the sortable stopTimes list
    $('.sortableList').sortable("disable");
  }

  $scope.removeTrip = function(itemToRemove) {
    LoadDataService.removeTrip(itemToRemove)
      .then(function() {
        $scope.tripsForRoutes.splice($scope.tripsForRoutes.indexOf($scope.active_trip_item), 1);
        itemToRemove = null;
        $scope.active_trip_item = null;
      });
  }

  $scope.removeTripEntries = function() {
    angular.forEach($scope.checkedTripItems, function(item, index) {
      $scope.removeTrip(item);
      $scope.checkedTripItems = [];
    });
  }

  $scope.saveTrip = function(itemToSave) {
    $scope.computeNewStoptimeSequence();
    LoadDataService.saveTrip(itemToSave)
      .then(function(data) {
        if (data["_id"] != null) {
          $scope.tripsForRoutes.push(data);
          $scope.active_trip_item = data;
        }
      })
      .then(LoadDataService.saveStopTimesForTrip($scope.stoptimesForTrip))
      .then(function(data) {
        $scope.editing = false;
      });
  }

  $scope.tripItemChecked = function(selected, selected_item) {
    if (selected == true) {
      $scope.checkedTripItems.push(selected_item);
    } else {
      $scope.checkedTripItems.splice($scope.checkedTripItems.indexOf(selected_item), 1);
    }
  }

  $scope.stopTimesMapButtonClicked = function() {
    $scope.showStopTimesMap = !$scope.showStopTimesMap;
    $scope.stopTimesMapMarkers = [];
    var counter = 0;
    angular.forEach($scope.stoptimesForTrip, function(item) {
      LoadDataService.loadStopDetails(item.stop_id)
        .then(function(data) {
          $scope.stopTimesMapMarkers.push({
            latLng: [data.stop_lat, data.stop_lon],
            data: item
          });

          //Use this trick to load map only once, when all stop have been loaded
          counter++;
          if (counter == $scope.stoptimesForTrip.length) {
            $("#stopTimesMap").gmap3({
              clear: {},
              map: {
                options: {
                  center: $scope.stopTimesMapMarkers[0] || [0, 0]
                }
              },
              marker: {
                values: $scope.stopTimesMapMarkers || [],
                options: {
                  draggable: false,
                  icon: "../images/busstop.png"
                },
                events: {
                  click: function(marker, event, context) {
                    var map = $(this).gmap3("get");
                    var infowindow = $(this).gmap3({
                      get: {
                        name: "infowindow"
                      }
                    });
                    if (infowindow) {
                      infowindow.close();
                    }
                    $(this).gmap3({
                      infowindow: {
                        anchor: marker,
                        options: {
                          content: "<b>" + context.data.stop_sequence + "</b> - " + context.data.stop_id + "<br/><b>Arrival</b>: " + context.data.arrival_time + "<br/><b>Departure</b>: " + context.data.departure_time
                        }
                      }
                    });
                  }
                }
              },
              polyline: {
                options: {
                  strokeColor: $scope.active_item.route_color,
                  strokeOpacity: 1.0,
                  strokeWeight: 5,
                  path: $scope.stopTimesMapMarkers
                }
              }
            });
          }
        });
    });

    initStopTimesMap();
  }

  function initStopTimesMap() {
    setTimeout(function() {
      $("#stopTimesMap").gmap3({
        clear: {},
        map: {
          options: {
            center: [0, 0],
            zoom: 10,
            autofit: true,
            mapTypeControl: false,
            panControl: false,
            scrollwheel: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            rotateControlOptions: false,
            overviewMapControl: false,
            OverviewMapControlOptions: false
          }
        }
      });
    }, 1);
  }

  $scope.updateTimesButtonClicked = function() {
    var stops = [];
    var counter = 0;

    angular.forEach($scope.stoptimesForTrip, function(item) {
      LoadDataService.loadStopDetails(item.stop_id)
        .then(function(data) {
          stops.push(data);
          counter++;

          if (counter == $scope.stoptimesForTrip.length) {
            calculateDistances(stops);
          }

        });
    });
  }


  function calculateDistances(stops) {
    drivingTimes = [];

    var service = new google.maps.DistanceMatrixService();
    var origin = new google.maps.LatLng(stops[0].stop_lat, stops[0].stop_lon);
    var destination = new google.maps.LatLng(stops[1].stop_lat, stops[1].stop_lon);

    //Calculate difference of time between arrival and departure in the first Stop
    //Use this as a rule for the next stops
    var firstStopArrivalSplit = ($scope.stoptimesForTrip[0].arrival_time).split(':');
    var firstStopArrivalDate = new Date();
    firstStopArrivalDate.setHours(firstStopArrivalSplit[0], firstStopArrivalSplit[1], 0);

    var firstStopDepartureSplit = ($scope.stoptimesForTrip[0].departure_time).split(':');
    var firstStopDepartureDate = new Date();
    firstStopDepartureDate.setHours(firstStopDepartureSplit[0], firstStopDepartureSplit[1], 0);

    for (var i = 0; i < stops.length - 1; i++) {
      var origin = new google.maps.LatLng(stops[i].stop_lat, stops[i].stop_lon);
      var destination = new google.maps.LatLng(stops[i + 1].stop_lat, stops[i + 1].stop_lon);

      service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, callback);
    }
  }

  function callback(response, status) {
    if (status != google.maps.DistanceMatrixStatus.OK) {
      console.log('Error was: ' + status);
    } else {
      drivingTimes.push({
        "origin": response.originAddresses[0],
        "destination": response.destinationAddresses[0],
        "duration": response.rows[0].elements[0].duration
      });
    }

    if (drivingTimes.length == $scope.stoptimesForTrip.length - 1) {
      reComputeTimesForStops();
      $scope.$apply();
    }
  }

  function reComputeTimesForStops() {
    for (var i = 1; i < $scope.stoptimesForTrip.length; i++) {

      

      var stopArrivalSplit = $scope.stoptimesForTrip[i - 1].arrival_time.split(':');
      var stopArrivalDate = new Date().setHours(stopArrivalSplit[0], stopArrivalSplit[1], 0);

      var stopDepartureSplit = $scope.stoptimesForTrip[i - 1].departure_time.split(':');
      var stopDepartureDate = new Date().setHours(stopDepartureSplit[0], stopDepartureSplit[1], 0);

      var departingTime = Math.abs(stopDepartureDate-stopArrivalDate); //In milliseconds

      var newStopArrivalDate = new Date(stopArrivalDate + (drivingTimes[i - 1].duration.value * 1000));
      var newStopDepartureDate = new Date(newStopArrivalDate.getTime() + departingTime);

      //Format time - Add leading zeros if required
      var hoursArrival = 0,
        minutesArrival = 0,
        secondsArrival = 0;
      if (newStopArrivalDate.getHours() < 10)
        hoursArrival = "0" + newStopArrivalDate.getHours();
      else
        hoursArrival = newStopArrivalDate.getHours();

      if (newStopArrivalDate.getMinutes() < 10)
        minutesArrival = "0" + newStopArrivalDate.getMinutes();
      else
        minutesArrival = newStopArrivalDate.getMinutes();

      if (newStopArrivalDate.getSeconds() < 10)
        secondsArrival = "0" + newStopArrivalDate.getSeconds();
      else
        secondsArrival = newStopArrivalDate.getSeconds();


      var hoursDeparture = 0,
        minutesDeparture = 0,
        secondsDeparture = 0;
      if (newStopDepartureDate.getHours() < 10)
        hoursDeparture = "0" + newStopDepartureDate.getHours();
      else
        hoursDeparture = newStopDepartureDate.getHours();

      if (newStopDepartureDate.getMinutes() < 10)
        minutesDeparture = "0" + newStopDepartureDate.getMinutes();
      else
        minutesDeparture = newStopDepartureDate.getMinutes();

      if (newStopDepartureDate.getSeconds() < 10)
        secondsDeparture = "0" + newStopDepartureDate.getSeconds();
      else
        secondsDeparture = newStopDepartureDate.getSeconds();

      $scope.stoptimesForTrip[i].arrival_time = hoursArrival + ":" + minutesArrival + ":" + secondsArrival;
      $scope.stoptimesForTrip[i].departure_time = hoursDeparture + ":" + minutesDeparture + ":" + secondsDeparture;

    }
  }

  $scope.newStopTimeButtonClicked = function() {
    if ($scope.editing == false || $scope.active_trip_item.trip_id == 0)
      return;

    var newStopTime = StopTime.makeNewItem($scope.active_trip_item.trip_id);
    newStopTime.stop_sequence = $scope.stoptimesForTrip.length + 1;
    $scope.stoptimesForTrip.push(newStopTime);
  }

  $scope.computeNewStoptimeSequence = function() {
    for (var i = 0; i < $scope.stoptimesForTrip.length; i++) {
      var stop_id = $scope.stoptimesForTrip[i].stop_id;
      var newSequence = $('#' + stop_id + " .seq").attr('id');
      $scope.stoptimesForTrip[i].stop_sequence = newSequence;
    }
  }

  $scope.copyTrip = function() {

    //Create the new empty item
    $scope.newItem = {};
    $scope.newItemStoptimes = [];

    //Copy the values from the current active item
    angular.copy($scope.active_trip_item, $scope.newItem);
    angular.copy($scope.stoptimesForTrip, $scope.newItemStoptimes);

    //Resut trip id
    $scope.newItem.trip_id = null;
    $scope.newItem._id = null;

    //Upload it to server
    LoadDataService.saveTrip($scope.newItem)
      .then(function(data) {

        //Item is saved. Get the newly created id of the item
        $scope.newItem = data;
        console.log(data);

        //Add item to the route list
        $scope.tripsForRoutes.push($scope.newItem);

        //Change the trip id on the copied stoptimes array
        angular.forEach($scope.newItemStoptimes, function(item) {
          item._id = null;
          item.trip_id = $scope.newItem.trip_id;
        });

        LoadDataService.saveStopTimesForTrip($scope.newItemStoptimes)
          .then(function(data) {
            console.log(data);
          });
      });
  }
});