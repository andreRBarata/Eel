var termApp = angular.module('termApp', ['ngSanitize']);

termApp.factory('$electron', function() {
	return require('electron');
});

termApp.factory('homedir', function() {
	return require('homedir');
});
