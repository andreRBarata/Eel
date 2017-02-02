require('../assets/language/eelscript');


angular.module('termApp')
	.directive('inputHighlight', function () {
		return {
			scope: {
				onexec: '='
			},
			templateUrl: 'inputHighlight/inputHighlight.tpl.html',
			controller: function InputHighlight($scope) {
				$scope.command = '';

				$scope.cmOption = {
					lineNumbers: false,
					indentWithTabs: true,
					mode: 'eelscript',
					cursorHeight: 1,
					extraKeys: {
						Enter(cm) {
							$scope.onexec(
								$scope.command
							);

							$scope.command = '';
						}
					}
				};
			}
		};
	});
