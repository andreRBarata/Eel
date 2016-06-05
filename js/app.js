var termApp = angular.module('termApp', ['ngSanitize']);

termApp.factory('$electron', function() {
	return require('electron');
});

termApp.factory('$exec', function() {
	var interpreter = require('./js/interpreter/interpreter');

	interpreter.use('./commands/catch-default');

	return interpreter.exec;
});
