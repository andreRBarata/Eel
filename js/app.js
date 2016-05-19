var termApp = angular.module('termApp', ['ngSanitize']);

termApp.factory('$exec', function() {
	return require('child_process').spawn;
});

termApp.factory('$electron', function() {
	return require('electron');
});
