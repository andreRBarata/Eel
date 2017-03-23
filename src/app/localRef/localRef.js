const opn	= require('opn');
const fs	= require('fs');

angular.module('termApp')
	.directive('localRef', () => {

		return {
			scope: {
				localRef: '='
			},
			controller:
				function localRef($scope, commandService, $element) {
					$element.on('click', () => {
						fs.stat($scope.localRef, (err, stat) => {
							if (stat.isDirectory()) {
								commandService.execute(`#cd "${
									$scope.localRef
								}"`);
							}
							else {
								opn($scope.localRef);
							}
						});


					});
				}
		}
});
