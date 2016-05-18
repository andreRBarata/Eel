var termApp = angular.module('termApp', []);

termApp.factory('$exec', function() {
	return require('child_process'),exec;
});

termApp.factory('$electron', function() {
	return require('electron');
});
