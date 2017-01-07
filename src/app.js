angular.module('termApp', ['ngSanitize'])
	.factory('vm', function() {
		const vm = require('./interpreter/vm');

		return vm.getInstance();
	});
