angular.module('termApp', ['ngSanitize'])
	.factory('interpreter', function() {
		const Interpreter = require('./interpreter/Interpreter');

		return new Interpreter();
	});
