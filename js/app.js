var termApp = angular.module('termApp', []);

termApp.factory('$childProcess', function() {
	return require('child_process');
});

termApp.factory('$electron', function() {
	return require('electron');
});
