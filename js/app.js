var termApp = angular.module('termApp', ['ngSanitize']);


termApp.factory('$electron', function() {
	return require('electron');
});

termApp.factory('$exec', function() {
	var commanderPath = './js/interpreter/';
	var commander = require(commanderPath + 'interpreter');

	require(commanderPath + 'commands/catch-default')(commander);

	return commander.exec;
});
