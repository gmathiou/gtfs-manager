'use strict';

var mainModule = angular.module('mainModule', []);

mainModule.controller('MainController', ['$scope', function($scope) {

}]);

mainModule.controller('NavCtrl', ['$scope', '$location', function($scope, $location) {
  $scope.sideMenuitems = [{
    path: '/dashboard',
    title: 'Dashboard'
  }, {
    path: '/agencies',
    title: 'Agencies'
  }, {
    path: '/stops',
    title: 'Stops'
  }, {
    path: '/routes',
    title: 'Routes'
  }, {
    path: '/trips',
    title: 'Trips'
  }, {
    path: '/calendars',
    title: 'Calendars'
  }, {
    path: '/frequencies',
    title: 'Frequencies'
  }];

  $scope.mainMenuitems = [{
    path: '#/import',
    title: 'Import',
    icon: 'import'
  }, {
    path: '#/export',
    title: 'Export',
    icon: 'export'
  }, {
    path: '#/settings',
    title: 'Settings',
    icon: 'cog'
  }, {
    path: '/logout',
    title: 'Log-out',
    icon: 'log-out'
  }];

  $scope.isActive = function(item) {
    if (item.path == $location.path()) {
      return true;
    }
    return false;
  }
}]);