'use strict';

var app = angular.module('gtfsApp', [
  'ngRoute',
  'ngResource',
  'mainModule',
  'calendarsPageModule',
  'loginPageModule',
  'stopsPageModule',
  'routesPageModule',
  'agenciesPageModule',
  'tripsPageModule',
  'exportPageModule',
  'importPageModule',
  'dashboardPageModule'
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      redirectTo: "/dashboard"
    }).
    when('/dashboard', {
      templateUrl: 'partials/dashboard.html',
      title: 'Dashboard'
    }).
    when('/agencies', {
      templateUrl: 'partials/agencies.html',
      title: 'Agencies'
    }).
    when('/stops', {
      templateUrl: '/partials/stops.html',
      title: 'Stops'
    }).
    when('/routes', {
      templateUrl: 'partials/routes.html',
      title: 'Routes'
    }).
    when('/trips', {
      templateUrl: 'partials/trips.html',
      title: 'Trips'
    }).
    when('/settings', {
      templateUrl: 'partials/settings.html',
      title: 'Settings'
    }).
    when('/frequencies', {
      templateUrl: 'partials/frequencies.html',
      title: 'Frequencies'
    }).
    when('/import', {
      templateUrl: 'partials/import.html',
      title: 'Import'
    }).
    when('/export', {
      templateUrl: 'partials/export.html',
      title: 'Export'
    }).
    when('/calendars', {
      templateUrl: 'partials/calendars.html',
      title: 'Calendars'
    }).
    otherwise({
      redirectTo: '/dashboard'
    });
  }
]);

app.run(['$location', '$rootScope', function($location, $rootScope) {
  $rootScope.page_title = "GTFS Manager";
  $rootScope.$on('$routeChangeSuccess', function($event, $currentRoute, $previousRoute) {
    $rootScope.page_title = $currentRoute.title;
    $rootScope.loading = false;
  });
}]);

app.directive('whenScrolled', function() {
  return function(scope, elm, attr) {
    var raw = elm[0];
    elm.bind('scroll', function() {
      if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
        scope.$apply(attr.whenScrolled);
      }
    });
  };
});