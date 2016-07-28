angular.module('termApp', ['ngSanitize'])
	.factory('$electron', function() {
		return require('electron');
	});
