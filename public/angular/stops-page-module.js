'use strict';

var stopsPageModule = angular.module('stopsPageModule', ['modelsModule', 'servicesModule', 'ui.utils']);
stopsPageModule.controller('stopsPageController', function($scope, $rootScope, $http, $timeout, $q, LoadDataService, Stop) {
  $rootScope.loading = true;
  $scope.sorting = '+stop_name';
  $scope.editing = false;
  $scope.resultMapVisible = false;
  $scope.checkedItems = [];
  $rootScope.markers = [];
  $scope.revertToItem = {};
  $scope.limit = 10;
  getDataFromServer();

  function getDataFromServer() {
    if ($rootScope.stops != null) {
      initStopsList();
      return;
    }
    LoadDataService.loadStops().
    then(LoadDataService.loadTimezones).
    then(initStopsList);
  }

  function initStopsList() {
    $scope.limit = 20;
    $rootScope.loading = false;
  }

  $scope.loadMore = function() {
    if ($scope.limit <= $rootScope.stops.length)
      $scope.limit += 20;
  }

  $scope.newEntry = function() {
    $scope.editing = true;
    var newItem = Stop.makeNewItem()
    $scope.active_item = newItem;
    angular.copy(null, $scope.revertToItem);

    //Avoid bad google maps rendering
    setTimeout(function() {
      if (newItem != null && $("#map-canvas").length > 0) {
        $("#map-canvas").gmap3({
          clear: {},
          map: {
            options: {
              center: [newItem.stop_lat, newItem.stop_lon],
              zoom: 14,
              autofit: true
            },
          },
          marker: {
            latLng: [newItem.stop_lat, newItem.stop_lon],
            options: {
              draggable: true,
              icon: "../images/busstop.png"
            },
            events: {
              dragend: function(marker, event, context) {
                var map = $(this).gmap3("get");
                newItem.stop_lat = marker.getPosition().lat();
                newItem.stop_lon = marker.getPosition().lng();
                $scope.$apply();
              }
            }
          }
        });
      }
    }, 0);
  }

  $scope.listItemPressed = function(selected_item) {
    $scope.itemPressed(selected_item);
    $scope.resultMapVisible = false;
  }

  $scope.itemPressed = function(selected_item) {
    if ($scope.editing == true) {
      $scope.editingStop();
      $scope.editing = false;
    }

    $scope.active_item = selected_item;

    //Initialize item vars
    if (!$scope.active_item.wheelchair_boarding) {
      $scope.active_item.wheelchair_boarding = 0;
    }

    if (!$scope.active_item.location_type) {
      $scope.active_item.location_type = 0;
    }

    if (!$scope.active_item.parent_station) {
      $scope.active_item.parent_station = 0;
    }

    if (!$scope.active_item.stop_timezone) {
      $scope.active_item.stop_timezone = 0;
    }

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

    $scope.editing = false;
    //Avoid bad google maps rendering
    setTimeout(function() {
      if (selected_item != null && $("#map-canvas").length > 0) {
        $("#map-canvas").gmap3({
          clear: {},
          map: {
            options: {
              center: [selected_item.stop_lat, selected_item.stop_lon],
              zoom: 14,
              autofit: true
            },
          },
          marker: {
            latLng: [selected_item.stop_lat, selected_item.stop_lon],
            options: {
              draggable: false,
              icon: "../images/busstop2.png"
            },
            events: {
              dragend: function(marker, event, context) {
                var map = $(this).gmap3("get");
                selected_item.stop_lat = marker.getPosition().lat();
                selected_item.stop_lon = marker.getPosition().lng();
                $scope.$apply();
              }
            }
          }
        });
      }
    }, 0);
  }

  $scope.editingStart = function() {
    $scope.editing = true;
    setDraggableMarker(true);
    angular.copy($scope.active_item, $scope.revertToItem);
  }

  $scope.editingStop = function() {
    $scope.editing = false;
    setDraggableMarker(false);
    angular.copy($scope.revertToItem, $scope.active_item);
  }

  $scope.removeItem = function() {
    LoadDataService.removeStop($scope.active_item)
      .then(function(data) {
        $scope.active_item = null;
      });
  }

  function setDraggableMarker(show) {
    $('#map-canvas').gmap3({
      get: {
        name: "marker",
        all: true,
        callback: function(objs) {
          $.each(objs, function(i, obj) {
            obj.setDraggable(show);
            if (show)
              obj.setIcon("../images/busstop.png");
            else
              obj.setIcon("../images/busstop2.png");
          });
        }
      }
    });
  }

  $scope.saveItem = function() {
    //Validation
    if($scope.active_item.parent_station === 0)
      $scope.active_item.parent_station = "";

    LoadDataService.saveStop($scope.active_item)
      .then(function(data) {
        $scope.editing = false;
        setDraggableMarker(false);
      });
  }

  $scope.resultMapToggle = function() {

    if ($scope.resultMapVisible == false)
      return;

    if ($rootScope.markers.length == 0) {
      loadMarkersForResultMap()
        .then(initResultMap());
    } else {
      initResultMap();
    }
  }

  function loadMarkersForResultMap() {
    var defer = $q.defer();
    $.each($rootScope.stops, function(i, item) {
      $rootScope.markers.push({
        latLng: [item.stop_lat, item.stop_lon],
        data: item
      });
    });
    defer.resolve();
    return defer.promise;
  }

  function initResultMap() {
    setTimeout(function() {
      $("#results-map").gmap3({
        clear: {},
        map: {
          options: {
            center: $rootScope.markers[0].latLng,
            zoom: 9,
            autofit: true,
            mapTypeControl: false,
            panControl: false,
            zoomControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            rotateControlOptions: false,
            overviewMapControl: false,
            OverviewMapControlOptions: false
          }
        },
        marker: {
          values: $rootScope.markers || [],
          cluster: {
            radius: 100,
            // This style will be used for clusters with more than 0 markers
            10: {
              content: "<div class='cluster cluster-1'>CLUSTER_COUNT</div>"
            },
            // This style will be used for clusters with more than 20 markers
            50: {
              content: "<div class='cluster cluster-2'>CLUSTER_COUNT</div>"
            },
            // This style will be used for clusters with more than 50 markers
            100: {
              content: "<div class='cluster cluster-3'>CLUSTER_COUNT</div>"
            }
          },
          options: {
            draggable: false,
            icon: "../images/busstop.png"
          },
          events: {
            click: function(marker, event, context) {
              var map = $(this).gmap3("get");
              $scope.itemPressed(context.data);
              $scope.$apply();
              $('#results-map').gmap3({
                get: {
                  name: "marker",
                  all: true,
                  callback: function(objs) {
                    $.each(objs, function(i, obj) {
                      obj.setIcon("../images/busstop.png");
                    });
                  }
                }
              });
              marker.setOptions({
                options: {
                  icon: "../images/busstop2.png"
                }
              });
            }
          }
        }
      });
    }, 1);
  }

  $scope.itemChecked = function(selected, stop) {
    if (selected == true) {
      $scope.checkedItems.push(stop);
    } else {
      $scope.checkedItems.splice($scope.checkedItems.indexOf(stop), 1);
      console.log($scope.checkedItems);
    }
  }

  $scope.removeEntries = function() {
    angular.forEach($scope.checkedItems, function(item, index) {
      LoadDataService.removeStop($scope.active_item)
        .then(function(data) {
          $scope.active_item = null;
        });
    });
  }
});