'use strict';

var routesPageModule = angular.module('routesPageModule', ['colorpicker.module', 'modelsModule', 'ui.utils',
  'servicesModule' 
]);
routesPageModule.controller('routesPageController', function($scope, $rootScope, $http, $timeout, LoadDataService, Route, $q) {
  $rootScope.loading = true;
  $scope.sorting = '+route_long_name';
  $scope.editing = false;
  $scope.checkedItems = [];
  $scope.revertToItem = {};
  getDataFromServer();
 
  function getDataFromServer() {
    if ($rootScope.routes != null) {
      initRoutesList();
      return;
    }
    LoadDataService.loadRoutes().
    then(LoadDataService.loadAgencies).
    then(initRoutesList);
  }

  function initRoutesList() {
    $scope.limit = 20;

    if ($scope.route_type == null)
      $scope.route_types = Route.getRouteTypes();

    $rootScope.loading = false;
  }

  $scope.loadMore = function() {
    if ($scope.limit <= $rootScope.routes.length)
      $scope.limit += 20;
  }

  $scope.newEntry = function() {
    $scope.editing = true;
    $scope.active_item = Route.makeNewItem();
    angular.copy(null, $scope.revertToItem);

  }

  $scope.listItemPressed = function(selected_item) {
    $scope.itemPressed(selected_item);
  }

  $scope.itemPressed = function(selected_item) {
    if ($scope.editing == true) {
      $scope.editingStop();
      $scope.editing = false;
    }

    $scope.active_item = selected_item;

    //Initialize item vars
    if ($scope.active_item.location_type == null)
      $scope.active_item.location_type = 0;

    addHashToColorFields($scope.active_item);

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
  }

  $scope.editingStart = function() {
    $scope.editing = true;
    angular.copy($scope.active_item, $scope.revertToItem);
  }

  $scope.editingStop = function() {
    $scope.editing = false;
    angular.copy($scope.revertToItem, $scope.active_item);
  }

  $scope.removeItem = function() {
    LoadDataService.removeRoute($scope.active_item);
  }

  $scope.saveItem = function() {
    removeHashFromColorFields($scope.active_item);
    LoadDataService.saveRoute($scope.active_item)
    .then(function(data){
      addHashToColorFields(data);
      $scope.active_item = data;
    });

    $scope.editing = false;
  }

  $scope.itemChecked = function(selected, route) {
    if (selected == true) {
      $scope.checkedItems.push(route);
    } else {
      $scope.checkedItems.splice($scope.checkedItems.indexOf(route), 1);
      console.log($scope.checkedItems);
    }
  }

  $scope.removeEntries = function() {
    angular.forEach($scope.checkedItems, function(item, index) {
      LoadDataService.removeRoute(item);
    });
  }

  $scope.createBatchTrips = function(size, directionName, directionID) {
    if (size == null || size == 0)
      return;

    var shortName = directionName.replace(' ', '_').toLowerCase();

    var it = 0;
    while (it < size) {
      it++;
      var newItem = {
        trip_headsign: directionName,
        trip_id: shortName + '-' + it,
        service_id: 0,
        route_id: $scope.active_item.route_id,
        trip_short_name: shortName,
        direction_id: directionID,
        block_id: 0,
        shape_id: 0,
        wheelchair_accessible: 0,
        bikes_allowed: 0
      };

      $scope.saveItem(newItem);
    }
  }

  function removeHashFromColorFields(item) {
    if (item.route_color != null)
      item.route_color = item.route_color.replace('#', '');

    if (item.route_text_color != null)
      item.route_text_color = item.route_text_color.replace('#', '');
  }

  function addHashToColorFields(item) {
    if (item.route_color != null && item.route_color.indexOf('#') == -1)
      item.route_color = '#' + item.route_color;

    if (item.route_text_color != '' && item.route_text_color.indexOf('#') == -1)
      item.route_text_color = '#' + item.route_text_color;
  }
});