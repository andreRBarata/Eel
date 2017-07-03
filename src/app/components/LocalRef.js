/**
*	Creates a link to a local path
*	when the element is clicked if the given
*	path is a file it is opened by the OS
*	if its a folder a cd command is ran for it
*	@author André Barata
*/
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
							let path = $scope.localRef
								.replace(/\\/g,
									'\\\\'
								);

							if (stat.isDirectory()) {
								commandService.execute(`#cd "${
									path
								}"`);
							}
							else {
								opn(path);
							}

						});
					});
				}
		}
});
