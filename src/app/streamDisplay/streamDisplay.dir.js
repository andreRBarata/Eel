const Highland = require('highland');

angular.module('termApp')
	.directive('streamDisplay', () => {
		return {
			scope: {
				src: '='
			},
			controller:
				function ResultDisplayController($scope, $compile, $element) {
					let transform = (parent) => {
						let tmp = Highland
							.pipeline((src) => {
								src.filter((ele) => {
									if (ele.pipe) {
										let newParent = angular.element(
											'<div class="container"></div>'
										);
										let newTransform =
											transform(newParent);

										if (ele.listeners('data').length > 0) {
											return false;
										}

										ele.pipe(newTransform);

										ele.on('error', (err) => {
											newTransform.emit('error', err);
										});


										parent.append(newParent);
									}

									return !ele.pipe;
								})
								.map((ele) => {
									let tmpscope = $scope.$new(true);
									tmpscope.src = ele.scope;

									parent.append(
										$compile(`<section style="display: inline; class="contrainer">${ele.html}</section>`)(tmpscope)
									);

									return tmpscope;
								})
								.debounce(10)
								.each((tmpscope) => {
									tmpscope.$apply();
								});
						})
						.on('error', (err) => {
							$scope.src
								.write({
									html:
										`<div class="alert alert-danger" role="alert">{{src}}</div>`,
									scope: err.message
								});
						});

						tmp.receives = 'object/scoped-html';

						return tmp;
					}

					let rootTransform = transform($element);

					$scope.src
						.pipe(rootTransform);

					$scope.src.on('error', (err) => {
						rootTransform.emit('error', err);
					});
				}
		}
	});
