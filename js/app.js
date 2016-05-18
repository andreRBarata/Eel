var termApp = angular.module('termApp', ['ngSanitize']);

var vorpal = require('vorpal')();
var asDefault = require('vorpal-as-default');

vorpal
    .command('exec')
    .action(function (args, next) {

      next();
    });

termApp.factory('$ansiToHTML', function () {
	var Convert = require('ansi-to-html');
	var convert = new Convert();

	return (ansi) => {
		return convert.toHtml(ansi);
	}
});

termApp.factory('$vopal', function($ansiToHTML) {
	var remote = require('electron').remote;

	return (command) => {
		return $ansiToHTML(
			remote.require('vorpal').exec(command)
		);
	}
});

termApp.factory('$electron', function() {
	return require('electron');
});
