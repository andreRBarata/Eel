var termApp = angular.module('termApp', ['ngSanitize']);

termApp.factory('$electron', function() {
	return require('electron');
});

termApp.factory('interpreter', function() {
	var interpreter = require('./js/interpreter/interpreter');

	interpreter.use('./commands/catch-default');
	interpreter.use('./commands/command-cd');

	return interpreter;
});
