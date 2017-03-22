const Highland = require('highland');

angular.module('termApp')
	.directive('streamDisplay', () => {
		return {
			scope: {
				src: '='
			},
			controller:
				function ResultDisplayController($scope, $compile, $element, $timeout) {
					function compile(ele) {
						let tmpscope = $scope.$new(true);
						let component;

						tmpscope.src = ele.scope;

						component = $compile(
							`<section style="display: inline;" ng-cloak class="contrainer">${ele.html}</section>`
						)(tmpscope);

						$timeout(
							() => tmpscope.$apply(
								scrollDown
							),
							30
						);

						return component;
					}

					$scope.src
						.map((data) => {
							if (data.pipe) {
								let stream = (data.lens)?
									data.lens('object/scoped-html'):
									data;
								let newParent = $compile(
									`<div class="container-fluid" ng-cloak></div>`
								)($scope);

								if (data.state !== 'unpiped') {
									return;
								}

								stream.on('error', (err) => {
									if (data.state === 'unpiped') {
										newParent.append(compile({
											html:
											`<div class="alert alert-danger" role="alert">{{src}}</div>`,
											scope: err.message
										}));
									}
								});

								stream.on('data', (inner) => {
									if (data.state === 'unpiped') {
										newParent.append(compile(inner));
									}
								});

								return newParent;
							}
							else {
								return compile(data);
							}

						})
						.compact()
						.each((ele) => $element.append(ele));
				}
		}
	});
