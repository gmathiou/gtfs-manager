'use strict';

var calendarsPageModule = angular.module('calendarsPageModule', [
  'modelsModule',
  'servicesModule',
  'ui.utils'
]);

calendarsPageModule.controller('calendarsPageController', function($scope, $rootScope, $http, $timeout, LoadDataService, Calendar, $q) {
  $scope.editing = true;
  $scope.opened = [];

  LoadDataService.loadCalendars()
    .then(function(data) {

    });

  $scope.newEntry = function() {
    $scope.active_item = Calendar.makeNewItem();
    angular.copy(null, $scope.revertToItem);
  };

  $scope.itemPressed = function(selected_item) {
    $scope.active_item = selected_item;
    
    $scope.start_date = moment(selected_item.start_date,"YYYYMMDD"); 
    $scope.end_date = moment(selected_item.end_date,"YYYYMMDD"); 
  };

  $scope.saveItem = function() {
    $scope.active_item.start_date = document.getElementById("start_date").value;
    $scope.active_item.end_date = document.getElementById("end_date").value;

    LoadDataService.saveCalendar($scope.active_item)
      .then(function(data) {
        if (data["_id"] != null) {
          $scope.active_item = data;
        }
      });
  };

  $scope.removeItem = function() {
    LoadDataService.removeCalendar($scope.active_item)
      .then(function(data) {
        $scope.active_item = null;
      });
  };

  $scope.open = function($event, index) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened[index] = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };
});