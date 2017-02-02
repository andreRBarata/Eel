require('angular-ui-codemirror');

angular.module('termApp', [
	require('angular-ui-bootstrap'),
	require('jsonformatter'),
	'ui.codemirror'
]).factory('vm', () => {
	const vm = require('../interpreter/vm');

	return vm.getInstance();
});
