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
							`<section ng-cloak style="display: inline;" onload="scrollDown()">${ele.html}</section>`
						)(tmpscope);

						$timeout(() => {
							tmpscope.$apply();
							scrollDown();
						}, 10)

						return component;
					}

					function map(data) {
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

						if (typeof data.html === 'string') {
							if (typeof data.scope === 'string') {
								return compile(data);
							}
						}

						return data;
					}

					$scope.src
						.map((data) => {
							if (data instanceof Error) {
								return compile({
									html:
									`<div class="alert alert-danger" role="alert">{{src}}</div>`,
									scope: data.message
								});
							}

							return data;
						})
						.map(map)
						.compact()
						.each((ele) => {
							$element.append(ele);
						})
				}
		}
	});
