const Highland	= require('highland');
const JsonDB	= require('node-json-db');
const remote	= require('electron').remote;
const path		= require('path');

angular.module('termApp')
	.factory('historyService', () => {
		let data = new JsonDB(
			path.join(
				remote.app.getPath('userData'),
				'data.json'
			),
			true
		);

		return {
			get() {
				if (!data.getData('/').history) {
					data.push('/history', []);
				}

				return new Highland(
					data.getData('/history')
				);
			},
			push(element) {

				this.get().done(() => {
					if (data.getData('/history[-1]') !== element) {
						data.push('/history[]', element);
					}
				});
			}
		};
	});