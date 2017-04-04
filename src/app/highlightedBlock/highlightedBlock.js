/**
*	Creates a highlighted code block
*	using codemirror
*	@author André Barata
*/
angular.module('termApp')
	.directive('highlightedBlock', () => {
		return {
			scope: {
				src: '=',
				mimetype: '=',
				numbers: '='
			},
			template: `
				<div ui-codemirror="{
					lineWrapping: true,
					lineNumbers: numbers,
					mode: mimetype
						.replace('application', 'text'),
					onLoad: onLoad,
					readOnly: true
				}"></div>
			`,
			controller: function HighlightedBlock ($scope) {
				$scope.doc = '';

				$scope.onLoad = (editor) => {
					if ($scope.src.pipe) {
						$scope.src
							.on('readable', () => {
								let chunk;

								while (chunk = $scope.src.read()) {
									$scope.doc += chunk;
								}

								editor.setValue($scope.doc);
							});
					}
					else {
						$scope.doc = $scope.src;

						editor.setValue($scope.doc);
					}
				};
			}
		};
	});
