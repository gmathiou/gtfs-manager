'use strict';

var agenciesPageModule = angular.module('agenciesPageModule', [
  'modelsModule',
  'servicesModule',
  'ui.utils'
]);

agenciesPageModule.controller('agenciesPageController', function($scope, $rootScope, $http, $timeout, LoadDataService, Agency, $q) {
  $rootScope.loading = true;
  $scope.sorting = '+agency_name';
  $scope.editing = false;
  $scope.checkedItems = [];
  $scope.revertToItem = {};
  $scope.limit = 10;
  getDataFromServer();

  function getDataFromServer() {
    if ($rootScope.agencies != null) {
      initAgenciesList();
      return;
    }
    LoadDataService.loadAgencies().
    then(LoadDataService.loadTimezones).
    then(initAgenciesList);
  }

  function initAgenciesList() {
    $scope.limit = 20;
    $rootScope.loading = false;
  }

  $scope.loadMore = function() {
    if ($scope.limit <= $rootScope.agencies.length)
      $scope.limit += 20;
  }

  $scope.newEntry = function() {
    $scope.editing = true;
    $scope.active_item = Agency.makeNewItem();
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
    if ($scope.active_item.wheelchair_boarding == null)
      $scope.active_item.wheelchair_boarding = 0;

    if ($scope.active_item.location_type == null) {
      $scope.active_item.location_type = 0;
    }
  }

  $scope.editingStart = function() {
    $scope.editing = true;
    angular.copy($scope.active_item, $scope.revertToItem);
  }

  $scope.editingStop = function() {
    $scope.editing = false;
    angular.copy($scope.revertToItem, $scope.active_item);

    if ($scope.active_trip_item.trip_id != 0) {
      angular.copy($scope.revertToItem, $scope.active_item);
    } else {
      $scope.agencies.splice($scope.agencies.indexOf($scope.active_item), 1);
    }
  }

  $scope.removeItem = function() {
    LoadDataService.removeAgency($scope.active_item);
  }

  $scope.saveItem = function() {
    LoadDataService.saveAgency($scope.active_item);
    $scope.editing = false;
  }

  $scope.itemChecked = function(selected, agency) {
    if (selected == true) {
      $scope.checkedItems.push(agency);
    } else {
      $scope.checkedItems.splice($scope.checkedItems.indexOf(agency), 1);
      console.log($scope.checkedItems);
    }
  }

  $scope.removeEntries = function() {
    angular.forEach($scope.checkedItems, function(item, index) {
      LoadDataService.removeAgency(item);
    });
  }
});