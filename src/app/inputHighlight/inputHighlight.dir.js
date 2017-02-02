angular.module('termApp')
	.directive('inputHighlight', () => {
		return {
			scope: {
				onexec: '=',
				command: '=',
				readonly: '='
			},
			compile(element, attrs) {
				console.log(attrs);
				if (!attrs.command) { attrs.command = ''; }
			},
			templateUrl: 'inputHighlight/inputHighlight.tpl.html',
			controller: function InputHighlight($scope) {
				console.log($scope);

				$scope.cmOption = {
					lineNumbers: false,
					indentWithTabs: true,
					mode: 'eelscript',
					cursorHeight: 1,
					readOnly: ($scope.readonly)?
						'nocursor': false,
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
