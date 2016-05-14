termApp.controller("mainController", function($scope) {
	var terminal = require('child_process').spawn('bash');

	$scope.command = "";
	$scope.output = "";

	terminal.stdout.on('data', function(m) {
		// Receive results from child process
		$scope.output += m;
		$scope.$apply();
	});


	$scope.execute = (keyEvent) => {
		if (keyEvent.which === 13) {
			terminal.stdin.write(`${$scope.command}\n`);

			$scope.output += `${$scope.command}\n\n`;
		}
	}

	window.onbeforeunload = function() {
		terminal.close();
	}
});
