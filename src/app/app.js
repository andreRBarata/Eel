angular.module('termApp', ['ngSanitize', 'jsonFormatter', 'ui.bootstrap'])
	.factory('vm', () => {
		const vm = require('../interpreter/vm');

		return vm.getInstance();
	});
