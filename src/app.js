angular.module('termApp', ['ngSanitize', 'angular-json-tree'])
	.factory('vm', () => {
		const vm = require('./interpreter/vm');

		return vm.getInstance();
	});
