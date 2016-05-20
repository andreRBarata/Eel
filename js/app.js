var termApp = angular.module('termApp', ['ngSanitize']);

termApp.factory('$electron', function() {
	return require('electron');
});

termApp.factory('$exec', function($electron) {
	var remote = $electron.remote;
	var vorpal = remote.require('vorpal')();

	require('./js/commands/vorpal-default')(vorpal);

	return vorpal.exec;
});
