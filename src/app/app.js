/**
*	Sets up the AngularJS app
*	@author André Barata
*/
require('angular-ui-codemirror');

angular.module('termApp', [
	require('angular-ui-bootstrap'),
	require('jsonformatter'),
	require('ngclipboard'),
	'ui.codemirror'
]);
