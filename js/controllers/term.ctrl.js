termApp.controller("mainController", function($scope) {
	var exec = require('executive');
	var stream = require('stream');

	var echoStream = new stream.Writable();
	$scope.command = "";
	$scope.output = "";
	var shell = exec("/bin/bash", {options: 'interactive'}, function(err, stdout) {
		console.log("teste", stdout);
	});

	console.log(shell);

	echoStream._write = function (chunk, encoding, done) {
		$scope.output += chunk.toString();

		window.scrollTo(0,document.body.scrollHeight);
		done();
	};

	shell.stdout.pipe(echoStream);

	$scope.execute = (keyEvent) => {
		if (keyEvent.which === 13) {


			$scope.output += `${$scope.command}\n\n`;


			shell.stdin = "ls"

			console.log(shell);

		}
	}


});
