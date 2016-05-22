var termApp = angular.module('termApp', ['ngSanitize']);


termApp.factory('$electron', function() {
	return require('electron');
});

termApp.factory('$exec', function($electron) {
	var remote = $electron.remote;
	var commanderPath = './js/commander/';
	var commander = require(commanderPath + 'commander')();

	require(commanderPath + 'commands/catch-default')(commander);

	return commander.exec;
});
