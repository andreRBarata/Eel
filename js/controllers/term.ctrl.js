termApp.controller("mainController", function($scope, $childProcess, $electron) {

	$scope.command = "";
	$scope.output = "";

	terminal.stdout.on('data', function(m) {
		// Receive results from child process
		$scope.output += m;
		$scope.$apply();

		window.scrollTo(0,document.body.scrollHeight);
	});


	$scope.execute = (keyEvent) => {
		if (keyEvent.which === 13) {
			terminal.stdin.write(`${$scope.command}\n`);

			$scope.output += `${$scope.command}\n\n`;

			$scope.command = "";
		}
	}

	$electron.webFrame.on("close",function() {
			terminal.close();
		}
	);

	terminal.on('close', function () {
			$electron.remote.app.quit();
		}
	);
});
