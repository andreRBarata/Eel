angular.module('termApp', ['ngSanitize', 'jsonFormatter'])
	.factory('vm', () => {
		const vm = require('./interpreter/vm');

		return vm.getInstance();
	});
