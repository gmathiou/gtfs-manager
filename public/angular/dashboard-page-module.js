'use strict';

var dashboardPageModule = angular.module('dashboardPageModule', [
	'modelsModule',
	'servicesModule'
]);

dashboardPageModule.controller('dashboardPageController', function($scope, $rootScope, LoadDataService, $q) {
	$rootScope.loading = true;
	getDataFromServer();

	function getDataFromServer() {
		LoadDataService.loadAgencies().
		then(LoadDataService.loadStops()).
		then(LoadDataService.loadRoutes()).
		then(LoadDataService.loadTimezones()).
		then($rootScope.loading = false);
	}
});