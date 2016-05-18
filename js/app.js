var termApp = angular.module('termApp', []);

termApp.factory('$ansiToHTML', function () {
	var Convert = require('ansi-to-html');
	var convert = new Convert();

	return (ansi) => {
		return convert.toHtml(ansi);
	}
});

termApp.factory('$cash', function($ansiToHTML) {
	var remote = require('electron').remote;

	return (command, options) => {
		return $ansiToHTML(
			remote.require('cash')(command, options)
		);
	}
});

termApp.factory('$electron', function() {
	return require('electron');
});
